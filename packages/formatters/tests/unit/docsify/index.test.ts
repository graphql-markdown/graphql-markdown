import { join } from "node:path";

import {
  afterRenderFilesHook,
  beforeGenerateIndexMetafileHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
  mdxExtension,
} from "../../../src/docsify";

const createAdapter = (existing: Record<string, string> = {}) => {
  const files: Record<string, string> = { ...existing };
  return {
    files,
    adapter: {
      writeFile: vi.fn(async (path: string, content: string) => {
        files[path] = content;
      }),
      readFile: vi.fn(async (path: string) => {
        return files[path];
      }),
      ensureDir: vi.fn(async () => {
        return undefined;
      }),
    },
  };
};

describe("formatMDXFrontmatter", () => {
  test("keeps only the title as a heading", () => {
    expect(formatMDXFrontmatter(null, ['id: "foo"', 'title: "My Title"'])).toBe(
      "# My Title\n\n",
    );
  });

  test("returns an empty string without a title line", () => {
    expect(formatMDXFrontmatter(null, ['id: "foo"'])).toBe("");
  });

  test("returns an empty string for empty or missing input", () => {
    expect(formatMDXFrontmatter(null, [])).toBe("");
    expect(formatMDXFrontmatter(null, null)).toBe("");
  });

  test("never emits front matter delimiters", () => {
    expect(formatMDXFrontmatter(null, ['title: "T"'])).not.toContain("---");
  });
});

describe("formatMDXLink", () => {
  test("adds .md and a root-absolute path to internal links", () => {
    expect(
      formatMDXLink({ text: "A", url: "graphql/types/objects/user" }),
    ).toEqual({ text: "A", url: "/graphql/types/objects/user.md" });
  });

  test("keeps an existing .md extension", () => {
    expect(formatMDXLink({ text: "A", url: "../../enums/role.md" })).toEqual({
      text: "A",
      url: "/enums/role.md",
    });
  });

  test("keeps the anchor", () => {
    expect(
      formatMDXLink({ text: "A", url: "/graphql/types/user#field" }),
    ).toEqual({ text: "A", url: "/graphql/types/user.md#field" });
  });

  test("leaves external links unchanged", () => {
    expect(formatMDXLink({ text: "A", url: "https://example.com/a" })).toEqual({
      text: "A",
      url: "https://example.com/a",
    });
    expect(formatMDXLink({ text: "A", url: "//example.com" }).url).toBe(
      "//example.com",
    );
  });

  test("leaves anchor-only links unchanged", () => {
    expect(formatMDXLink({ text: "A", url: "#field" })).toEqual({
      text: "A",
      url: "#field",
    });
  });
});

describe("formatMDXAdmonition", () => {
  test("keeps GitHub-style callouts", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "T", type: "warning" },
      null,
    );
    expect(result).toContain("> [!WARNING]");
    expect(result).toContain("> body");
  });
});

describe("beforeGenerateIndexMetafileHook", () => {
  test("writes a README.md with the start-cased category", async () => {
    const { adapter, files } = createAdapter();
    await beforeGenerateIndexMetafileHook({
      data: {
        dirPath: "/out/graphql/operations",
        category: "queries",
        outputAdapter: adapter,
      },
    } as never);

    expect(adapter.ensureDir).toHaveBeenCalledWith("/out/graphql/operations");
    expect(files["/out/graphql/operations/README.md"]).toBe("# Queries\n\n");
  });

  test("falls back to the filesystem adapter", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const dir = mkdtempSync(join(tmpdir(), "docsify-"));
    await beforeGenerateIndexMetafileHook({
      data: { dirPath: join(dir, "x"), category: "scalars" },
    } as never);
    expect(readFileSync(join(dir, "x", "README.md"), "utf-8")).toBe(
      "# Scalars\n\n",
    );
  });
});

