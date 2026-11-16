// Keeps the `@graphql-markdown/*` dependency ranges of the scaffolder templates
// (`packages/create-graphql-markdown-docs/templates/*/package.json`) in step
// with the current workspace versions: each range becomes `^<version>`. When a
// range moves, a patch changeset for `create-graphql-markdown-docs` is written
// so the scaffolder is released with the new ranges.
//
// Default mode writes the files that changed; `--check` only reports them and
// exits 1 (used in CI). Run directly by Node (>= 22.18) through type stripping,
// so it must stay within erasable syntax: no enums, no parameter properties, no
// namespaces.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCOPE = "@graphql-markdown/";
const SCAFFOLDER = "create-graphql-markdown-docs";
const CHANGESET_FILE = "sync-template-ranges.md";

export type Change = { file: string; diffs: string[]; text: string };

const defaultRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

const escapeRegExp = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Versions of the workspace packages, keyed by package name.
export const readVersions = (rootDir: string): Map<string, string> => {
  const packagesDir = join(rootDir, "packages");
  const versions = new Map<string, string>();
  for (const dir of readdirSync(packagesDir)) {
    const file = join(packagesDir, dir, "package.json");
    if (!existsSync(file)) {
      continue;
    }
    const pkg = JSON.parse(readFileSync(file, "utf8")) as {
      name?: string;
      version?: string;
    };
    if (pkg.name?.startsWith(SCOPE) && pkg.version !== undefined) {
      versions.set(pkg.name, pkg.version);
    }
  }
  return versions;
};

// Rewrites only the string values of the workspace `"<name>": "<range>"` entries.
export const rewriteRanges = (
  source: string,
  versions: Map<string, string>,
): { text: string; diffs: string[] } => {
  const diffs: string[] = [];
  let text = source;
  for (const [name, version] of versions) {
    const entry = new RegExp(`(\\n\\s*"${escapeRegExp(name)}"\\s*:\\s*")([^"]*)(")`);
    text = text.replace(entry, (match, pre: string, old: string, post: string) => {
      if (old === `^${version}`) {
        return match;
      }
      diffs.push(`${name}: ${old} -> ^${version}`);
      return `${pre}^${version}${post}`;
    });
  }
  return { text, diffs };
};

export const collectChanges = (rootDir: string): Change[] => {
  const versions = readVersions(rootDir);
  const templates = join(rootDir, "packages", SCAFFOLDER, "templates");
  const changes: Change[] = [];
  for (const dir of readdirSync(templates)) {
    const file = join(templates, dir, "package.json");
    if (!existsSync(file)) {
      continue;
    }
    const { text, diffs } = rewriteRanges(readFileSync(file, "utf8"), versions);
    if (diffs.length > 0) {
      changes.push({ file, diffs, text });
    }
  }
  return changes;
};

export const changesetText = (changes: Change[], rootDir: string): string => {
  const lines = changes.flatMap(({ file, diffs }) =>
    diffs.map((diff) => `- ${file.slice(rootDir.length + 1)}: ${diff}`),
  );
  return [
    "---",
    `"${SCAFFOLDER}": patch`,
    "---",
    "",
    "Update the `@graphql-markdown/*` dependency ranges of the project templates.",
    "",
    ...lines.map((line) => line.replace(/^- .*\/templates\//, "- ")),
    "",
  ].join("\n");
};

// Returns the process exit code.
export const run = (rootDir: string, check: boolean): number => {
  const changes = collectChanges(rootDir);
  for (const { file, diffs, text } of changes) {
    if (!check) {
      writeFileSync(file, text);
    }
    console.log(`${check ? "out of sync" : "updated"} ${file.slice(rootDir.length + 1)}`);
    console.log(`  ${diffs.join("\n  ")}`);
  }
  if (changes.length === 0) {
    console.log("template ranges OK");
    return 0;
  }
  if (check) {
    return 1;
  }
  const dir = join(rootDir, ".changeset");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, CHANGESET_FILE), changesetText(changes, rootDir));
  console.log(`wrote .changeset/${CHANGESET_FILE}`);
  return 0;
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = run(defaultRoot, process.argv.includes("--check"));
}
