import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { existsSync } from "node:fs";

const FIXTURE_DIR = join(import.meta.dirname, "../fixture");
const NUXI = join(FIXTURE_DIR, "node_modules/.bin/nuxi");
const SWIZZLE = join(import.meta.dirname, "../../bin/swizzle.mjs");
const BUILD_TIMEOUT = 120_000;

function runNuxi(args: string[]): void {
  try {
    execFileSync(process.execPath, [NUXI, ...args], {
      cwd: FIXTURE_DIR,
      stdio: "pipe",
      encoding: "utf-8",
    });
  } catch (error) {
    const stdout = (error as { stdout?: string }).stdout ?? "";
    const stderr = (error as { stderr?: string }).stderr ?? "";
    throw new Error(`nuxi ${args.join(" ")} failed:\n${stdout}\n${stderr}`);
  }
}

/**
 * Recursively walk a directory and collect all markdown files.
 */
async function walkContentDirectory(dir: string): Promise<string[]> {
  const files: string[] = [];
  try {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walkContentDirectory(full)));
      } else if (entry.name.endsWith(".md")) {
        files.push(full);
      }
    }
  } catch {
    // Directory does not exist yet
  }
  return files;
}

/**
 * Map a content file to its expected route. Mirrors modules/prerender.ts's
 * own routeFor() — see that file for why the landing page is a special case.
 */
function contentFileToRoute(contentRoot: string, filePath: string): string {
  const relativePath = relative(contentRoot, filePath);
  const segments = relativePath.replace(/\.md$/, "").split(sep);

  if (segments.length === 2 && segments.at(-1) === "generated") {
    return `/${segments[0]}`;
  }

  return `/${segments.join("/")}`;
}

/**
 * All setup — cold-clean, generate, swizzle, rebuild — happens once here so
 * every `it()` below is a pure, independent assertion against the resulting
 * filesystem state. This is deliberate, not just an optimization: vitest's
 * `--sequence.shuffle` (this repo's `test:ci` convention) reorders sibling
 * `it()`s within a describe, and an earlier version of this file put the
 * actual `nuxi generate`/`nuxi build` calls inside the body of specific
 * `it()`s — under shuffle, an assertion could run before the build that
 * produces what it checks even existed, and it did, nondeterministically,
 * confirmed by actually hitting the flake. `beforeAll` is never shuffled
 * relative to the tests in its own describe, so moving all side effects here
 * make every test order-independent by construction rather than by relying
 * on `.sequential` (which does not protect against this on its own).
 */
describe("Fixture app", () => {
  beforeAll(() => {
    for (const dir of [
      join(FIXTURE_DIR, ".nuxt"),
      join(FIXTURE_DIR, ".output"),
      join(FIXTURE_DIR, "content"),
    ]) {
      if (existsSync(dir)) rmDirSync(dir);
    }

    // Cold-build regression test (see the doc comment above).
    runNuxi(["generate"]);

    // Swizzle + rebuild, so every assertion below reflects the
    // post-swizzle state — proves swizzling doesn't break the build,
    // without needing a second, separately-ordered build phase.
    execFileSync(process.execPath, [SWIZZLE, "--component", "SiteHeader", "--force"], {
      cwd: FIXTURE_DIR,
      stdio: "pipe",
      encoding: "utf-8",
    });
    runNuxi(["build"]);
  }, BUILD_TIMEOUT * 2);

  it("produced a static build", () => {
    expect(existsSync(join(FIXTURE_DIR, ".output/public"))).toBe(true);
  });

  it("wrote generated content to content/api-reference", async () => {
    const files = await walkContentDirectory(join(FIXTURE_DIR, "content/api-reference"));
    expect(files.length).toBeGreaterThan(0);
  });

  it("prerendered the landing page as the schema overview", async () => {
    const landingPagePath = join(FIXTURE_DIR, ".output/public/api-reference/index.html");
    expect(existsSync(landingPagePath)).toBe(true);

    const content = await readFile(landingPagePath, "utf-8");
    // The landing page is the overview grid, not a generated document — it
    // doesn't name individual types, only section titles.
    expect(content).toContain("Schema Documentation");
    expect(content).toContain("Operations");
  });

  it("rendered the deprecated field's callout", async () => {
    const userPagePath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/types/objects/user/index.html",
    );
    expect(existsSync(userPagePath)).toBe(true);

    const content = await readFile(userPagePath, "utf-8");
    // api-document.ts's promoteBadges/promoteDeprecationCallout deliberately
    // replace the raw `gqlmd-mdx-badge-deprecated`/`api-deprecation-callout`
    // markup with UBadge/UAlert Nuxt UI components — so the raw class names
    // never reach the final HTML, only the semantic content does. Checking
    // for those class names (as this plan's own §7 originally specified) is
    // checking for the wrong thing; the deprecation reason text is what
    // actually has to survive the transform.
    expect(content).toContain("Use active field instead");
  });

  it("prerendered every generated page, not just what the crawler links to", async () => {
    const contentRoot = join(FIXTURE_DIR, "content/api-reference");
    const outputPublic = join(FIXTURE_DIR, ".output/public/api-reference");

    const markdownFiles = await walkContentDirectory(contentRoot);
    expect(markdownFiles.length).toBeGreaterThan(0);

    const missing: string[] = [];
    for (const mdFile of markdownFiles) {
      const route = contentFileToRoute(join(FIXTURE_DIR, "content"), mdFile);
      const htmlPath = join(FIXTURE_DIR, ".output/public", route, "index.html");
      if (!existsSync(htmlPath)) missing.push(route);
    }

    expect(missing, `Missing prerendered pages: ${missing.join(", ")}`).toEqual([]);
    // Sanity check the walk itself found the nested type this test exists to
    // cover — a schema that's too flat wouldn't exercise the prerender fix.
    expect(existsSync(join(outputPublic, "types/objects/preferences/index.html"))).toBe(true);
  });

  it("swizzled SiteHeader with a version-stamped copy", async () => {
    const swizzledPath = join(FIXTURE_DIR, "app/components/SiteHeader.vue");
    expect(existsSync(swizzledPath)).toBe(true);

    const content = await readFile(swizzledPath, "utf-8");
    expect(content).toContain("swizzled from @graphql-markdown/nuxt-theme@");
  });

  it("still built successfully after the swizzle", () => {
    // `nuxi build` (unlike `generate`) produces a server bundle, not
    // prerendered static HTML — beforeAll's `runNuxi(["build"])` would have
    // already thrown and failed the whole suite if this hadn't succeeded;
    // this test exists to give that fact its own named, reportable result.
    expect(existsSync(join(FIXTURE_DIR, ".output/server/index.mjs"))).toBe(true);
  });
});

function rmDirSync(dir: string): void {
  // node:fs/promises' rm isn't available synchronously; beforeAll here is
  // intentionally sync so cleanup fully completes before `runNuxi` starts.
  require("node:fs").rmSync(dir, { recursive: true, force: true });
}