describe("afterRenderFilesHook", () => {
  const rootDir = "/site/docs";
  const outputDir = "/site/docs/graphql";
  const page = (dir: string, name: string) => {
    return {
      category: dir,
      filePath: `${outputDir}/${dir}/${name}.md`,
      name,
    };
  };

  test("writes _sidebar.md and completes the folder READMEs", async () => {
    const { adapter, files } = createAdapter({
      [`${outputDir}/operations/queries/foo.md`]: "# Foo Query\n\nbody",
      [`${outputDir}/types/objects/user.md`]: "# User\n",
    });

    await afterRenderFilesHook({
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        outputAdapter: adapter,
        pages: [
          [
            {
              category: "Objects",
              filePath: `${outputDir}/types/objects/user.md`,
              name: "User",
            },
            {
              category: "Queries",
              filePath: `${outputDir}/operations/queries/foo.md`,
              name: "foo",
            },
            {
              category: "Queries",
              filePath: `${outputDir}/operations/queries/bar-baz.md`,
              name: "barBaz",
            },
          ],
          null,
        ],
      },
    } as never);

    expect(files[`${rootDir}/_sidebar.md`]).toBe(
      [
        "* [Home](/)",
        "* [GraphQL API](/graphql/README.md)",
        "* Operations",
        "  * Queries",
        "    * [Bar Baz](/graphql/operations/queries/bar-baz.md)",
        "    * [Foo Query](/graphql/operations/queries/foo.md)",
        "* Types",
        "  * Objects",
        "    * [User](/graphql/types/objects/user.md)",
        "",
      ].join("\n"),
    );
    expect(files[`${outputDir}/operations/queries/README.md`]).toBe(
      [
        "# Queries",
        "",
        "* [Bar Baz](/graphql/operations/queries/bar-baz.md)",
        "* [Foo Query](/graphql/operations/queries/foo.md)",
        "",
      ].join("\n"),
    );
    expect(files[`${outputDir}/README.md`]).toBe(
      [
        "# GraphQL API",
        "",
        "* [Operations](/graphql/operations/README.md)",
        "* [Types](/graphql/types/README.md)",
        "",
      ].join("\n"),
    );
  });

  test("resolves the docs root from a nested baseURL", async () => {
    const nestedOutputDir = "/site/docs/api/graphql";
    const nestedRootDir = "/site/docs/api";
    const { adapter, files } = createAdapter({
      [`${nestedOutputDir}/types/objects/user.md`]: "# User\n",
    });

    await afterRenderFilesHook({
      data: {
        baseURL: "api/graphql",
        outputDir: nestedOutputDir,
        rootDir: nestedRootDir,
        outputAdapter: adapter,
        pages: [
          [
            {
              category: "Objects",
              filePath: `${nestedOutputDir}/types/objects/user.md`,
              name: "User",
            },
          ],
        ],
      },
    } as never);

    expect(files["/site/docs/_sidebar.md"]).toBe(
      [
        "* [Home](/)",
        "* [GraphQL API](/api/graphql/README.md)",
        "* Types",
        "  * Objects",
        "    * [User](/api/graphql/types/objects/user.md)",
        "",
      ].join("\n"),
    );
    expect(files[`${nestedRootDir}/_sidebar.md`]).toBeUndefined();
    expect(files[`${nestedOutputDir}/types/objects/README.md`]).toBe(
      [
        "# Objects",
        "",
        "* [User](/api/graphql/types/objects/user.md)",
        "",
      ].join("\n"),
    );
  });

  test("ignores README pages and non-markdown files", async () => {
    const { adapter, files } = createAdapter();
    await afterRenderFilesHook({
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        outputAdapter: adapter,
        pages: [
          [
            page("types", "README"),
            { category: "x", filePath: `${outputDir}/a.txt`, name: "a" },
          ],
        ],
      },
    } as never);

    expect(files[`${rootDir}/_sidebar.md`]).toBe(
      "* [Home](/)\n* [GraphQL API](/graphql/README.md)\n",
    );
    expect(files[`${outputDir}/README.md`]).toBeUndefined();
  });
});

describe("createMDXFormatter", () => {
  test("returns the complete formatter", () => {
    const formatter = createMDXFormatter();
    expect(formatter).toEqual({
      formatMDXBadge,
      formatMDXAdmonition,
      formatMDXBullet,
      formatMDXDetails,
      formatMDXFrontmatter,
      formatMDXLink,
      formatMDXNameEntity,
      formatMDXPermalink,
      formatMDXSpecifiedByLink,
    });
  });

  test("exports the .md extension", () => {
    expect(mdxExtension).toBe(".md");
  });
});
