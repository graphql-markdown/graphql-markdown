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
});
