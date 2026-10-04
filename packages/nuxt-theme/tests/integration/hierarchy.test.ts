import { describe, it, expect, afterAll, vi } from "vitest";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

vi.mock("@nuxt/kit", () => {
  return {
    useLogger: () => {
      return { info: () => {}, error: () => {} };
    },
  };
});

const { createGenerateDocs } = await import("../../generate");

const FIXTURE_SCHEMA = join(
  import.meta.dirname,
  "../fixture/schema/fixture.graphql",
);
const tempDirs: string[] = [];

const walk = async (dir: string, prefix = ""): Promise<string[]> => {
  const files: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await walk(join(dir, entry.name), rel)));
    } else {
      files.push(rel);
    }
  }
  return files;
};

const generateInto = async (
  hierarchy: "api" | "entity" | "flat",
): Promise<{ files: string[]; rootPath: string }> => {
  const rootPath = await mkdtemp(
    join(tmpdir(), `nuxt-theme-hierarchy-${hierarchy}-`),
  );
  tempDirs.push(rootPath);

  // Deliberately does not override `formatter` — this exercises nuxt-theme's
  // own real `formatter.ts` (the same one `demo-nuxt` and the fixture apps
  // use), which is what actually stamps the `kind:` frontmatter field
  // `useApiNavigation.ts` falls back to for flat-hierarchy grouping.
  const generate = createGenerateDocs({
    schema: FIXTURE_SCHEMA,
    rootPath,
    printTypeOptions: { hierarchy },
  });
  await generate();

  const files = await walk(join(rootPath, "api-reference"));
  return { files, rootPath: join(rootPath, "api-reference") };
};

/**
 * `useApiNavigation.ts` derives its whole sidebar/search tree from generated
 * file paths alone, with no assumption about folder depth or names — these
 * tests exist because that claim had never actually been exercised against
 * a non-default `hierarchy` value's real output before.
 */
describe("printTypeOptions.hierarchy real generation output", () => {
  afterAll(async () => {
    await Promise.all(
      tempDirs.map(async (dir) => {
        return rm(dir, { recursive: true, force: true });
      }),
    );
  });

  it("groups by operations/types (api, the default) — mirrors fixture.test.ts's full-build coverage", async () => {
    const { files } = await generateInto("api");

    const topLevelDirs = new Set(
      files.map((f) => {
        return f.split("/")[0];
      }),
    );
    expect(topLevelDirs).toEqual(
      new Set(["generated.md", "operations", "types"]),
    );
    expect(files).toContain("types/objects/user.md");
    expect(files).toContain("operations/queries/user.md");
  });

  it("groups by GraphQL entity kind, with no operations/types wrapper (entity)", async () => {
    const { files } = await generateInto("entity");

    const topLevelDirs = new Set(
      files.map((f) => {
        return f.split("/")[0];
      }),
    );
    expect(topLevelDirs).not.toContain("operations");
    expect(topLevelDirs).not.toContain("types");
    expect(topLevelDirs).toEqual(
      new Set(["generated.md", "directives", "objects", "queries", "scalars"]),
    );
    expect(files).toContain("objects/user.md");
    expect(files).toContain("queries/user.md");
  });

  it("produces no folder structure at all (flat), but still stamps a kind on every page", async () => {
    const { files, rootPath } = await generateInto("flat");

    for (const file of files) {
      expect(file).not.toContain("/");
    }
    // Every flat filename is prefixed with its entity kind (`objects-`,
    // `scalars-`, …) — not just a slugified name — because flat hierarchy has
    // no folders to keep same-named entities of different kinds apart (the
    // fixture schema's `user` query and `User` object type both slugify to
    // "user"; without the prefix, generating one would silently overwrite
    // the other's file).
    expect(files.sort()).toContain("objects-preferences.md");

    // These are the same pieces of proof useApiNavigation.ts's kind fallback
    // relies on: no folders to group by, but a real `kind:` line present in
    // the frontmatter, matching the page's actual GraphQL entity.
    const preferencesContent = await readFile(
      join(rootPath, "objects-preferences.md"),
      "utf-8",
    );
    expect(preferencesContent).toMatch(/^kind: objects$/m);

    const idContent = await readFile(join(rootPath, "scalars-id.md"), "utf-8");
    expect(idContent).toMatch(/^kind: scalars$/m);

    const deprecatedContent = await readFile(
      join(rootPath, "directives-deprecated.md"),
      "utf-8",
    );
    expect(deprecatedContent).toMatch(/^kind: directives$/m);
  });

  it("keeps a same-named type and query in separate files under flat hierarchy", async () => {
    const { files } = await generateInto("flat");

    expect(files).toContain("objects-user.md");
    expect(files).toContain("queries-user.md");
  });
});
