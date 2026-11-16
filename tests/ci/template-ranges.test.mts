import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
  readVersions,
  rewriteExportedRange,
  rewriteRanges,
  run,
} from "../../packages/tooling-config/scripts/template-ranges.mts";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const changesetBin = join(repoRoot, "node_modules", ".bin", "changeset");

let root: string;

const writeJson = (path: string, value: unknown): void => {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
};

const template = (name: string): string =>
  join(root, "packages/create-graphql-markdown-docs/templates", name, "package.json");

const markdown = (): string =>
  join(root, "packages/create-graphql-markdown-docs/lib/frameworks/markdown.mjs");

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
  mkdirSync(dirname(markdown()), { recursive: true });
  writeFileSync(markdown(), 'export const FORMATTERS_RANGE = "^1.2.0";\n');
  writeJson(join(root, ".changeset/config.json"), {
    changelog: false,
    commit: false,
    access: "public",
    baseBranch: "main",
    updateInternalDependencies: "patch",
    ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
      updateInternalDependents: "always",
    },
  });
  vi.spyOn(console, "log").mockImplementation(() => undefined);
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

const changeset = (name: string, pkg: string, type = "patch"): void => {
  writeFileSync(
    join(root, ".changeset", `${name}.md`),
    `---\n"${pkg}": ${type}\n---\n\nChange.\n`,
  );
};

const syncChangeset = (): string =>
  join(root, ".changeset/sync-template-ranges.md");

const scaffolderVersion = (): string =>
  JSON.parse(
    readFileSync(
      join(root, "packages/create-graphql-markdown-docs/package.json"),
      "utf8",
    ),
  ).version;

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

describe("rewriteExportedRange()", () => {
  test("rewrites a stale FORMATTERS_RANGE only", () => {
    const { text, diffs } = rewriteExportedRange('export const FORMATTERS_RANGE = "^1.2.0";\n', "1.3.0");
    expect(text).toBe('export const FORMATTERS_RANGE = "^1.3.0";\n');
    expect(diffs).toEqual(["FORMATTERS_RANGE: ^1.2.0 -> ^1.3.0"]);
    expect(rewriteExportedRange(text, "1.3.0").diffs).toEqual([]);
  });
});

describe("run()", () => {
  test("--apply syncs FORMATTERS_RANGE", () => {
    run(root, "apply");
    expect(readFileSync(markdown(), "utf8")).toContain('"^1.3.0"');
  });

  test("--check reports a stale FORMATTERS_RANGE", () => {
    run(root, "apply");
    writeFileSync(markdown(), 'export const FORMATTERS_RANGE = "^1.2.0";\n');
    expect(run(root, "check")).toBe(1);
  });

  test("--check reports drift and writes nothing", () => {
    const before = readFileSync(template("a"), "utf8");
    expect(run(root, "check")).toBe(1);
    expect(readFileSync(template("a"), "utf8")).toBe(before);
    expect(() => readFileSync(syncChangeset())).toThrow();
  });

  test("--apply rewrites ranges without writing a changeset", () => {
    expect(run(root, "apply")).toBe(0);
    const pkg = JSON.parse(readFileSync(template("a"), "utf8"));
    expect(pkg.dependencies["@graphql-markdown/formatters"]).toBe("^1.3.0");
    expect(() => readFileSync(syncChangeset())).toThrow();
    expect(run(root, "check")).toBe(0);
  });
});

describe("run() --plan", () => {
  test("writes the changeset for the ranges of the planned versions, and rewrites nothing", () => {
    changeset("fix", "@graphql-markdown/formatters");
    const before = readFileSync(template("a"), "utf8");
    expect(run(root, "plan")).toBe(0);
    expect(readFileSync(template("a"), "utf8")).toBe(before);
    const text = readFileSync(syncChangeset(), "utf8");
    expect(text).toContain('"create-graphql-markdown-docs": patch');
    expect(text).toContain("a/package.json: @graphql-markdown/formatters: ^1.2.0 -> ^1.3.1");
    expect(text).toContain("FORMATTERS_RANGE: ^1.2.0 -> ^1.3.1");
  });

  test("overwrites the changeset on a second run", () => {
    changeset("fix", "@graphql-markdown/formatters");
    run(root, "plan");
    const first = readFileSync(syncChangeset(), "utf8");
    expect(run(root, "plan")).toBe(0);
    expect(readFileSync(syncChangeset(), "utf8")).toBe(first);
  });

  test("writes nothing when the ranges will already be in sync", () => {
    run(root, "apply");
    changeset("other", "@graphql-markdown/cli", "patch");
    writeJson(template("b"), {
      dependencies: { "@graphql-markdown/cli": "^1.2.3" },
    });
    writeJson(template("a"), {
      dependencies: { "@graphql-markdown/formatters": "^1.3.0" },
    });
    writeFileSync(markdown(), 'export const FORMATTERS_RANGE = "^1.3.0";\n');
    expect(run(root, "plan")).toBe(0);
    expect(() => readFileSync(syncChangeset())).toThrow();
  });

  test("fails when no changeset is pending", () => {
    expect(run(root, "plan")).toBe(1);
    expect(() => readFileSync(syncChangeset())).toThrow();
  });
});

describe("single-pass versioning", () => {
  const releaseVersion = (): void => {
    writeFileSync(join(root, "package.json"), JSON.stringify({ name: "root", private: true, workspaces: ["packages/*"] }));
    writeFileSync(join(root, "bun.lock"), "");
    expect(run(root, "plan")).toBe(0);
    execFileSync(changesetBin, ["version"], { cwd: root, stdio: "pipe" });
    expect(run(root, "apply")).toBe(0);
  };

  beforeEach(() => {
    writeJson(join(root, "packages/create-graphql-markdown-docs/package.json"), {
      name: "create-graphql-markdown-docs",
      version: "1.1.2",
      dependencies: { "@graphql-markdown/cli": "workspace:^" },
    });
    writeJson(join(root, "packages/cli/package.json"), {
      name: "@graphql-markdown/cli",
      version: "1.2.2",
    });
  });

  test("bumps the scaffolder once when a dependency cascade and the ranges both move it", () => {
    changeset("fix", "@graphql-markdown/cli");
    releaseVersion();
    expect(scaffolderVersion()).toBe("1.1.3");
    const pkg = JSON.parse(readFileSync(template("b"), "utf8"));
    expect(pkg.dependencies["@graphql-markdown/cli"]).toBe("^1.2.3");
    expect(run(root, "check")).toBe(0);
  });

  test("bumps the scaffolder once when it is also bumped by its own changeset", () => {
    changeset("fix", "@graphql-markdown/cli");
    changeset("own", "create-graphql-markdown-docs");
    releaseVersion();
    expect(scaffolderVersion()).toBe("1.1.3");
  });
});
