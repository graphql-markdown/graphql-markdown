import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import {
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";

/**
 * Slow path: scaffold a real project, install its dependencies, and run a
 * real cold `nuxi generate` against it — the actual acceptance criterion in
 * the plan's §7/§8 ("a scaffold that doesn't actually build is not done").
 *
 * `@graphql-markdown/nuxt-theme` is not published yet, so the scaffolded
 * project's dependency is repointed at the local package via a `file:` path
 * before installing — this is also how demo-nuxt's own migration (T6) is
 * being developed against the unpublished layer.
 *
 * Opt-in via GQLMD_CLI_E2E=1 (npm install + a real Nuxt build take ~1-2
 * minutes) — not part of the default `test`/`test:unit` run.
 */
const RUN_E2E = process.env.GQLMD_CLI_E2E === "1";

const packageRoot = join(import.meta.dirname, "../..");
const cliPath = join(packageRoot, "bin/create.mjs");
const themePath = join(packageRoot, "../nuxt-theme");

describe.skipIf(!RUN_E2E)("create-graphql-markdown-docs — real build", () => {
  let projectDir: string;

  beforeAll(() => {
    projectDir = mkdtempSync(join(tmpdir(), "gqlmd-e2e-"));
    rmSync(projectDir, { recursive: true, force: true });

    execFileSync(
      process.execPath,
      [cliPath, "--yes", "--dir", projectDir, "--no-install", "--no-git"],
      { cwd: packageRoot, stdio: "pipe", encoding: "utf-8" },
    );

    const pkgPath = join(projectDir, "package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    pkg.dependencies["@graphql-markdown/nuxt-theme"] = `file:${themePath}`;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

    execFileSync("npm", ["install"], {
      cwd: projectDir,
      stdio: "pipe",
      encoding: "utf-8",
      timeout: 180_000,
    });
  }, 240_000);

  afterAll(() => {
    if (projectDir && existsSync(projectDir)) {
      rmSync(projectDir, { recursive: true, force: true });
    }
  });

  it("runs a cold `npm run generate` successfully", () => {
    execFileSync("npm", ["run", "generate"], {
      cwd: projectDir,
      stdio: "pipe",
      encoding: "utf-8",
      timeout: 120_000,
    });

    expect(existsSync(join(projectDir, ".output/public/index.html"))).toBe(
      true,
    );
    expect(
      existsSync(join(projectDir, ".output/public/api-reference/index.html")),
    ).toBe(true);
  }, 150_000);
});
