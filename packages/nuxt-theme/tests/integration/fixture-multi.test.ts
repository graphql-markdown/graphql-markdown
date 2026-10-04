import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync, rmSync } from "node:fs";

const FIXTURE_DIR = join(import.meta.dirname, "../fixture-multi");
const NUXI = join(FIXTURE_DIR, "node_modules/.bin/nuxi");
const BUILD_TIMEOUT = 120_000;

const runNuxi = (args: string[]): void => {
  try {
    execFileSync(process.execPath, [NUXI, ...args], {
      cwd: FIXTURE_DIR,
      stdio: "pipe",
      encoding: "utf-8",
    });
  } catch (error) {
    const stdout = (error as { stdout?: string }).stdout ?? "";
    const stderr = (error as { stderr?: string }).stderr ?? "";
    throw new Error(`nuxi ${args.join(" ")} failed:\n${stdout}\n${stderr}`, {
      cause: error,
    });
  }
};

/**
 * All setup — cold-clean and generate — happens once here so every `it()`
 * below is a pure, independent assertion against the resulting filesystem
 * state. This is deliberate, not just an optimization: vitest's
 * `--sequence.shuffle` (this repo's `test:ci` convention) reorders sibling
 * `it()`s within a describe, and an earlier version of the single-schema
 * fixture.test.ts put the actual `nuxi generate` calls inside the body of
 * specific `it()`s — under shuffle, an assertion could run before the build
 * that produces what it checks even existed, and it did, nondeterministically.
 * Moving all side effects here makes every test order-independent by
 * construction.
 */
describe("Multi-schema fixture", () => {
  beforeAll(() => {
    for (const dir of [
      join(FIXTURE_DIR, ".nuxt"),
      join(FIXTURE_DIR, ".output"),
      join(FIXTURE_DIR, "content"),
    ]) {
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }

    // Cold-build to verify multi-schema generation and prerendering works.
    runNuxi(["generate"]);
  }, BUILD_TIMEOUT * 2);

  it("generated content for schema-a at api-reference/schema-a", async () => {
    const contentPath = join(
      FIXTURE_DIR,
      "content/api-reference/schema-a/generated.md",
    );
    expect(existsSync(contentPath)).toBe(true);
  });

  it("generated content for schema-b at api-reference/schema-b", async () => {
    const contentPath = join(
      FIXTURE_DIR,
      "content/api-reference/schema-b/generated.md",
    );
    expect(existsSync(contentPath)).toBe(true);
  });

  it("prerendered schema-a landing page with Schema Documentation header", async () => {
    const landingPagePath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/schema-a/index.html",
    );
    expect(existsSync(landingPagePath)).toBe(true);

    const content = await readFile(landingPagePath, "utf-8");
    expect(content).toContain("Schema Documentation");
  });

  it("prerendered schema-b landing page with Schema Documentation header", async () => {
    const landingPagePath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/schema-b/index.html",
    );
    expect(existsSync(landingPagePath)).toBe(true);

    const content = await readFile(landingPagePath, "utf-8");
    expect(content).toContain("Schema Documentation");
  });

  it("schema-a namespace has no cross-contamination links to schema-b", async () => {
    const landingPagePath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/schema-a/index.html",
    );
    const content = await readFile(landingPagePath, "utf-8");

    // Verify schema-a page does NOT contain links to schema-b
    expect(content).not.toContain('href="/api-reference/schema-b');
  });

  it("shared baseURL root provides fallback with links to both namespaces", async () => {
    const fallbackPath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/index.html",
    );
    expect(existsSync(fallbackPath)).toBe(true);

    const content = await readFile(fallbackPath, "utf-8");
    // Fallback should link to both namespaces
    expect(content).toContain('href="/api-reference/schema-a');
    expect(content).toContain('href="/api-reference/schema-b');
    expect(content).toContain("Choose a Namespace");
  });

  it("prerendered 3-level-deep nested route under schema-a namespace", () => {
    const nestedPath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/schema-a/types/objects/user/index.html",
    );
    expect(existsSync(nestedPath)).toBe(true);
  });
});
