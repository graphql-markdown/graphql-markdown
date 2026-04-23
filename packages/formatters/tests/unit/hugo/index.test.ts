import {
  beforeGenerateIndexMetafileHook,
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
} from "../../../src/hugo";

describe("formatMDXBadge", () => {
  test("renders inline span tag", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe(
      '<span class="gqlmd-badge">Required</span>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("renders GitHub-style alert with title", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain("> [!NOTE]");
    expect(result).toContain("> **My Title**");
    expect(result).toContain("> body");
  });

  test("maps warning to WARNING", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "T", type: "warning" },
      null,
    );
    expect(result).toContain("> [!WARNING]");
  });

  test("maps danger to CAUTION", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "T", type: "danger" },
      null,
    );
    expect(result).toContain("> [!CAUTION]");
  });

  test("maps info to IMPORTANT", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "T", type: "info" },
      null,
    );
    expect(result).toContain("> [!IMPORTANT]");
  });

  test("maps tip to TIP", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "T", type: "tip" },
      null,
    );
    expect(result).toContain("> [!TIP]");
  });
});

describe("formatMDXBullet", () => {
  test("renders bull entity with text", () => {
    expect(formatMDXBullet("item")).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
    );
  });
});

describe("mdxExtension", () => {
  test("uses markdown extension", () => {
    expect(mdxExtension).toBe(".md");
  });
});

describe("beforeGenerateIndexMetafileHook", () => {
  test("is exported", () => {
    expect(beforeGenerateIndexMetafileHook).toBeDefined();
  });
});

describe("formatMDXDetails", () => {
  test("renders HTML details element", () => {
    const result = formatMDXDetails({ dataOpen: "Show", dataClose: "Hide" });
    expect(result).toContain("<details>");
    expect(result).toContain("<summary>Show</summary>");
    expect(result).toContain("<em>Hide</em>");
  });
});

describe("formatMDXFrontmatter", () => {
  test("returns empty string when formatted is null", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
  });

  test("wraps lines with --- delimiters", () => {
    const result = formatMDXFrontmatter(undefined, ["title: Test"]);
    expect(result).toContain("---");
    expect(result).toContain("title: Test");
  });

  test("renders heading from single-quoted title", () => {
    const result = formatMDXFrontmatter(undefined, ["title: 'My Title'"]);
    expect(result).toContain("# My Title");
  });

  test("renders heading from title with extra spacing", () => {
    const result = formatMDXFrontmatter(undefined, ["  title:   Test Value  "]);
    expect(result).toContain("# Test Value");
  });
});

describe("formatMDXLink", () => {
  test("strips .md extension from internal links", () => {
    expect(formatMDXLink({ text: "Type", url: "/schema/type.md" })).toEqual({
      text: "Type",
      url: "/schema/type",
    });
  });

  test("leaves links without .md unchanged", () => {
    const link = { text: "Type", url: "/schema/type" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("strips .md only at end of URL", () => {
    expect(formatMDXLink({ text: "Link", url: "/md/file.md" })).toEqual({
      text: "Link",
      url: "/md/file",
    });
  });

  test("leaves .md in middle of path unchanged", () => {
    expect(formatMDXLink({ text: "Link", url: "/md/file.txt" })).toEqual({
      text: "Link",
      url: "/md/file.txt",
    });
  });

  test("strips .md from simple filename", () => {
    expect(formatMDXLink({ text: "Readme", url: "README.md" })).toEqual({
      text: "Readme",
      url: "README",
    });
  });

  test("does not strip .md when followed by fragment", () => {
    expect(formatMDXLink({ text: "Link", url: "/docs.md#section" })).toEqual({
      text: "Link",
      url: "/docs.md#section",
    });
  });

  test("does not strip .md when followed by query string", () => {
    expect(formatMDXLink({ text: "Link", url: "/docs.md?id=1" })).toEqual({
      text: "Link",
      url: "/docs.md?id=1",
    });
  });

  test("handles multiple occurrences of md", () => {
    expect(formatMDXLink({ text: "Link", url: "/md/command.md" })).toEqual({
      text: "Link",
      url: "/md/command",
    });
  });

  test("preserves other extensions", () => {
    expect(formatMDXLink({ text: "Link", url: "/path/file.html" })).toEqual({
      text: "Link",
      url: "/path/file.html",
    });
  });

  test("handles root path with .md", () => {
    expect(formatMDXLink({ text: "Home", url: "/index.md" })).toEqual({
      text: "Home",
      url: "/index",
    });
  });

  test("leaves empty url unchanged", () => {
    expect(formatMDXLink({ text: "Link", url: "" })).toEqual({
      text: "Link",
      url: "",
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
    expect(formatter).toHaveProperty("formatMDXBullet");
    expect(formatter).toHaveProperty("formatMDXDetails");
    expect(formatter).toHaveProperty("formatMDXFrontmatter");
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).toHaveProperty("formatMDXNameEntity");
    expect(formatter).toHaveProperty("formatMDXSpecifiedByLink");
  });
});
