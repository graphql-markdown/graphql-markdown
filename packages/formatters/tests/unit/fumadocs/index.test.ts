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
    expect(formatMDXBullet("item")).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
    );
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
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).toHaveProperty("formatMDXNameEntity");
  });
});
