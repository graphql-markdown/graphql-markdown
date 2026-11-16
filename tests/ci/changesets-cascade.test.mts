// Guards the experimental `updateInternalDependents: "always"` option of
// @changesets/cli. All internal ranges are `workspace:^`, which only cascade
// version bumps to dependents through that option; if a changesets upgrade
// drops or changes it, a patch of a leaf package would stop releasing its
// dependents and this test fails. It runs against the repository's own
// `.changeset/config.json`.

import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, expect, test } from "vitest";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const bin = join(repoRoot, "node_modules", ".bin", "changeset");
const repoConfig = JSON.parse(
  readFileSync(join(repoRoot, ".changeset", "config.json"), "utf8"),
);

let work: string;

const writeJson = (path: string, value: unknown): void => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n");
};

const version = (name: string): string =>
  JSON.parse(readFileSync(join(work, "packages", name, "package.json"), "utf8"))
    .version;

beforeEach(() => {
  work = mkdtempSync(join(tmpdir(), "changesets-cascade-"));
  writeJson(join(work, "package.json"), {
    name: "root",
    private: true,
    workspaces: ["packages/*"],
  });
  // Workspace detection for bun requires a lockfile next to the root manifest.
  writeFileSync(join(work, "bun.lock"), "");
  // utils <- core <- cli, all linked through `workspace:^`.
  writeJson(join(work, "packages/utils/package.json"), {
    name: "@fixture/utils",
    version: "1.0.0",
  });
  writeJson(join(work, "packages/core/package.json"), {
    name: "@fixture/core",
    version: "2.0.0",
    dependencies: { "@fixture/utils": "workspace:^" },
  });
  writeJson(join(work, "packages/cli/package.json"), {
    name: "@fixture/cli",
    version: "3.0.0",
    dependencies: { "@fixture/core": "workspace:^" },
  });
  // The repository config, with only the changelog generator (it needs the
  // network and a GitHub token) turned off.
  writeJson(join(work, ".changeset/config.json"), {
    ...repoConfig,
    changelog: false,
  });
  writeFileSync(
    join(work, ".changeset/leaf.md"),
    '---\n"@fixture/utils": patch\n---\n\nFix the leaf package.\n',
  );
});

afterEach(() => {
  rmSync(work, { recursive: true, force: true });
});

test("a patch of a leaf package patch-bumps its transitive dependents", () => {
  execFileSync(bin, ["version"], { cwd: work, stdio: "pipe" });
  expect(version("utils")).toBe("1.0.1");
  expect(version("core")).toBe("2.0.1");
  expect(version("cli")).toBe("3.0.1");
});
