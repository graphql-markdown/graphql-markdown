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
} from "../../../src/mdbook";

describe("formatMDXBadge", () => {
  test("renders bold text — no HTML components", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe("**Required**");
  });
});

describe("formatMDXAdmonition", () => {
  test("renders blockquote with uppercased type as label", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toContain("> **MY TITLE**");
    expect(result).toContain("> body");
  });

  test("uses type when title is empty", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "", type: "warning" },
      null,
    );
    expect(result).toContain("> **WARNING**");
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
  test("returns empty string — mdBook renders frontmatter as literal content", () => {
    expect(formatMDXFrontmatter(undefined, ["title: Test"])).toBe("");
  });

  test("returns empty string even when props are provided", () => {
    expect(formatMDXFrontmatter({ title: "Test" }, ["title: Test"])).toBe("");
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
    expect(formatter).toHaveProperty("formatMDXFrontmatter");
    expect(formatter).toHaveProperty("formatMDXLink");
  });
});
