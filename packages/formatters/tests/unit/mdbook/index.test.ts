import {
  afterRenderFilesHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxExtension,
} from "../../../src/mdbook";

describe("formatMDXBadge", () => {
  test("renders bold text — no HTML components", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe("**Required**");
  });
});

describe("formatMDXAdmonition", () => {
  test("renders admonition with [!TYPE] tag and title line", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain("> [!NOTE]");
    expect(result).toContain("> My Title");
    expect(result).toContain("> body");
  });

  test("omits title line when title is empty", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "", type: "warning" },
      null,
    );
    expect(result).toContain("> [!WARNING]");
    expect(result).not.toContain("> \n");
    expect(result).toContain("> body");
  });

  test("omits title line when title is only whitespace", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "   ", type: "info" },
      null,
    );
    expect(result).toContain("> [!INFO]");
    expect(result).not.toContain("> \n");
    expect(result).toContain("> body");
  });

  test("trims whitespace from title", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "  Trimmed Title  ", type: "note" },
      null,
    );
    expect(result).toContain("> Trimmed Title");
    expect(result).not.toContain(">   ");
  });

  test("uppercases the admonition type tag", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "", type: "warning" },
      null,
    );
    expect(result).toContain("> [!WARNING]");
  });

  test("renders different admonition types", () => {
    const types = ["note", "warning", "important", "tip", "caution"];
    for (const type of types) {
      const result = formatMDXAdmonition(
        { text: "body", title: "", type: type as any },
        null,
      );
      expect(result).toContain(`> [!${type.toUpperCase()}]`);
    }
  });
});

describe("formatMDXBullet", () => {
  test("renders bull entity with text", () => {
    expect(formatMDXBullet("item")).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
    );
  });
});

describe("formatMDXDetails", () => {
  test("renders bold label — no heading, safe at any nesting level without breaking heading hierarchy", () => {
    const result = formatMDXDetails({
      dataOpen: "DEPRECATED",
      dataClose: "DEPRECATED",
    });
    expect(result).not.toContain("<details>");
    expect(result).not.toContain("###");
    expect(result).toContain("**Deprecated**");
  });

  test("output contains \\r so the printer can split into [openSection, closeSection]", () => {
    const result = formatMDXDetails({
      dataOpen: "DEPRECATED",
      dataClose: "DEPRECATED",
    });
    const parts = result.split("\r");
    expect(parts).toHaveLength(2);
    expect(parts[0]).toContain("**Deprecated**");
  });
});

describe("formatMDXFrontmatter", () => {
  test("emits H1 title — mdBook renders YAML front matter as literal content", () => {
    expect(formatMDXFrontmatter(undefined, ["id: test", "title: Test"])).toBe(
      "# Test\n",
    );
  });

  test("returns empty string when no title line is present", () => {
    expect(formatMDXFrontmatter(undefined, ["id: test"])).toBe("");
  });

  test("ignores props — title is always sourced from the formatted array", () => {
    expect(
      formatMDXFrontmatter({ title: "ignored" }, ["title: FromFormatted"]),
    ).toBe("# FromFormatted\n");
  });
});

