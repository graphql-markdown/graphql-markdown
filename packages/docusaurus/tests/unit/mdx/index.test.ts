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
} from "../../../src/mdx";

describe("formatMDXBadge", () => {
  test("returns a formatted MDX badge string", () => {
    const badge = { text: "Test Badge", classname: "test-class" };
    const result = formatMDXBadge(badge);
    expect(result).toBe(
      '<Badge class="badge badge--secondary badge--test-class" text="Test Badge"/>',
    );
  });
});

describe("formatMDXAdmonition", () => {
  test("returns a formatted MDX admonition string for Docusaurus v2", () => {
    const admonition = {
      text: "Test Text",
      title: "Test Title",
      type: "warning",
    };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "2.0.0",
    };
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toBe("\n\n:::caution Test TitleTest Text:::");
  });

  test("returns a formatted MDX admonition string for non-Docusaurus", () => {
    const admonition = { text: "Test Text", title: "Test Title", type: "info" };
    const meta = null;
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toBe("\n\n:::info[Test Title]Test Text:::");
  });
});

describe("formatMDXBullet", () => {
  test("returns a formatted MDX bullet string", () => {
    const result = formatMDXBullet("Test Bullet");
    expect(result).toBe("<Bullet />Test Bullet");
  });
});

describe("formatMDXDetails", () => {
  test("returns a formatted MDX details string", () => {
    const details = {
      dataOpen: "Open",
      dataClose: "Close",
    };
    const result = formatMDXDetails(details);
    expect(result).toBe(
      '\n\n<Details dataOpen="Hide Open" dataClose="Show Close">\n\n\r\n\n</Details>\n\n',
    );
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("returns a formatted MDX specified by link string", () => {
    const url = "https://example.com";
    const result = formatMDXSpecifiedByLink(url);
    expect(result).toBe('<SpecifiedBy url="https://example.com"/>');
  });
});

describe("formatMDXNameEntity", () => {
  test("returns a formatted MDX name entity string with parent type", () => {
    const result = formatMDXNameEntity("EntityName", "ParentType");
    expect(result).toBe(
      "<code style={{ fontWeight: 'normal' }}>ParentType.<b>EntityName</b></code>",
    );
  });

  test("returns a formatted MDX name entity string without parent type", () => {
    const result = formatMDXNameEntity("EntityName");
    expect(result).toBe(
      "<code style={{ fontWeight: 'normal' }}><b>EntityName</b></code>",
    );
  });
});

describe("formatMDXLink", () => {
  test("returns a formatted MDX link object", () => {
    const link = { text: "Link Text", url: "/example" };
    const result = formatMDXLink(link);
    expect(result).toEqual({ text: "Link Text", url: "/example.mdx" });
  });
});

describe("formatMDXFrontmatter", () => {
  test("returns empty string when formatted is undefined", () => {
    const result = formatMDXFrontmatter(undefined, undefined);
    expect(result).toBe("");
  });

  test("returns empty string when formatted is null", () => {
    const result = formatMDXFrontmatter(undefined, null);
    expect(result).toBe("");
  });

  test("formats frontmatter with content", () => {
    const result = formatMDXFrontmatter(undefined, [
      "title: Test",
      "id: test-id",
    ]);
    expect(result).toBe("---\ntitle: Test\nid: test-id\n---");
  });
});

describe("createMDXFormatter", () => {
  test("creates a formatter with all required methods", () => {
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

  test("formatMDXBadge returns expected output", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXBadge({ text: "Required" });
    expect(result).toContain("Badge");
    expect(result).toContain("Required");
  });

  test("formatMDXAdmonition uses meta from factory when provided", () => {
    const formatter = createMDXFormatter({
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "2.0.0",
    });
    const result = formatter.formatMDXAdmonition(
      { text: "content", title: "Title", type: "warning" },
      undefined,
    );
    // Docusaurus v2 uses 'caution' instead of 'warning'
    expect(result).toContain("caution");
  });

  test("formatMDXAdmonition falls back to _meta when factory meta is not provided", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXAdmonition(
      { text: "content", title: "Title", type: "info" },
      { generatorFrameworkName: "other" },
    );
    expect(result).toContain("info[Title]");
  });

  test("formatMDXBullet returns expected output", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXBullet("item");
    expect(result).toBe("<Bullet />item");
  });

  test("formatMDXDetails returns expected output", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXDetails({
      dataOpen: "details",
      dataClose: "details",
    });
    expect(result).toContain("Details");
  });

  test("formatMDXFrontmatter returns expected output", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXFrontmatter(undefined, ["title: Test"]);
    expect(result).toContain("---");
    expect(result).toContain("title: Test");
  });

  test("formatMDXLink appends .mdx extension", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXLink({ text: "Link", url: "/path" });
    expect(result.url).toBe("/path.mdx");
  });

  test("formatMDXNameEntity returns expected output", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXNameEntity("field", "Type");
    expect(result).toContain("Type.");
    expect(result).toContain("field");
  });

  test("formatMDXSpecifiedByLink returns expected output", () => {
    const formatter = createMDXFormatter();
    const result = formatter.formatMDXSpecifiedByLink("https://spec.example");
    expect(result).toContain("SpecifiedBy");
    expect(result).toContain("https://spec.example");
  });
});
