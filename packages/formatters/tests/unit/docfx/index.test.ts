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
  test("renders inline mark tag", () => {
    expect(formatMDXBadge({ text: "Required" })).toBe(
      '<mark class="gqlmd-docfx-badge">Required</mark>',
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
