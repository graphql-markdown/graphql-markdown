// Generates the derived fields of each published package's jsr.json from its
// package.json: name, version and license, plus the version ranges of the
// `imports` (workspace packages use `jsr:@graphql-markdown/<pkg>@^<version>`,
// others the range declared in `dependencies`/`peerDependencies`, with `catalog:`
// resolved from the root package.json). The set of import keys, `exports` and
// `publish` stay hand-written. Packages that mirror their version in a source
// constant (core's `src/version.ts`) get that constant rewritten too.
//
// Default mode writes the files that changed; `--check` only reports them and
// exits 1 (used in CI). Run directly by Node (>= 22.18) through type stripping,
// so it must stay within erasable syntax: no enums, no parameter properties, no
// namespaces.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const JSR_PACKAGES = [
  "types",
  "utils",
  "logger",
  "graphql",
  "helpers",
  "formatters",
  "printer-legacy",
  "diff",
  "telemetry",
  "core",
] as const;

// Source files exporting `VERSION` as a literal, regenerated from package.json.
export const VERSION_CONSTANTS: Partial<
  Record<(typeof JSR_PACKAGES)[number], string>
> = { core: "src/version.ts" };
const VERSION_CONSTANT =
  /(export const VERSION\s*(?::\s*string\s*)?=\s*")([^"]*)(")/;

// Source files holding the Deno version ranges of optional dependencies.
export const OPTIONAL_DEPENDENCY_FILES: Record<string, string> = {
  core: "src/optional-dependencies.ts",
  utils: "src/optional-dependencies.ts",
};

// JSR import maps cannot express `||` ranges; use supported target ranges.
export const JSR_RANGE_OVERRIDES: Record<string, string> = {
  graphql: "^17.0.0",
  "@graphql-tools/graphql-file-loader": "9.0.6",
};

const SCOPE = "@graphql-markdown/";

type Json = Record<string, unknown>;
type Resolved = { value?: string; problem?: string };

const packagesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const rootDir = join(packagesDir, "..");

const asRecord = (value: unknown): Json =>
  typeof value === "object" && value !== null ? (value as Json) : {};

const readJson = (path: string): Json =>
  JSON.parse(readFileSync(path, "utf8")) as Json;

// Resolves `catalog:` and `catalog:<group>` against the root workspaces.
export const resolveCatalog = (
  spec: string,
  name: string,
  root: Json,
): string | undefined => {
  const workspaces = asRecord(root.workspaces);
  const group = spec.slice("catalog:".length);
  const catalog =
    group === ""
      ? asRecord(workspaces.catalog)
      : asRecord(asRecord(workspaces.catalogs)[group]);
  const range = catalog[name];
  return typeof range === "string" ? range : undefined;
};

const declaredRange = (name: string, pkg: Json): string | undefined => {
  const dep =
    asRecord(pkg.dependencies)[name] ?? asRecord(pkg.peerDependencies)[name];
  return typeof dep === "string" ? dep : undefined;
};

const jsrRange = (name: string, range: string): Resolved => {
  const override = JSR_RANGE_OVERRIDES[name];
  if (override !== undefined) {
    return { value: override };
  }
  return range.includes("||")
    ? { problem: `"${name}" range "${range}" needs a JSR override` }
    : { value: range };
};

// Range of an npm dependency as it must appear in a JSR import map.
export const resolveRange = (name: string, pkg: Json, root: Json): Resolved => {
  const declared = declaredRange(name, pkg);
  if (declared === undefined) {
    return { problem: `"${name}" not in dependencies or peerDependencies` };
  }
  const range = declared.startsWith("catalog:")
    ? resolveCatalog(declared, name, root)
    : declared;
  return range === undefined
    ? { problem: `"${name}" ${declared} not found in root catalog` }
    : jsrRange(name, range);
};

const resolveWorkspaceImport = (
  key: string,
  versions: Map<string, string>,
): Resolved => {
  const version = versions.get(key);
  return version === undefined
    ? { problem: `"${key}" is not a known workspace package` }
    : { value: `jsr:${key}@^${version}` };
};

const resolveNpmImport = (key: string, pkg: Json, root: Json): Resolved => {
  const subpath = key.endsWith("/");
  const base = subpath ? key.slice(0, -1) : key;
  const { value, problem } = resolveRange(base, pkg, root);
  if (value === undefined) {
    return { problem };
  }
  return { value: subpath ? `npm:/${base}@${value}/` : `npm:${base}@${value}` };
};

const resolveImport = (
  key: string,
  pkg: Json,
  root: Json,
  versions: Map<string, string>,
): Resolved =>
  key.startsWith(SCOPE)
    ? resolveWorkspaceImport(key, versions)
    : resolveNpmImport(key, pkg, root);

// Same keys, same order as the current imports, with recomputed values.
export const expectedImports = (
  current: unknown,
  pkg: Json,
  root: Json,
  versions: Map<string, string>,
): { imports: Json; problems: string[] } => {
  const imports: Json = {};
  const problems: string[] = [];
  for (const [key, old] of Object.entries(asRecord(current))) {
    const { value, problem } = resolveImport(key, pkg, root, versions);
    imports[key] = value ?? old;
    if (problem !== undefined) {
      problems.push(`imports.${key}: ${problem}`);
    }
  }
  return { imports, problems };
};

export const expectedJsr = (
  jsr: Json,
  pkg: Json,
  root: Json,
  versions: Map<string, string>,
): { jsr: Json; problems: string[] } => {
  const { imports, problems } = expectedImports(
    jsr.imports,
    pkg,
    root,
    versions,
  );
  const next: Json = { ...jsr };
  for (const field of ["name", "version", "license"]) {
    next[field] = pkg[field];
  }
  if ("imports" in jsr) {
    next.imports = imports;
  }
  return { jsr: next, problems };
};

export const syncVersionConstant = (source: string, version: string): string =>
  source.replace(
    VERSION_CONSTANT,
    (_m, pre: string, _v: string, post: string) => `${pre}${version}${post}`,
  );

// Top-level fields (and import keys) whose value differs.
export const diffFields = (before: Json, after: Json): string[] => {
  const diffs: string[] = [];
  for (const key of Object.keys(after)) {
    if (JSON.stringify(before[key]) === JSON.stringify(after[key])) {
      continue;
    }
    if (key === "imports") {
      diffs.push(...diffImports(asRecord(before[key]), asRecord(after[key])));
    } else {
      diffs.push(
        `${key}: ${JSON.stringify(before[key])} -> ${JSON.stringify(after[key])}`,
      );
    }
  }
  return diffs;
};

const diffImports = (before: Json, after: Json): string[] =>
  Object.keys(after)
    .filter((key) => before[key] !== after[key])
    .map(
      (key) =>
        `imports.${key}: ${JSON.stringify(before[key])} -> ${JSON.stringify(after[key])}`,
    );

type Change = { file: string; text: string; diffs: string[] };

const formatJson = async (obj: Json, filepath: string): Promise<string> => {
  const prettier = await import("prettier");
  const options = (await prettier.resolveConfig(filepath)) ?? {};
  return prettier.format(JSON.stringify(obj, null, 2) + "\n", {
    ...options,
    parser: "json",
    filepath,
  });
};

const syncJsr = async (
  dir: string,
  root: Json,
  versions: Map<string, string>,
  problems: string[],
): Promise<Change[]> => {
  const pkg = readJson(join(packagesDir, dir, "package.json"));
  const file = join(packagesDir, dir, "jsr.json");
  const current = readJson(file);
  const next = expectedJsr(current, pkg, root, versions);
  problems.push(...next.problems.map((p) => `${dir}: ${p}`));
  const text = await formatJson(next.jsr, file);
  return text === readFileSync(file, "utf8")
    ? []
    : [{ file, text, diffs: diffFields(current, next.jsr) }];
};

const syncConstant = (dir: string, version: string): Change[] => {
  const constantFile = VERSION_CONSTANTS[dir as keyof typeof VERSION_CONSTANTS];
  if (constantFile === undefined) {
    return [];
  }
  const file = join(packagesDir, dir, constantFile);
  const source = readFileSync(file, "utf8");
  const text = syncVersionConstant(source, version);
  return text === source
    ? []
    : [{ file, text, diffs: [`VERSION -> "${version}"`] }];
};

// Resolves a declared spec to the caret range used when loading on Deno.
const optionalSpec = (
  name: string,
  declared: string,
  root: Json,
  versions: Map<string, string>,
): string | undefined => {
  if (declared.startsWith("catalog:")) {
    return resolveCatalog(declared, name, root);
  }
  if (/^workspace:[*^~]$/.test(declared)) {
    const version = versions.get(name);
    return version === undefined ? undefined : `^${version}`;
  }
  return declared;
};

const caretExact = (range: string): string =>
  /^\d+\.\d+\.\d+$/.test(range) ? `^${range}` : range;

// Range of an optional dependency as passed to `runtimeModuleSpecifier`.
export const resolveOptionalRange = (
  name: string,
  pkg: Json,
  root: Json,
  versions: Map<string, string>,
): Resolved => {
  const declared = declaredRange(name, pkg);
  if (declared === undefined) {
    return { problem: `"${name}" not in dependencies or peerDependencies` };
  }
  const range = optionalSpec(name, declared, root, versions);
  if (range === undefined) {
    return { problem: `"${name}" ${declared} cannot be resolved` };
  }
  return range.includes("||")
    ? { problem: `"${name}" range "${range}" is not supported on Deno` }
    : { value: caretExact(range) };
};

const escapeRegExp = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Rewrites only the string values of `"<key>": "<value>"` entries.
export const rewriteOptionalRanges = (
  source: string,
  ranges: Record<string, string>,
): string => {
  let text = source;
  for (const [key, range] of Object.entries(ranges)) {
    const entry = new RegExp(
      `(^\\s*"?${escapeRegExp(key)}"?:\\s*")[^"]*(")`,
      "m",
    );
    text = text.replace(
      entry,
      (_m, pre: string, post: string) => `${pre}${range}${post}`,
    );
  }
  return text;
};

const currentKeys = (source: string): string[] =>
  [...source.matchAll(/^\s*"?([^"\s:]+)"?:\s*"[^"]*",?$/gm)].map((m) => m[1]);

