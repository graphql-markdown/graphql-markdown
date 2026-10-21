// Checks that each published package's jsr.json stays in sync with its
// package.json: same name, version and license, and every
// `jsr:@graphql-markdown/<pkg>@^<version>` import must match the version of the
// workspace package it points to. Packages that mirror their version in a
// source constant (core's `src/version.ts`) are checked against package.json too.
//
// Run directly by Node (>= 22.18) through type stripping, so it must stay
// within erasable syntax: no enums, no parameter properties, no namespaces.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const JSR_PACKAGES = [
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

// Source files exporting `VERSION` as a literal, kept in sync by hand.
const VERSION_CONSTANTS: Partial<
  Record<(typeof JSR_PACKAGES)[number], string>
> = { core: "src/version.ts" };
const VERSION_CONSTANT =
  /export const VERSION\s*(?::\s*string\s*)?=\s*"([^"]*)"/;

const SCOPE = "@graphql-markdown/";
const JSR_IMPORT = /^jsr:(@graphql-markdown\/[^@]+)@(.+)$/;

const packagesDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const readJson = (path: string): Record<string, unknown> => {
  return JSON.parse(readFileSync(path, "utf8"));
};

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};

const versions = new Map<string, string>(
  JSR_PACKAGES.map((dir) => {
    const pkg = readJson(join(packagesDir, dir, "package.json"));
    return [String(pkg.name), String(pkg.version)];
  }),
);

const checkPackageFields = (
  dir: string,
  pkg: Record<string, unknown>,
  jsr: Record<string, unknown>,
  problems: string[],
): void => {
  for (const field of ["name", "version", "license"]) {
    if (jsr[field] !== pkg[field]) {
      problems.push(
        `${dir}: ${field} "${String(jsr[field])}" differs from package.json "${String(pkg[field])}"`,
      );
    }
  }
};

const readVersionConstantSource = (
  dir: string,
  constantFile: string,
): string => {
  try {
    return readFileSync(join(packagesDir, dir, constantFile), "utf8");
  } catch {
    return "";
  }
};

const checkVersionConstant = (
  dir: string,
  pkg: Record<string, unknown>,
  problems: string[],
): void => {
  const constantFile = VERSION_CONSTANTS[dir as keyof typeof VERSION_CONSTANTS];
  if (constantFile === undefined) {
    return;
  }
  const source = readVersionConstantSource(dir, constantFile);
  const found = VERSION_CONSTANT.exec(source)?.[1];
  if (found !== pkg.version) {
    problems.push(
      `${dir}: ${constantFile} VERSION "${String(found)}" differs from package.json "${String(pkg.version)}"`,
    );
  }
};

const checkImportVersion = (
  dir: string,
  alias: string,
  match: RegExpExecArray,
  problems: string[],
): void => {
  const expected = versions.get(match[1]);
  if (expected === undefined || match[1] !== alias) {
    problems.push(`${dir}: imports.${alias} targets unknown "${match[1]}"`);
    return;
  }
  if (match[2] !== `^${expected}`) {
    problems.push(
      `${dir}: imports.${alias} range "${match[2]}" does not match workspace version ^${expected}`,
    );
  }
};

const checkImport = (
  dir: string,
  alias: string,
  target: unknown,
  problems: string[],
): void => {
  if (!alias.startsWith(SCOPE) || typeof target !== "string") {
    return;
  }
  const match = JSR_IMPORT.exec(target);
  if (match === null) {
    problems.push(`${dir}: imports.${alias} "${target}" is not a jsr: range`);
    return;
  }
  checkImportVersion(dir, alias, match, problems);
};

const checkImports = (
  dir: string,
  imports: unknown,
  problems: string[],
): void => {
  for (const [alias, target] of Object.entries(asRecord(imports))) {
    checkImport(dir, alias, target, problems);
  }
};

export const checkPackage = (dir: string): string[] => {
  const pkg = readJson(join(packagesDir, dir, "package.json"));
  let jsr: Record<string, unknown>;
  try {
    jsr = readJson(join(packagesDir, dir, "jsr.json"));
  } catch {
    return [`${dir}: missing or invalid jsr.json`];
  }
  const problems: string[] = [];
  checkPackageFields(dir, pkg, jsr, problems);
  checkVersionConstant(dir, pkg, problems);
  checkImports(dir, jsr.imports, problems);
  return problems;
};

const problems = JSR_PACKAGES.flatMap(checkPackage);
if (problems.length > 0) {
  console.error(`jsr.json check failed:\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`jsr.json OK for ${JSR_PACKAGES.length} packages`);
