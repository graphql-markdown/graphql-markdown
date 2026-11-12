// Adds a site to the website showcase: copies (or downloads) a PNG screenshot
// to `website/static/img/showcase/<uuid>.png` and inserts an entry into
// `website/src/data/showcase.json`, inserting in name order without
// reordering existing entries.
//
//   bun run showcase:add -- --name Kaizen \
//     --url https://docs.ktckts.com/api/management/ \
//     --image ~/Desktop/screenshot.png [--featured]
//
// `--image` takes a local path or an http(s) URL (e.g. a GitHub issue
// attachment). Missing values are prompted for. Run directly by Node
// (>= 22.18) through type stripping, so it must stay within erasable syntax.

import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { readFile, stat, unlink, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

export type ShowcaseEntry = {
  name: string;
  href: string;
  image: string;
  featured: boolean;
};

export type Options = {
  name?: string;
  url?: string;
  image?: string;
  featured: boolean;
};

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const DATA_FILE = join(rootDir, "website/src/data/showcase.json");
const IMAGE_DIR = join(rootDir, "website/static/img/showcase");

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const MAX_WIDTH = 1800;
const MAX_BYTES = 10 * 1024 * 1024;

// Signature (8) + IHDR length/type (8) + width (4) + height (4).
const PNG_HEADER_BYTES = 24;

export const isPng = (bytes: Uint8Array): boolean =>
  bytes.length >= PNG_HEADER_BYTES &&
  PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);

export const pngWidth = (bytes: Uint8Array): number =>
  new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(
    16,
    false,
  );

// Cleans a path pasted or dragged into the terminal (quotes, shell escapes).
export const cleanPath = (input: string): string => {
  let value = input.trim();
  if (
    value.length >= 2 &&
    (value[0] === '"' || value[0] === "'") &&
    value.at(-1) === value[0]
  ) {
    value = value.slice(1, -1);
  }
  // Backslashes are path separators on Windows, shell escapes elsewhere.
  return process.platform === "win32" ? value : value.replace(/\\(.)/g, "$1");
};

export const parseOptions = (argv: string[]): Options => {
  const { values } = parseArgs({
    // `bun run showcase:add -- --name …` forwards the `--` separator.
    args: argv[0] === "--" ? argv.slice(1) : argv,
    options: {
      name: { type: "string" },
      url: { type: "string" },
      image: { type: "string" },
      featured: { type: "boolean", default: false },
    },
    strict: true,
  });
  return values as Options;
};

export const validateUrl = (value: string): string => {
  // Require an explicit `http(s)://` prefix: `new URL` also accepts
  // `https:docs.example.com`, which renders as a relative link.
  if (!isRemote(value) || !URL.canParse(value)) {
    throw new Error(`URL must start with http:// or https://: ${value}`);
  }
  return value;
};

export const urlKey = (href: string): string => {
  try {
    const url = new URL(href);
    const host = url.host.replace(/^www\./, "");
    // Lowercased as a whole: docs paths differing only by case are the same site.
    return `${host}${url.pathname.replace(/\/+$/, "")}`.toLowerCase();
  } catch {
    return href.trim().toLowerCase();
  }
};

const compareNames = (a: ShowcaseEntry, b: ShowcaseEntry): number =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" });

export const insertEntry = (
  entries: ShowcaseEntry[],
  entry: ShowcaseEntry,
): ShowcaseEntry[] => {
  const duplicate = entries.find(
    (s) =>
      s.name.toLowerCase() === entry.name.toLowerCase() ||
      urlKey(s.href) === urlKey(entry.href),
  );
  if (duplicate) {
    throw new Error(
      `Already in showcase: ${duplicate.name} (${duplicate.href})`,
    );
  }
  const index = entries.findIndex((s) => compareNames(s, entry) > 0);
  return index === -1
    ? [...entries, entry]
    : [...entries.slice(0, index), entry, ...entries.slice(index)];
};

const expandHome = (path: string): string =>
  path.startsWith("~/") ? join(homedir(), path.slice(2)) : path;