describe("formatMDXLink", () => {
  test("appends .md to extensionless absolute paths", () => {
    expect(formatMDXLink({ text: "Type", url: "/schema/type" })).toEqual({
      text: "Type",
      url: "/schema/type.md",
    });
  });

  test("leaves links with an extension unchanged", () => {
    const link = { text: "Type", url: "/schema/type.md" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves relative links unchanged", () => {
    const link = { text: "Type", url: "type" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("returns link unchanged when URL is null", () => {
    expect(formatMDXLink({ text: "Type", url: null })).toEqual({
      text: "Type",
      url: null,
    });
  });

  test("returns link unchanged when URL is undefined", () => {
    expect(formatMDXLink({ text: "Type", url: undefined })).toEqual({
      text: "Type",
      url: undefined,
    });
  });
});

describe("formatMDXNameEntity", () => {
  test("renders entity span with parent", () => {
    expect(formatMDXNameEntity("field", "Query")).toBe(
      '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">Query</code>.<code class="gqlmd-mdx-entity-name">field</code></span>',
    );
  });

  test("renders entity span without parent", () => {
    expect(formatMDXNameEntity("field")).toBe(
      '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-name">field</code></span>',
    );
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("renders specifiedby span with link", () => {
    expect(formatMDXSpecifiedByLink("https://spec.example")).toBe(
      '<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="https://spec.example" title="Specified by https://spec.example">⎘</a></span>',
    );
  });
});

describe("createMDXFormatter", () => {
  test("returns a complete formatter", () => {
    const formatter = createMDXFormatter();
    expect(formatter).toHaveProperty("formatMDXBadge");
    expect(formatter).toHaveProperty("formatMDXAdmonition");
    expect(formatter).toHaveProperty("formatMDXFrontmatter");
    expect(formatter).toHaveProperty("formatMDXLink");
  });
});

describe("mdxExtension", () => {
  test("is .md — mdBook does not use .mdx files", () => {
    expect(mdxExtension).toBe(".md");
  });
});

describe("afterRenderFilesHook", () => {
  test("is a function (lifecycle hook contract)", () => {
    expect(typeof afterRenderFilesHook).toBe("function");
  });

  test("writes SUMMARY.md with grouped and sorted pages", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-test-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "foo.md"),
              name: "foo",
            },
            {
              category: "Scalars",
              filePath: pathJoin(outputDir, "types", "scalars", "string.md"),
              name: "String",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("# Operations");
    expect(summary).toContain("- [Queries]()");
    expect(summary).toContain("  - [foo](graphql/operations/queries/foo.md)");
    expect(summary).toContain("# Types");
    expect(summary).toContain("- [Scalars]()");
    // Operations must come before Types
    expect(summary.indexOf("# Operations")).toBeLessThan(
      summary.indexOf("# Types"),
    );
  });

  test("handles empty pages array", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-empty-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("# Summary");
    expect(summary).toContain("[Introduction](introduction.md)");
  });

  test("filters out null pages", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-null-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            null,
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "test.md"),
              name: "test",
            },
            undefined,
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("- [Queries]()");
    expect(summary).toContain("  - [test](graphql/operations/queries/test.md)");
  });

  test("sorts sections with Operations before Types", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-sort-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Scalars",
              filePath: pathJoin(outputDir, "types", "scalars", "string.md"),
              name: "String",
            },
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "foo.md"),
              name: "foo",
            },
            {
              category: "Mutations",
              filePath: pathJoin(
                outputDir,
                "operations",
                "mutations",
                "bar.md",
              ),
              name: "bar",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    const opsIdx = summary.indexOf("# Operations");
    const typesIdx = summary.indexOf("# Types");
    expect(opsIdx).toBeLessThan(typesIdx);
  });

  test("sorts categories within a section by SECTION_ORDER", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-category-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Subscriptions",
              filePath: pathJoin(
                outputDir,
                "operations",
                "subscriptions",
                "sub.md",
              ),
              name: "sub",
            },
            {
              category: "Mutations",
              filePath: pathJoin(
                outputDir,
                "operations",
                "mutations",
                "mut.md",
              ),
              name: "mut",
            },
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "q.md"),
              name: "q",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    const queryIdx = summary.indexOf("- [Queries]");
    const mutIdx = summary.indexOf("- [Mutations]");
    const subIdx = summary.indexOf("- [Subscriptions]");

    // Queries < Mutations < Subscriptions (per SECTION_ORDER)
    expect(queryIdx).toBeLessThan(mutIdx);
    expect(mutIdx).toBeLessThan(subIdx);
  });

  test("includes GraphQL API Reference link with correct baseURL", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-ref-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "schema",
        outputDir,
        rootDir,
        pages: [[]],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("[GraphQL API Reference](schema/index.md");
  });

  test("includes introduction link in summary header", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-intro-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [[]],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("[Introduction](introduction.md)");
    expect(summary.indexOf("[Introduction]")).toBeLessThan(
      summary.indexOf("[GraphQL API Reference]"),
    );
  });

  test("includes separator between header and content", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-sep-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [[]],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("---");
    // Separator should come after intro, before API reference
    const introIdx = summary.indexOf("[Introduction]");
    const sepIdx = summary.indexOf("---");
    const apiRefIdx = summary.indexOf("[GraphQL API Reference]");
    expect(introIdx).toBeLessThan(sepIdx);
    expect(sepIdx).toBeLessThan(apiRefIdx);
  });

  test("starts with # Summary heading", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-heading-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [[]],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toMatch(/^# Summary/);
  });

  test("ensures Operations section comes before any other section", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-ops-first-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Interfaces",
              filePath: pathJoin(outputDir, "types", "interfaces", "node.md"),
              name: "Node",
            },
            {
              category: "Objects",
              filePath: pathJoin(outputDir, "types", "objects", "user.md"),
              name: "User",
            },
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "user.md"),
              name: "user",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    const opsIdx = summary.indexOf("# Operations");
    const interfacesIdx = summary.indexOf("# Types");
    // Operations must be first
    expect(opsIdx).toBeGreaterThan(0);
    expect(opsIdx).toBeLessThan(interfacesIdx);
  });

  test("formats category link with empty href", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-cat-link-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "foo.md"),
              name: "foo",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toContain("- [Queries]()");
  });

  test("formats page links with proper nesting", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-nesting-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "foo.md"),
              name: "foo",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    expect(summary).toMatch(/^ {2}- \[foo\]\(/m);
  });

  test("does not prioritize other sections like Types", async () => {
    const { mkdtempSync, readFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join: pathJoin } = await import("node:path");

    const rootDir = mkdtempSync(pathJoin(tmpdir(), "mdbook-not-types-"));
    const outputDir = pathJoin(rootDir, "graphql");

    const event = {
      data: {
        baseURL: "graphql",
        outputDir,
        rootDir,
        pages: [
          [
            {
              category: "Scalars",
              filePath: pathJoin(outputDir, "types", "scalars", "string.md"),
              name: "String",
            },
            {
              category: "Queries",
              filePath: pathJoin(outputDir, "operations", "queries", "foo.md"),
              name: "foo",
            },
          ],
        ],
      },
    };

    await afterRenderFilesHook(event);

    const summary = readFileSync(pathJoin(rootDir, "SUMMARY.md"), "utf-8");
    const typesIdx = summary.indexOf("# Types");
    const opsIdx = summary.indexOf("# Operations");
    // Operations must come before Types, not tied
    expect(opsIdx).toBeLessThan(typesIdx);
  });
});
