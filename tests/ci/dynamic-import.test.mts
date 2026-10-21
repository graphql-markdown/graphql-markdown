import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, test } from "vitest";

// tsgo's CommonJS emit wraps a computed `import()` argument in
// `__rewriteRelativeImportExtension(...)` (rewriteRelativeImportExtensions) but
// leaves an imported function called inside it unqualified, so `import(fn(x))`
// throws a ReferenceError at runtime in dist/ while the TS sources (and unit
// tests) work. Resolve the specifier into a variable first.
const CALL_IN_IMPORT = /\bimport\(\s*[A-Za-z_$][\w$.]*\s*\(/;

const repoRoot = join(import.meta.dirname, "..", "..");
const packagesDir = join(repoRoot, "packages");

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path);
    }
    return /\.(?:ts|mts)$/.test(entry.name) ? [path] : [];
  });

const packageSourceDirs = (): string[] =>
  readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(packagesDir, entry.name, "src"))
    .filter((dir) => {
      try {
        return readdirSync(dir).length > 0;
      } catch {
        return false;
      }
    });

const COMMENT_LINE = /^\s*(?:\/\/|\/?\*)/;

export const findCallsInImport = (source: string): number[] =>
  source.split("\n").flatMap((line, index) => {
    return !COMMENT_LINE.test(line) && CALL_IN_IMPORT.test(line)
      ? [index + 1]
      : [];
  });

describe("findCallsInImport()", () => {
  test("flags a function call as the import() argument", () => {
    expect(findCallsInImport("await import(resolve(name));")).toEqual([1]);
    expect(findCallsInImport("x;\nimport( utils.resolve(name) )")).toEqual([2]);
  });

  test("accepts literals, variables and comments", () => {
    expect(
      findCallsInImport(
        'await import("graphql");\nawait import(specifier);\n// `import(fn(x))`\n * import(fn(x))',
      ),
    ).toEqual([]);
  });
});

describe("package sources", () => {
  test("no import() takes a function call as its argument", () => {
    const offenders = packageSourceDirs()
      .flatMap(sourceFiles)
      .flatMap((file) =>
        findCallsInImport(readFileSync(file, "utf8")).map(
          (line) => `${relative(repoRoot, file)}:${line}`,
        ),
      );
    expect(offenders).toEqual([]);
  });
});
