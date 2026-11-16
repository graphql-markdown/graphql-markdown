import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  readVersions,
  rewriteRanges,
  run,
} from "../../packages/tooling-config/scripts/template-ranges.mts";

let root: string;

const writeJson = (path: string, value: unknown): void => {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
};

const template = (name: string): string =>
  join(root, "packages/create-graphql-markdown-docs/templates", name, "package.json");

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "template-ranges-"));
  writeJson(join(root, "packages/formatters/package.json"), {
    name: "@graphql-markdown/formatters",
    version: "1.3.0",
  });
  writeJson(join(root, "packages/cli/package.json"), {
    name: "@graphql-markdown/cli",
    version: "1.2.2",
  });
  writeJson(join(root, "packages/tooling-config/package.json"), {
    name: "tooling",
    version: "0.0.0",
  });
  writeJson(template("a"), {
    dependencies: { "@graphql-markdown/formatters": "^1.2.0", other: "^1.0.0" },
  });
  writeJson(template("b"), {
    dependencies: { "@graphql-markdown/cli": "^1.2.2" },
  });
  vi.spyOn(console, "log").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  rmSync(root, { recursive: true, force: true });
});

describe("readVersions()", () => {
  test("only reads scoped workspace packages", () => {
    expect(readVersions(root)).toEqual(
      new Map([
        ["@graphql-markdown/formatters", "1.3.0"],
        ["@graphql-markdown/cli", "1.2.2"],
      ]),
    );
  });
});

describe("rewriteRanges()", () => {
  test("rewrites stale workspace ranges only", () => {
    const source = '{\n  "dependencies": {\n    "@graphql-markdown/cli": "^1.0.0",\n    "cli": "^1.0.0"\n  }\n}\n';
    const { text, diffs } = rewriteRanges(source, new Map([["@graphql-markdown/cli", "1.2.2"]]));
    expect(text).toContain('"@graphql-markdown/cli": "^1.2.2"');
    expect(text).toContain('"cli": "^1.0.0"');
    expect(diffs).toEqual(["@graphql-markdown/cli: ^1.0.0 -> ^1.2.2"]);
  });
});

describe("run()", () => {
  test("--check reports drift and writes nothing", () => {
    const before = readFileSync(template("a"), "utf8");
    expect(run(root, true)).toBe(1);
    expect(readFileSync(template("a"), "utf8")).toBe(before);
    expect(() => readFileSync(join(root, ".changeset/sync-template-ranges.md"))).toThrow();
  });

  test("rewrites ranges and writes a patch changeset", () => {
    expect(run(root, false)).toBe(0);
    const pkg = JSON.parse(readFileSync(template("a"), "utf8"));
    expect(pkg.dependencies["@graphql-markdown/formatters"]).toBe("^1.3.0");
    const changeset = readFileSync(join(root, ".changeset/sync-template-ranges.md"), "utf8");
    expect(changeset).toContain('"create-graphql-markdown-docs": patch');
    expect(changeset).toContain("a/package.json: @graphql-markdown/formatters: ^1.2.0 -> ^1.3.0");
  });

  test("is a no-op once in sync", () => {
    run(root, false);
    rmSync(join(root, ".changeset"), { recursive: true });
    expect(run(root, true)).toBe(0);
    expect(run(root, false)).toBe(0);
    expect(() => readFileSync(join(root, ".changeset/sync-template-ranges.md"))).toThrow();
  });
});
