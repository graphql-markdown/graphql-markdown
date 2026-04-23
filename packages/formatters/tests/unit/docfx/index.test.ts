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
} from "../../../src/docfx";

describe("formatMDXBadge", () => {
  test("renders bootstrap badge with secondary variant when no classname", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe(
      '<span class="badge text-bg-secondary">Required</span>',
    );
  });

  test("maps DEPRECATED classname to danger variant", () => {
    expect(
      formatMDXBadge({ text: "Deprecated", classname: "DEPRECATED" }),
    ).toBe('<span class="badge text-bg-danger">Deprecated</span>');
  });

  test("maps NON_NULL classname to primary variant", () => {
    expect(formatMDXBadge({ text: "Non-null", classname: "NON_NULL" })).toBe(
      '<span class="badge text-bg-primary">Non-null</span>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("renders DocFX alert with title", () => {
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

  test("injects uid field from id prop", () => {
    const result = formatMDXFrontmatter({ id: "my-type" }, [
      "  title: My Type",
    ]);
    expect(result).toContain("uid: my-type");
    expect(result).toContain("title: My Type");
  });

  test("does not inject uid when id prop is absent", () => {
    const result = formatMDXFrontmatter({ title: "My Type" }, [
      "  title: My Type",
    ]);
    expect(result).not.toContain("uid:");
  });

  test("uid appears before other frontmatter fields", () => {
    const result = formatMDXFrontmatter({ id: "foo" }, ["  title: Foo"]);
    expect(result.indexOf("uid:")).toBeLessThan(result.indexOf("title:"));
  });
});

describe("formatMDXLink", () => {
  test("returns link unchanged", () => {
    const link = { text: "Type", url: "/schema/type" };
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
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).toHaveProperty("formatMDXNameEntity");
  });
});
