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
} from "../../../src/mkdocs";

describe("formatMDXBadge", () => {
  test("renders inline mark tag", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe(
      '<mark class="gqlmd-mkdocs-badge">Required</mark>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("renders MkDocs Material admonition with 4-space-indented content", () => {
    const result = formatMDXAdmonition(
      { text: "body text", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain('!!! note "My Title"');
    expect(result).toContain("    body text");
  });

  test("maps deprecated type to warning", () => {
    const result = formatMDXAdmonition(
      { text: "old", title: "Deprecated", type: "deprecated" },
      null,
    );
    expect(result).toContain("!!! warning");
  });

  test("falls back to note for unknown type", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "T", type: "unknown" },
      null,
    );
    expect(result).toContain("!!! note");
  });

  test("omits title attribute when title is empty", () => {
    const result = formatMDXAdmonition(
      { text: "x", title: "", type: "tip" },
      null,
    );
    expect(result).toContain("!!! tip\n");
  });
});

describe("formatMDXBullet", () => {
  test("renders bull entity with text", () => {
    expect(formatMDXBullet("item")).toBe("&bull;&nbsp;item");
  });

  test("renders bull entity with empty default", () => {
    expect(formatMDXBullet()).toBe("&bull;&nbsp;");
  });
});

describe("formatMDXDetails", () => {
  test("renders MkDocs Material collapsible admonition", () => {
    const result = formatMDXDetails({ dataOpen: "Show", dataClose: "Hide" });
    expect(result).toContain('??? note "Show"');
    expect(result).toContain("*Hide*");
  });
});

describe("formatMDXFrontmatter", () => {
  test("returns empty string when formatted is null", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
  });

  test("wraps lines with --- delimiters", () => {
    const result = formatMDXFrontmatter(undefined, ["title: Test", "id: foo"]);
    expect(result).toBe("---\ntitle: Test\nid: foo\n---");
  });
});

describe("formatMDXLink", () => {
  test("returns link unchanged", () => {
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
