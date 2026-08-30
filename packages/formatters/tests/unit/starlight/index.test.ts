import {
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
  mdxDeclaration,
  mdxExtension,
} from "../../../src/starlight";

describe("mdxDeclaration", () => {
  test("imports Starlight Aside and Badge components", () => {
    expect(mdxDeclaration).toContain("@astrojs/starlight/components");
    expect(mdxDeclaration).toContain("Aside");
    expect(mdxDeclaration).toContain("Badge");
  });
});

describe("mdxExtension", () => {
  test("uses .mdx extension", () => {
    expect(mdxExtension).toBe(".mdx");
  });
});

describe("formatMDXBadge", () => {
  test("renders default variant", () => {
    const result = formatMDXBadge({ text: "Required", classname: "required" });
    expect(result).toContain('<Badge variant="default"');
    expect(result).toContain('text="Required"');
  });

  test("renders caution variant for DEPRECATED classname", () => {
    const result = formatMDXBadge({
      text: "Deprecated",
      classname: "DEPRECATED",
    });
    expect(result).toContain('variant="caution"');
  });
});

describe("formatMDXAdmonition", () => {
  test("renders Aside note for non-warning types", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "Info", type: "note" },
      null,
    );
    expect(result).toContain('<Aside type="note"');
    expect(result).toContain('title="Info"');
    expect(result).toContain("body");
  });

  test("maps warning type to caution", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "Watch out", type: "warning" },
      null,
    );
    expect(result).toContain('<Aside type="caution"');
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
  test("returns link unchanged", () => {
    expect(formatMDXLink({ text: "Type", url: "/schema/type" })).toEqual({
      text: "Type",
      url: "/schema/type",
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

describe("formatMDXPermalink", () => {
  test("renders permalink with proper formatting", () => {
    expect(formatMDXPermalink("foo")).toBe(String.raw`\{#foo\}`);
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
  });
});
