import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync, rmSync } from "node:fs";

const FIXTURE_DIR = join(import.meta.dirname, "../fixture-flat");
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
 * `hierarchy: "flat"` is the thing this fixture exists to exercise (see
 * `tests/fixture-flat/generate-docs.ts`) — the default fixture in
 * `fixture.test.ts` uses `"api"` hierarchy and never touches this path at
 * all. Same `beforeAll`-does-all-the-side-effects rationale as that file:
 * every `it()` below is a pure assertion against the filesystem state one
 * cold build produced, so vitest's `--sequence.shuffle` can't run an
 * assertion before the build that produces what it checks.
 */
describe("Flat-hierarchy fixture app", () => {
  beforeAll(() => {
    for (const dir of [
      join(FIXTURE_DIR, ".nuxt"),
      join(FIXTURE_DIR, ".output"),
      join(FIXTURE_DIR, "content"),
    ]) {
      if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    }

    runNuxi(["generate"]);
  }, BUILD_TIMEOUT);

  it("produced a static build", () => {
    expect(existsSync(join(FIXTURE_DIR, ".output/public"))).toBe(true);
  });

  it("shows the single-page reference at the base route, not the per-type landing grid", async () => {
    const rootPath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/index.html",
    );
    expect(existsSync(rootPath)).toBe(true);

    const content = await readFile(rootPath, "utf-8");
    // "Schema Documentation" is also the generated landing doc's own title
    // (used in <title>/SEO meta) regardless of which view renders, so it
    // isn't a reliable signal on its own — this checks for the overview
    // grid's actual body copy instead, which only `ApiNamespaceLanding`
    // renders.
    expect(content).not.toContain(
      "Browse the workspace API by operation or schema type",
    );
    expect(content).not.toContain("Choose a Namespace");

    // Bucket headings, in Anvil's order — no mutations/subscriptions in this
    // fixture's schema, so those buckets must be entirely absent.
    expect(content).toContain('id="queries"');
    expect(content).toContain('id="types"');
    expect(content).not.toContain('id="mutations"');
    expect(content).not.toContain('id="subscriptions"');
    expect(content.indexOf('id="queries"')).toBeLessThan(
      content.indexOf('id="types"'),
    );
  });

  it("keeps a same-named query and type as distinct entries instead of one overwriting the other", async () => {
    // The fixture schema deliberately has `Query.user` alongside `type User`
    // (and `Query.getUser`) — @graphql-markdown/core's flat-hierarchy
    // renderer used to slugify both the query and the type to the same
    // `user.md` filename, silently letting the second write clobber the
    // first. This is the regression test for that fix, exercised through
    // the whole stack: generator -> content -> rendered page.
    const rootPath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/index.html",
    );
    const content = await readFile(rootPath, "utf-8");

    expect(content).toContain('id="queries-user"');
    expect(content).toContain('id="queries-get-user"');
    expect(content).toContain('id="objects-user"');
  });

  it("every sidebar anchor link resolves to a real heading id on the same page", async () => {
    const rootPath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/index.html",
    );
    const content = await readFile(rootPath, "utf-8");

    const hrefs = [...content.matchAll(/href="#([a-zA-Z0-9_-]+)"/g)].map(
      (match) => {
        return match[1];
      },
    );
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(content, `#${href} is linked but has no matching id`).toContain(
        `id="${href}"`,
      );
    }
  });

  it("rendered the deprecated field's callout on the single page", async () => {
    const rootPath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/index.html",
    );
    const content = await readFile(rootPath, "utf-8");

    expect(content).toContain("Use active field instead");
  });

  it("redirects an old per-type route to its anchor on the single page", async () => {
    // Every generated page still exists on disk (so Nuxt Content can serve
    // it), but under flat hierarchy `[...slug].vue` redirects any direct
    // visit to it — including its own real, now kind-prefixed path — back to
    // the single page, since the per-type view is never the intended UI here.
    const perTypePath = join(
      FIXTURE_DIR,
      ".output/public/api-reference/objects-user/index.html",
    );
    expect(existsSync(perTypePath)).toBe(true);

    const content = await readFile(perTypePath, "utf-8");
    expect(content).toContain('http-equiv="refresh"');
    expect(content).toContain("url=/api-reference#objects-user");
  });
});