export const resolveImagePath = (
  source: string,
  cwd: string = process.env.INIT_CWD ?? process.cwd(),
): string => resolve(cwd, expandHome(source));

export const isRemote = (source: string): boolean =>
  /^https?:\/\//i.test(source);

export const loadImage = async (source: string): Promise<Uint8Array> => {
  const tooLarge = (): Error => new Error(`Image larger than 10 MB: ${source}`);
  let bytes: Uint8Array;
  if (isRemote(source)) {
    const response = await fetch(source, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      throw new Error(`Download failed (${response.status}): ${source}`);
    }
    if (Number(response.headers.get("content-length")) > MAX_BYTES) {
      throw tooLarge();
    }
    bytes = new Uint8Array(await response.arrayBuffer());
  } else {
    bytes = await readFile(resolveImagePath(source));
  }
  if (bytes.length > MAX_BYTES) {
    throw tooLarge();
  }
  if (!isPng(bytes)) {
    throw new Error(`Not a PNG image: ${source}`);
  }
  return bytes;
};

export const promptMissing = async (
  options: Options,
): Promise<Required<Options>> => {
  const missing = (["name", "url", "image"] as const).filter(
    (key) => !options[key],
  );
  if (missing.length === 0) {
    return options as Required<Options>;
  }
  if (!stdin.isTTY) {
    throw new Error(`Missing required option(s): --${missing.join(", --")}`);
  }
  const rl = createInterface({ input: stdin, output: stdout });
  const labels = {
    name: "Site name",
    url: "Documentation URL",
    image: "Screenshot (PNG path or URL)",
  };
  try {
    const answers = { ...options };
    for (const key of missing) {
      answers[key] = (await rl.question(`${labels[key]}: `)).trim();
    }
    if (!options.featured) {
      const featured = await rl.question("Featured? (y/N): ");
      answers.featured = /^y(es)?$/i.test(featured.trim());
    }
    return answers as Required<Options>;
  } finally {
    rl.close();
  }
};

const main = async (argv: string[]): Promise<void> => {
  const options = await promptMissing(parseOptions(argv));
  const name = options.name.trim();
  if (!name) {
    throw new Error("Site name is required");
  }
  const href = validateUrl(options.url.trim());
  const imageSource = cleanPath(options.image);
  if (!imageSource) {
    throw new Error("Screenshot is required");
  }

  const entries = JSON.parse(
    await readFile(DATA_FILE, "utf8"),
  ) as ShowcaseEntry[];
  const image = randomUUID();
  const next = insertEntry(entries, {
    name,
    href,
    image,
    featured: options.featured,
  });

  const bytes = await loadImage(imageSource);
  const imageFile = join(IMAGE_DIR, `${image}.png`);
  await writeFile(imageFile, bytes);
  try {
    await writeFile(DATA_FILE, `${JSON.stringify(next, null, 2)}\n`);
  } catch (error) {
    await unlink(imageFile).catch(() => undefined);
    throw error;
  }

  const width = pngWidth(bytes);
  if (width > MAX_WIDTH) {
    let resized = false;
    if (process.platform === "darwin") {
      try {
        execFileSync("sips", ["-Z", String(MAX_WIDTH), imageFile], {
          stdio: "ignore",
        });
        resized = true;
      } catch {
        // fall through to the warning
      }
    }
    if (!resized) {
      console.warn(
        `Image is ${width}px wide and should be downscaled to <=${MAX_WIDTH}px.`,
      );
    }
  }
  const { size } = await stat(imageFile);

  const rel = (file: string): string => relative(rootDir, file);
  console.log(`Added ${name} → ${href}`);
  console.log(`  ${rel(DATA_FILE)}`);
  console.log(`  ${rel(imageFile)} (${Math.round(size / 1024)} KB)`);
};

const isMain = (): boolean => {
  try {
    return (
      realpathSync(process.argv[1] ?? "") ===
      realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return false;
  }
};

if (isMain()) {
  try {
    await main(process.argv.slice(2));
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}
