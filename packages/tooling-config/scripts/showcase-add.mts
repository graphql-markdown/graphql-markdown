// Adds a site to the website showcase: copies (or downloads) a PNG screenshot
// to `website/static/img/showcase/<uuid>.png` and inserts an entry into
// `website/src/data/showcase.json`, keeping the list sorted by name.
//
//   bun run showcase:add -- --name Kaizen \
//     --url https://docs.ktckts.com/api/management/ \
//     --image ~/Desktop/screenshot.png [--featured]
//
// `--image` takes a local path or an http(s) URL (e.g. a GitHub issue
// attachment). Missing values are prompted for. Run directly by Node
// (>= 22.18) through type stripping, so it must stay within erasable syntax.

import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
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

export const isPng = (bytes: Uint8Array): boolean =>
  PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);

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
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`URL must be http(s): ${value}`);
  }
  return value;
};

const sameUrl = (a: string, b: string): boolean =>
  a.replace(/\/+$/, "").toLowerCase() === b.replace(/\/+$/, "").toLowerCase();

const compareNames = (a: ShowcaseEntry, b: ShowcaseEntry): number =>
  a.name.localeCompare(b.name, "en", { sensitivity: "base" });

export const insertEntry = (
  entries: ShowcaseEntry[],
  entry: ShowcaseEntry,
): ShowcaseEntry[] => {
  const duplicate = entries.find(
    (s) =>
      s.name.toLowerCase() === entry.name.toLowerCase() ||
      sameUrl(s.href, entry.href),
  );
  if (duplicate) {
    throw new Error(
      `Already in showcase: ${duplicate.name} (${duplicate.href})`,
    );
  }
  return [...entries, entry].sort(compareNames);
};

const expandHome = (path: string): string =>
  path.startsWith("~/") ? join(homedir(), path.slice(2)) : path;

export const isRemote = (source: string): boolean =>
  /^https?:\/\//i.test(source);

export const loadImage = async (source: string): Promise<Uint8Array> => {
  let bytes: Uint8Array;
  if (isRemote(source)) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Download failed (${response.status}): ${source}`);
    }
    bytes = new Uint8Array(await response.arrayBuffer());
  } else {
    bytes = await readFile(resolve(expandHome(source)));
  }
  if (!isPng(bytes)) {
    throw new Error(`Not a PNG image: ${source}`);
  }
  return bytes;
};

const promptMissing = async (options: Options): Promise<Required<Options>> => {
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

  const bytes = await loadImage(options.image.trim());
  const imageFile = join(IMAGE_DIR, `${image}.png`);
  await writeFile(imageFile, bytes);
  await writeFile(DATA_FILE, `${JSON.stringify(next, null, 2)}\n`);

  const rel = (file: string): string => file.slice(rootDir.length + 1);
  console.log(`Added ${name} → ${href}`);
  console.log(`  ${rel(DATA_FILE)}`);
  console.log(`  ${rel(imageFile)} (${Math.round(bytes.length / 1024)} KB)`);
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    await main(process.argv.slice(2));
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
  }
}
