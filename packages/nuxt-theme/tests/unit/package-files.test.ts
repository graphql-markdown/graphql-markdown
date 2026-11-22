import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";

const packageRoot = join(import.meta.dirname, "../..");
const packageJson = JSON.parse(
  readFileSync(join(packageRoot, "package.json"), "utf-8"),
) as { files: string[] };

const SOURCE_FILE = /\.(?:ts|mjs|vue)$/;
const RELATIVE_IMPORT = /(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+)["']/g;
const RESOLVE_SUFFIXES = ["", ".ts", ".mjs", ".js", ".vue", "/index.ts"];

const walk = (path: string): string[] => {
  if (!statSync(path).isDirectory()) {
    return [path];
  }
  return readdirSync(path).flatMap((entry) => {
    return walk(join(path, entry));
  });
};

const shippedFiles = new Set(
  packageJson.files.flatMap((entry) => {
    return walk(join(packageRoot, entry)).map((file) => {
      return relative(packageRoot, file);
    });
  }),
);

// The layer ships source, so a relative import of a file left out of
// `files` only breaks once installed from npm — never inside the monorepo.
describe("package.json files", () => {
  it("lists only existing paths", () => {
    const missing = packageJson.files.filter((entry) => {
      return !existsSync(join(packageRoot, entry));
    });
    expect(missing).toStrictEqual([]);
  });

  it("includes every file a shipped file imports relatively", () => {
    const unresolved = [...shippedFiles]
      .filter((file) => {
        return SOURCE_FILE.test(file);
      })
      .flatMap((file) => {
        const source = readFileSync(join(packageRoot, file), "utf-8");
        return [...source.matchAll(RELATIVE_IMPORT)]
          .map(([, specifier]) => {
            return {
              file,
              specifier,
              target: normalize(join(dirname(file), specifier)),
            };
          })
          .filter(({ target }) => {
            return !RESOLVE_SUFFIXES.some((suffix) => {
              return shippedFiles.has(`${target}${suffix}`);
            });
          })
          .map(({ specifier }) => {
            return `${file} -> ${specifier}`;
          });
      });
    expect(unresolved).toStrictEqual([]);
  });
});

describe("package.json exports", () => {
  const exportsMap = (
    JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf-8")) as {
      exports: Record<string, string>;
    }
  ).exports;

  it("exposes ./formatter pointing at formatter.mjs", () => {
    expect(exportsMap["./formatter"]).toBe("./formatter.mjs");
  });

  it("ships the ./formatter target and it exports the theme formatters", async () => {
    const target = exportsMap["./formatter"];
    expect(packageJson.files).toContain("formatter.mjs");
    expect(
      shippedFiles.has(relative(packageRoot, join(packageRoot, target))),
    ).toBe(true);

    const formatter = await import(join(packageRoot, target));
    expect(formatter.formatMDXAdmonition).toBeTypeOf("function");
    expect(formatter.formatMDXBadge).toBeTypeOf("function");
    expect(formatter.formatMDXBullet).toBeTypeOf("function");
    expect(formatter.formatMDXFrontmatter).toBeTypeOf("function");
    expect(formatter.mdxExtension).toBe(".md");
  });
});