export const diffOptionalRanges = (
  before: string,
  after: string,
  keys: string[],
): string[] => {
  const read = (source: string, key: string): string | undefined =>
    new RegExp(`^\\s*"?${escapeRegExp(key)}"?:\\s*"([^"]*)"`, "m").exec(
      source,
    )?.[1];
  return keys
    .filter((key) => read(before, key) !== read(after, key))
    .map((key) => `${key}: ${read(before, key)} -> ${read(after, key)}`);
};

const resolveOptionalRanges = (
  keys: string[],
  pkg: Json,
  root: Json,
  versions: Map<string, string>,
): { ranges: Record<string, string>; problems: string[] } => {
  const ranges: Record<string, string> = {};
  const problems: string[] = [];
  for (const key of keys) {
    const { value, problem } = resolveOptionalRange(key, pkg, root, versions);
    if (value !== undefined) {
      ranges[key] = value;
    }
    if (problem !== undefined) {
      problems.push(problem);
    }
  }
  return { ranges, problems };
};

const syncOptional = (
  dir: string,
  root: Json,
  versions: Map<string, string>,
  problems: string[],
): Change[] => {
  const relative = OPTIONAL_DEPENDENCY_FILES[dir];
  if (relative === undefined) {
    return [];
  }
  const pkg = readJson(join(packagesDir, dir, "package.json"));
  const file = join(packagesDir, dir, relative);
  const source = readFileSync(file, "utf8");
  const keys = currentKeys(source);
  const resolved = resolveOptionalRanges(keys, pkg, root, versions);
  problems.push(...resolved.problems.map((p) => `${dir}: ${relative}: ${p}`));
  const text = rewriteOptionalRanges(source, resolved.ranges);
  return text === source
    ? []
    : [{ file, text, diffs: diffOptionalRanges(source, text, keys) }];
};

