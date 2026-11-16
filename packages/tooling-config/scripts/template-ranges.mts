// Keeps the `@graphql-markdown/*` dependency ranges of the scaffolder templates
// (`packages/create-graphql-markdown-docs/templates/*/package.json`) in step
// with the workspace versions: each range becomes `^<version>`. When a range
// moves, a patch changeset for `create-graphql-markdown-docs` is written so the
// scaffolder is released with the new ranges.
//
// Modes:
//   --plan   before `changeset version`: predicts the versions the packages
//            will have (by running `changeset version` on a scratch copy of the
//            manifests), and writes the scaffolder changeset when a range will
//            move. Changes no range. Exits 1 when no changeset is pending.
//   --apply  after `changeset version`: rewrites the ranges (default mode).
//   --check  reports out-of-sync ranges and exits 1 (used in CI).
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCOPE = "@graphql-markdown/";
const SCAFFOLDER = "create-graphql-markdown-docs";
const CHANGESET_FILE = "sync-template-ranges.md";

export type Mode = "plan" | "apply" | "check";

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

export const collectChanges = (
  rootDir: string,
  versions: Map<string, string>,
): Change[] => {
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

const changesetBin = join(defaultRoot, "node_modules", ".bin", "changeset");

// Versions the workspace packages will have once `changeset version` has run,
// or `undefined` when no changeset is pending. `changeset version` runs on a
// scratch copy of the manifests (no git needed), so the real cascade rules of
// the repository config apply, including `updateInternalDependents`. The
// scaffolder changeset of this script is left out: it is recomputed from the
// result and only bumps the scaffolder itself.
export const planVersions = (
  rootDir: string,
): Map<string, string> | undefined => {
  const source = join(rootDir, ".changeset");
  const pending = readdirSync(source).filter(
    (name) =>
      name.endsWith(".md") && name !== "README.md" && name !== CHANGESET_FILE,
  );
  if (pending.length === 0) {
    return undefined;
  }
  const scratch = mkdtempSync(join(tmpdir(), "template-ranges-plan-"));
  try {
    writeFileSync(
      join(scratch, "package.json"),
      JSON.stringify({ name: "scratch", private: true, workspaces: ["packages/*"] }),
    );
    // Workspace detection for bun requires a lockfile next to the root manifest.
    writeFileSync(join(scratch, "bun.lock"), "");
    mkdirSync(join(scratch, ".changeset"));
    const config = JSON.parse(readFileSync(join(source, "config.json"), "utf8"));
    config.changelog = false;
    writeFileSync(join(scratch, ".changeset", "config.json"), JSON.stringify(config));
    for (const name of pending) {
      copyFileSync(join(source, name), join(scratch, ".changeset", name));
    }
    const packagesDir = join(rootDir, "packages");
    for (const dir of readdirSync(packagesDir)) {
      const file = join(packagesDir, dir, "package.json");
      if (existsSync(file)) {
        mkdirSync(join(scratch, "packages", dir), { recursive: true });
        copyFileSync(file, join(scratch, "packages", dir, "package.json"));
      }
    }
    execFileSync(changesetBin, ["version"], { cwd: scratch, stdio: "pipe" });
    return readVersions(scratch);
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
};

const writeChangeset = (changes: Change[], rootDir: string): void => {
  const dir = join(rootDir, ".changeset");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, CHANGESET_FILE), changesetText(changes, rootDir));
  console.log(`wrote .changeset/${CHANGESET_FILE}`);
};

// Returns the process exit code.
export const run = (rootDir: string, mode: Mode): number => {
  let versions = readVersions(rootDir);
  if (mode === "plan") {
    const planned = planVersions(rootDir);
    if (planned === undefined) {
      console.error("no changeset pending: nothing to version");
      return 1;
    }
    versions = planned;
  }
  const changes = collectChanges(rootDir, versions);
  for (const { file, diffs, text } of changes) {
    if (mode === "apply") {
      writeFileSync(file, text);
    }
    const label = { plan: "will update", apply: "updated", check: "out of sync" }[mode];
    console.log(`${label} ${file.slice(rootDir.length + 1)}`);
    console.log(`  ${diffs.join("\n  ")}`);
  }
  if (changes.length === 0) {
    console.log("template ranges OK");
    return 0;
  }
  if (mode === "plan") {
    writeChangeset(changes, rootDir);
  }
  return mode === "check" ? 1 : 0;
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const mode: Mode = process.argv.includes("--check")
    ? "check"
    : process.argv.includes("--plan")
      ? "plan"
      : "apply";
  process.exitCode = run(defaultRoot, mode);
}
