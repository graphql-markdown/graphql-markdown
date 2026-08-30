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
} from "../../../src/docusaurus";

describe("formatMDXBadge", () => {
  test("returns a formatted MDX badge string", () => {
    const badge = { text: "Test Badge", classname: "test-class" };
    const result = formatMDXBadge(badge);
    expect(result).toBe(
      '<Badge class="badge badge--secondary badge--test-class" text="Test Badge"/>',
    );
  });

  test("includes badge-- prefix for classname", () => {
    const badge = { text: "Badge", classname: "required" };
    const result = formatMDXBadge(badge);
    expect(result).toContain("badge--required");
  });

  test("lowercases classname in badge prefix", () => {
    const badge = { text: "Badge", classname: "Required" };
    const result = formatMDXBadge(badge);
    expect(result).toContain("badge--required");
    expect(result).not.toContain("badge--Required");
  });

  test("returns empty string for non-string classname", () => {
    const badge = { text: "Badge", classname: null };
    const result = formatMDXBadge(badge);
    expect(result).toContain('<Badge class="badge badge--secondary "');
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

  test("converts warning to caution only for Docusaurus v2", () => {
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
    expect(result).toContain(":::caution");
    expect(result).not.toContain(":::warning");
  });

  test("preserves warning type for Docusaurus v1", () => {
    const admonition = {
      text: "Test Text",
      title: "Test Title",
      type: "warning",
    };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "1.0.0",
    };
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toContain(":::warning[Test Title]");
  });

  test("uses bracket notation for non-v2 Docusaurus", () => {
    const admonition = {
      text: "Test Text",
      title: "Test Title",
      type: "info",
    };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "1.0.0",
    };
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toContain(":::info[Test Title]");
  });

  test("returns a formatted MDX admonition string for non-Docusaurus", () => {
    const admonition = { text: "Test Text", title: "Test Title", type: "info" };
    const meta = null;
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toBe("\n\n:::info[Test Title]Test Text:::");
  });

  test("requires both framework name and version check for v2 behavior", () => {
    const admonition = {
      text: "Test Text",
      title: "Test Title",
      type: "warning",
    };

    // With framework name but no version
    const metaNoVersion = {
      generatorFrameworkName: "docusaurus",
    };
    const resultNoVersion = formatMDXAdmonition(admonition, metaNoVersion);
    expect(resultNoVersion).toContain(":::warning[Test Title]");

    // With version but wrong framework name
    const metaWrongFramework = {
      generatorFrameworkName: "other",
      generatorFrameworkVersion: "2.0.0",
    };
    const resultWrongFramework = formatMDXAdmonition(
      admonition,
      metaWrongFramework,
    );
    expect(resultWrongFramework).toContain(":::warning[Test Title]");
  });

  test("v2 uses space after type instead of brackets", () => {
    const admonition = {
      text: "Content",
      title: "MyTitle",
      type: "note",
    };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "2.0.0",
    };
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toContain(":::note MyTitle");
    expect(result).not.toContain(":::note[");
  });

  test("v1 uses brackets instead of space", () => {
    const admonition = {
      text: "Content",
      title: "MyTitle",
      type: "note",
    };
    const meta = {
      generatorFrameworkName: "docusaurus",
      generatorFrameworkVersion: "1.0.0",
    };
    const result = formatMDXAdmonition(admonition, meta);
    expect(result).toContain(":::note[MyTitle]");
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
      '\n\n<details class="graphql-markdown-details">\n<summary>\n<span class="graphql-markdown-details-label-closed">Show Close</span>\n<span class="graphql-markdown-details-label-open" hidden>Hide Open</span>\n</summary>\n\n\r\n\n</details>\n\n',
    );
  });
});

describe("formatMDXPermalink", () => {
  const meta = (generatorFrameworkVersion: string) => {
    return { generatorFrameworkName: "docusaurus", generatorFrameworkVersion };
  };

  test("returns the MDX comment syntax for Docusaurus 3.10", () => {
    expect(formatMDXPermalink("foo", meta("3.10.2"))).toBe("{/* #foo */}");
  });

  test("returns the MDX comment syntax for Docusaurus above 3.10", () => {
    expect(formatMDXPermalink("foo", meta("4.0.0"))).toBe("{/* #foo */}");
    expect(formatMDXPermalink("foo", meta("3.11.0"))).toBe("{/* #foo */}");
  });

  test("returns the classic escaped syntax below Docusaurus 3.10", () => {
    expect(formatMDXPermalink("foo", meta("3.9.1"))).toBe(String.raw`\{#foo\}`);
    expect(formatMDXPermalink("foo", meta("2.4.3"))).toBe(String.raw`\{#foo\}`);
  });

  test("returns the classic escaped syntax when the version is unknown", () => {
    expect(formatMDXPermalink("foo")).toBe(String.raw`\{#foo\}`);
    expect(formatMDXPermalink("foo", meta("next"))).toBe(String.raw`\{#foo\}`);
    expect(
      formatMDXPermalink("foo", { generatorFrameworkName: "docusaurus" }),
    ).toBe(String.raw`\{#foo\}`);
  });

  test("returns the classic escaped syntax for another framework", () => {
    expect(
      formatMDXPermalink("foo", {
        generatorFrameworkName: "vocs",
        generatorFrameworkVersion: "3.10.2",
      }),
    ).toBe(String.raw`\{#foo\}`);
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
    expect(formatter).toHaveProperty("formatMDXPermalink");
    expect(formatter).toHaveProperty("formatMDXSpecifiedByLink");
  });

  test("formatMDXPermalink uses the version from the formatter metadata", () => {
    expect(
      createMDXFormatter({
        generatorFrameworkName: "docusaurus",
        generatorFrameworkVersion: "3.10.2",
      }).formatMDXPermalink("foo"),
    ).toBe("{/* #foo */}");

    expect(
      createMDXFormatter({
        generatorFrameworkName: "docusaurus",
        generatorFrameworkVersion: "3.9.1",
      }).formatMDXPermalink("foo"),
    ).toBe(String.raw`\{#foo\}`);

    expect(createMDXFormatter().formatMDXPermalink("foo")).toBe(
      String.raw`\{#foo\}`,
    );
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
    expect(result).toContain('<details class="graphql-markdown-details">');
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
