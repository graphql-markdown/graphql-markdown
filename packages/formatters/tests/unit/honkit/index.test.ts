import {
  beforeComposePageTypeHook,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxExtension,
} from "../../../src/honkit";

describe("mdxExtension", () => {
  test("uses .md extension — HonKit outputs plain markdown", () => {
    expect(mdxExtension).toBe(".md");
  });
});

describe("formatMDXBadge", () => {
  test("renders inline span with themed styles", () => {
    const result = formatMDXBadge({ text: "Required", classname: "required" });
    expect(result).toContain("<span");
    expect(result).toContain("Required");
    expect(result).toContain("border-radius:999px");
  });

  test("applies deprecated theme for deprecated classname", () => {
    const result = formatMDXBadge({ text: "Old", classname: "deprecated" });
    expect(result).toContain("#9f1239");
  });

  test("applies default theme for unknown classname", () => {
    const result = formatMDXBadge({ text: "Thing", classname: "other" });
    expect(result).toContain("#374151");
  });
});

describe("formatMDXAdmonition", () => {
  test("renders INFO blockquote for non-warning types", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "My Title", type: "note" },
      null,
    );
    expect(result).toBe("> **INFO - My Title**\n>\n> body");
  });

  test("renders WARNING blockquote for warning type", () => {
    const result = formatMDXAdmonition(
      { text: "body", title: "Watch out", type: "warning" },
      null,
    );
    expect(result).toContain("> **WARNING - Watch out**");
  });
});

describe("formatMDXBullet", () => {
  test("renders bullet character with text", () => {
    expect(formatMDXBullet("item")).toBe(" • item");
  });

  test("renders bullet character with empty default", () => {
    expect(formatMDXBullet()).toBe(" • ");
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
  test("returns empty string when props is falsy", () => {
    expect(formatMDXFrontmatter(undefined, null)).toBe("");
    expect(formatMDXFrontmatter(false, null)).toBe("");
  });

  test("returns empty string when props has no keys", () => {
    expect(formatMDXFrontmatter({}, [])).toBe("");
  });

  test("renders YAML block with H1 heading from title", () => {
    const result = formatMDXFrontmatter({ title: "My Type" }, []);
    expect(result).toContain("---\ntitle: My Type\n---");
    expect(result).toContain("# My Type");
  });

  test("merges formatted lines into YAML, overriding props", () => {
    const result = formatMDXFrontmatter({ title: "Old Title" }, [
      "title: New Title",
    ]);
    expect(result).toContain("title: New Title");
    expect(result).not.toContain("Old Title");
  });
});

describe("formatMDXLink", () => {
  test("appends .html to internal absolute paths", () => {
    expect(formatMDXLink({ text: "Type", url: "/schema/type" })).toEqual({
      text: "Type",
      url: "/schema/type.html",
    });
  });

  test("leaves external http links unchanged", () => {
    const link = { text: "Spec", url: "https://example.com" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves anchor links unchanged", () => {
    const link = { text: "Section", url: "#section" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves already-.html links unchanged", () => {
    const link = { text: "Type", url: "/schema/type.html" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves root / unchanged", () => {
    const link = { text: "Home", url: "/" };
    expect(formatMDXLink(link)).toEqual(link);
  });
});

describe("formatMDXNameEntity", () => {
  test("renders qualified name with parent", () => {
    expect(formatMDXNameEntity("field", "Query")).toBe("Query.field");
  });

  test("renders plain name without parent", () => {
    expect(formatMDXNameEntity("field")).toBe("field");
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("renders plain text specification link", () => {
    expect(formatMDXSpecifiedByLink("https://spec.example")).toBe(
      "\n\nSpecified by: https://spec.example",
    );
  });
});

describe("beforeComposePageTypeHook", () => {
  test("injects kind badge into H1 heading", async () => {
    const header = { content: "# MyQuery" };
    const event = {
      data: {
        type: {
          constructor: { name: "GraphQLObjectType" },
          name: "Query",
          astNode: { kind: "ObjectTypeDefinition" },
        },
        options: {
          schema: {
            getQueryType: () => {
              return { name: "Query" };
            },
            getMutationType: () => {
              return null;
            },
            getSubscriptionType: () => {
              return null;
            },
          },
        },
        sections: { header },
      },
      output: ["header"],
    };

    await beforeComposePageTypeHook(event as never);

    expect(header.content).toContain("# MyQuery");
    expect(header.content).toContain("query");
    expect(header.content).toContain("border-radius:999px");
  });

  test("does nothing when entity kind cannot be determined", async () => {
    const header = { content: "# Unknown" };
    const event = {
      data: {
        type: null,
        options: {},
        sections: { header },
      },
      output: ["header"],
    };

    await beforeComposePageTypeHook(event as never);

    expect(header.content).toBe("# Unknown");
  });

  test("prepends toc section when enough headings exist", async () => {
    const header = { content: "# MyType" };
    const fields = { content: "### Field One\n\n### Field Two" };
    const event = {
      data: {
        type: {
          constructor: { name: "GraphQLObjectType" },
          name: "Other",
          astNode: { kind: "ObjectTypeDefinition" },
        },
        options: {
          schema: {
            getQueryType: () => {
              return null;
            },
            getMutationType: () => {
              return null;
            },
            getSubscriptionType: () => {
              return null;
            },
          },
        },
        sections: { header, fields },
      },
      output: ["header", "fields"],
    };

    await beforeComposePageTypeHook(event as never);

    expect((event.data.sections as Record<string, unknown>).toc).toBeDefined();
    expect(event.output[0]).toBe("toc");
  });
});

describe("createMDXFormatter", () => {
  test("returns a complete formatter", () => {
    const formatter = createMDXFormatter();
    expect(formatter).toHaveProperty("formatMDXBadge");
    expect(formatter).toHaveProperty("formatMDXAdmonition");
    expect(formatter).toHaveProperty("formatMDXLink");
    expect(formatter).toHaveProperty("formatMDXFrontmatter");
  });
});
