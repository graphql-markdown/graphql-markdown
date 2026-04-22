import {
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxDeclaration,
} from "../../../src/fumadocs";

describe("mdxDeclaration", () => {
  test("imports Fumadocs Callout and MUI Chip", () => {
    expect(mdxDeclaration).toContain("fumadocs-ui/components/callout");
    expect(mdxDeclaration).toContain("@mui/material/Chip");
  });
});

describe("formatMDXBadge", () => {
  test("renders MUI Chip for default classname", () => {
    const result = formatMDXBadge({ text: "Required", classname: "required" });
    expect(result).toContain('<Chip color="info"');
    expect(result).toContain('label="Required"');
  });

  test("renders warning color for DEPRECATED classname", () => {
    const result = formatMDXBadge({
      text: "Deprecated",
      classname: "DEPRECATED",
    });
    expect(result).toContain('color="warning"');
  });
});

describe("formatMDXAdmonition", () => {
  test("renders Fumadocs Callout for non-warning types", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain('<Callout type="info"');
    expect(result).toContain('title="My Title"');
    expect(result).toContain("body");
  });

  test("maps warning type to warn", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "Watch out", type: "warning" },
      null,
    );
    expect(result).toContain('<Callout type="warn"');
  });
});

describe("formatMDXBullet", () => {
  test("renders bull entity with text", () => {
    expect(formatMDXBullet("item")).toBe("&bull;&nbsp;item");
  });
});

describe("formatMDXDetails", () => {
  test("renders HTML details element", () => {
    const result = formatMDXDetails({ dataOpen: "Show", dataClose: "Hide" });
    expect(result).toContain("<details>");
    expect(result).toContain("<summary>Show</summary>");
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
});

describe("formatMDXLink", () => {
  test("appends .mdx extension", () => {
    expect(formatMDXLink({ text: "Type", url: "/schema/type" })).toEqual({
      text: "Type",
      url: "/schema/type.mdx",
    });
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
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).toHaveProperty("formatMDXNameEntity");
  });
});
