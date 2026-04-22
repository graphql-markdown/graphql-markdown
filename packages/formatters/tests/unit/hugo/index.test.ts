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
    expect(formatMDXBullet("item")).toBe("&nbsp;&bull;&nbsp;item");
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
});

describe("formatMDXNameEntity", () => {
  test("renders backtick code with parent", () => {
    expect(formatMDXNameEntity("field", "Query")).toBe("`Query.field`");
  });

  test("renders backtick code without parent", () => {
    expect(formatMDXNameEntity("field")).toBe("`field`");
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("renders markdown link", () => {
    expect(formatMDXSpecifiedByLink("https://spec.example")).toBe(
      "[Specification ⎘](https://spec.example)",
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