const collectChanges = async (problems: string[]): Promise<Change[]> => {
  const root = readJson(join(rootDir, "package.json"));
  const versions = new Map<string, string>(
    JSR_PACKAGES.map((dir) => {
      const pkg = readJson(join(packagesDir, dir, "package.json"));
      return [String(pkg.name), String(pkg.version)];
    }),
  );
  const changes: Change[] = [];
  for (const dir of JSR_PACKAGES) {
    const version = versions.get(
      String(readJson(join(packagesDir, dir, "package.json")).name),
    ) as string;
    changes.push(...(await syncJsr(dir, root, versions, problems)));
    changes.push(...syncConstant(dir, version));
    changes.push(...syncOptional(dir, root, versions, problems));
  }
  return changes;
};

const report = (changes: Change[], check: boolean): void => {
  for (const { file, text, diffs } of changes) {
    if (!check) {
      writeFileSync(file, text);
    }
    const label = check ? "out of sync" : "updated";
    console.log(`${label} ${file.slice(rootDir.length + 1)}`);
    console.log(`  ${diffs.join("\n  ")}`);
  }
};

const reportProblems = (problems: string[]): void => {
  if (problems.length > 0) {
    console.error(`jsr.json problems:\n${problems.join("\n")}`);
  }
};

const logIfClean = (clean: boolean): void => {
  if (clean) {
    console.log(`jsr.json OK for ${JSR_PACKAGES.length} packages`);
  }
};

const main = async (check: boolean): Promise<number> => {
  const problems: string[] = [];
  const changes = await collectChanges(problems);
  report(changes, check);
  reportProblems(problems);
  const dirty = problems.length > 0 || (check && changes.length > 0);
  logIfClean(changes.length === 0 && !dirty);
  return Number(dirty);
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  process.exitCode = await main(process.argv.includes("--check"));
}
