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
} from "../../../src/vocs/index";

describe("mdxDeclaration", () => {
  test("imports MUI Chip and defines Bullet component", () => {
    expect(mdxDeclaration).toContain("@mui/material/Chip");
    expect(mdxDeclaration).toContain("Bullet");
  });
});

describe("formatMDXBadge", () => {
  test("renders MUI Chip for default classname", () => {
    const result = formatMDXBadge({ text: "Required", classname: "required" });
    expect(result).toContain('<Chip color="info"');
    expect(result).toContain('label="Required"');
  });

  test("renders caution color for DEPRECATED classname", () => {
    const result = formatMDXBadge({
      text: "Deprecated",
      classname: "DEPRECATED",
    });
    expect(result).toContain('color="warning"');
  });
});

describe("formatMDXAdmonition", () => {
  test("renders Vocs callout syntax for non-warning types", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain(":::info[My Title]body:::");
  });

  test("renders warning callout for warning type", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "Heads up", type: "warning" },
      null,
    );
    expect(result).toContain(":::warning[Heads up]body:::");
  });
});

describe("formatMDXBullet", () => {
  test("renders Bullet JSX component", () => {
    expect(formatMDXBullet("item")).toBe("<Bullet/>item");
  });

  test("renders Bullet component with empty default", () => {
    expect(formatMDXBullet()).toBe("<Bullet/>");
  });
});

describe("formatMDXDetails", () => {
  test("renders HTML details element", () => {
    const result = formatMDXDetails({ dataOpen: "Show", dataClose: "Hide" });
    expect(result).toContain('<details class="gqlmd-mdx-details">');
    expect(result).toContain("SHOW");
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
  test("renders JSX span with parent and child code elements", () => {
    const result = formatMDXNameEntity("field", "Query");
    expect(result).toContain("Query");
    expect(result).toContain("field");
  });

  test("renders JSX span with only name when no parent", () => {
    const result = formatMDXNameEntity("field");
    expect(result).toContain("field");
    expect(result).not.toContain(".");
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
    expect(formatter).toHaveProperty("formatMDXLink");
  });
});
