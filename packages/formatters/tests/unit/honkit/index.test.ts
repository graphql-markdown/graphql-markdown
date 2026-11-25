import {
  __default,
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
  formatMDXTitle,
  mdxExtension,
} from "../../../src/honkit";

const { formatMDXBullet } = __default;

describe("mdxExtension", () => {
  test("uses .md extension — HonKit outputs plain markdown", () => {
    expect(mdxExtension).toBe(".md");
  });
});

describe("formatMDXBadge", () => {
  test("renders inline span with shared styles", () => {
    const result = formatMDXBadge({ text: "Required", classname: "required" });
    expect(result).toContain("<span");
    expect(result).toContain("Required");
    expect(result).toContain("border-radius:999px");
  });

  test("uses same shared color for deprecated classname", () => {
    const result = formatMDXBadge({ text: "Old", classname: "deprecated" });
    expect(result).toContain("#374151");
  });

  test("uses same shared color for unknown classname", () => {
    const result = formatMDXBadge({ text: "Thing", classname: "other" });
    expect(result).toContain("#374151");
  });

  test("trims badge text with leading and trailing spaces", () => {
    const result = formatMDXBadge({
      text: "  Trimmed  ",
      classname: "required",
    });
    expect(result).toContain(">Trimmed<");
    expect(result).not.toContain(">  Trimmed  <");
  });

  test("handles badge text with singular property", () => {
    const result = formatMDXBadge({
      text: { singular: "Item" } as any,
      classname: "required",
    });
    expect(result).toContain("Item");
  });

  test("includes consistent border, background, and color styles", () => {
    const result = formatMDXBadge({ text: "Badge", classname: "test" });
    expect(result).toContain("border:1px solid #d1d5db");
    expect(result).toContain("background:#f6f7f9");
    expect(result).toContain("color:#374151");
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

  test("quotes every line of multi-line text and trims leading/trailing blank lines", () => {
    const result = formatMDXAdmonition(
      {
        text: "\n\nReplaced by the `X` enum.\n\nSecond paragraph.",
        title: "Deprecated",
        type: "warning",
      },
      null,
    );
    expect(result).toBe(`> **WARNING - Deprecated**
>
> Replaced by the \`X\` enum.
>
> Second paragraph.`);
  });
});

describe("formatMDXBullet", () => {
  test("renders bullet character with text", () => {
    expect(formatMDXBullet("item")).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>item',
    );
  });

  test("renders bullet character with empty default", () => {
    expect(formatMDXBullet()).toBe(
      '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>',
    );
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

  test("returns empty string when props is null", () => {
    expect(formatMDXFrontmatter(null, [])).toBe("");
  });

  test("returns empty string when props has no keys", () => {
    expect(formatMDXFrontmatter({}, [])).toBe("");
  });

  test("renders YAML block without a title heading", () => {
    // the visible title is printed by formatMDXTitle
    const result = formatMDXFrontmatter({ title: "My Type" }, []);
    expect(result).toBe("---\ntitle: My Type\n---");
  });

  test("merges formatted lines into YAML, overriding props", () => {
    const result = formatMDXFrontmatter({ title: "Old Title" }, [
      "title: New Title",
    ]);
    expect(result).toContain("title: New Title");
    expect(result).not.toContain("Old Title");
  });

  test("returns empty string when props is a non-object value", () => {
    expect(formatMDXFrontmatter("string" as any, null)).toBe("");
  });

  test("handles props with multiple keys", () => {
    const result = formatMDXFrontmatter(
      { title: "Test", description: "A test page", id: "test-1" },
      [],
    );
    expect(result).toContain("title: Test");
    expect(result).toContain("description: A test page");
    expect(result).toContain("id: test-1");
  });

  test("returns empty string when formatted is undefined and props is empty", () => {
    expect(formatMDXFrontmatter({}, undefined)).toBe("");
  });
});

describe("formatMDXTitle", () => {
  test("renders the page title as a visible H1 heading", () => {
    expect(formatMDXTitle("My Type")).toBe("# My Type");
  });

  test("returns empty string when the title is blank", () => {
    expect(formatMDXTitle("")).toBe("");
    expect(formatMDXTitle("  \n ")).toBe("");
  });

  test("trims title whitespace", () => {
    expect(formatMDXTitle("  Spaced Title  ")).toBe("# Spaced Title");
  });

  test("replaces single newlines with spaces", () => {
    expect(formatMDXTitle("Line One\nLine Two")).toBe("# Line One Line Two");
  });

  test("replaces carriage return + newline with space", () => {
    expect(formatMDXTitle("Line One\r\nLine Two")).toBe("# Line One Line Two");
  });

  test("replaces multiple consecutive newlines", () => {
    expect(formatMDXTitle("Line One\n\nLine Two")).toBe("# Line One  Line Two");
  });

  test("handles Windows-style line endings", () => {
    expect(formatMDXTitle("A\r\nB\r\nC")).toBe("# A B C");
  });

  test("trims spaces after newline replacement", () => {
    expect(formatMDXTitle("Title\n  ")).toBe("# Title");
  });

  test("does not contain literal newlines in heading", () => {
    expect(formatMDXTitle("Multi\nLine\nTitle")).not.toMatch(/[\r\n]/);
  });

  test("is part of the HonKit formatter", () => {
    expect(createMDXFormatter().formatMDXTitle).toBe(formatMDXTitle);
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

  test("leaves external http:// links unchanged", () => {
    const link = { text: "Page", url: "http://example.com" };
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

  test("leaves mailto: links unchanged", () => {
    const link = { text: "Email", url: "mailto:test@example.com" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves tel: links unchanged", () => {
    const link = { text: "Call", url: "tel:+1234567890" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("handles internal paths with query strings", () => {
    const result = formatMDXLink({ text: "Search", url: "/search?q=test" });
    expect(result).toEqual({
      text: "Search",
      url: "/search.html?q=test",
    });
  });

  test("handles internal paths with fragments", () => {
    const result = formatMDXLink({ text: "Section", url: "/docs#intro" });
    expect(result).toEqual({
      text: "Section",
      url: "/docs.html#intro",
    });
  });

  test("handles internal paths with query string and fragment", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "/page?id=1#section",
    });
    expect(result).toEqual({
      text: "Link",
      url: "/page.html?id=1#section",
    });
  });

  test("returns unchanged link when URL is null", () => {
    expect(formatMDXLink({ text: "Type", url: null })).toEqual({
      text: "Type",
      url: null,
    });
  });

  test("returns unchanged link when URL is undefined", () => {
    expect(formatMDXLink({ text: "Type", url: undefined })).toEqual({
      text: "Type",
      url: undefined,
    });
  });

  test("returns unchanged link when URL is empty string", () => {
    expect(formatMDXLink({ text: "Type", url: "" })).toEqual({
      text: "Type",
      url: "",
    });
  });

  test("trims whitespace from URLs", () => {
    const result = formatMDXLink({ text: "Type", url: "  /schema/type  " });
    expect(result.url).toBe("/schema/type.html");
  });

  test("leaves https:// (case insensitive) unchanged", () => {
    const link = { text: "Spec", url: "HTTPS://EXAMPLE.COM" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves HTTP:// (case insensitive) unchanged", () => {
    const link = { text: "Page", url: "HTTP://EXAMPLE.COM" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("leaves MAILTO: (case insensitive) unchanged", () => {
    const link = { text: "Email", url: "MAILTO:test@example.com" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("handles complex query strings with special characters", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "/search?q=test&filter=a,b,c",
    });
    expect(result.url).toBe("/search.html?q=test&filter=a,b,c");
  });

  test("handles paths with dots in filename", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "/files/archive.tar.gz",
    });
    expect(result.url).toBe("/files/archive.tar.gz");
  });

  test("protocol detection is case-insensitive", () => {
    expect(formatMDXLink({ text: "L", url: "hTtPs://x.com" })).toEqual({
      text: "L",
      url: "hTtPs://x.com",
    });
  });

  test("disables protocol detection for internal paths starting with http-like text", () => {
    // This should add .html because it doesn't have the protocol marker
    const result = formatMDXLink({ text: "Link", url: "/httpserver" });
    expect(result.url).toBe("/httpserver.html");
  });

  test("distinguishes between fragment-only links and internal paths with fragments", () => {
    // Fragment only - must return unchanged
    const frag = formatMDXLink({ text: "Section", url: "#section" });
    expect(frag).toEqual({ text: "Section", url: "#section" });

    // Path with fragment - must add .html before fragment
    const pathWithFrag = formatMDXLink({
      text: "Section",
      url: "/docs#section",
    });
    expect(pathWithFrag.url).toBe("/docs.html#section");
  });

  test("fragment-only links start with hash character", () => {
    const link = { text: "Link", url: "#anchor" };
    const result = formatMDXLink(link);
    // Fragment-only links should not get .html extension
    expect(result.url).toBe("#anchor");
    expect(result.url).not.toContain(".html");
  });

  test("http protocol detection validates both cases: with and without slash", () => {
    // http:// with slashes
    const httpWithSlash = formatMDXLink({
      text: "Link",
      url: "http://example.com",
    });
    expect(httpWithSlash.url).toBe("http://example.com");

    // https:// with slashes
    const httpsWithSlash = formatMDXLink({
      text: "Link",
      url: "https://example.com",
    });
    expect(httpsWithSlash.url).toBe("https://example.com");
  });

  test("treats ftp:// as external protocol and leaves unchanged", () => {
    const link = { text: "File", url: "ftp://files.example.com/doc" };
    expect(formatMDXLink(link)).toEqual(link);
  });

  test("distinguishes protocol:// from non-protocol-looking paths", () => {
    // Real path without protocol marker
    const result = formatMDXLink({ text: "Page", url: "/https-docs/page" });
    expect(result.url).toBe("/https-docs/page.html");
  });

  test("recognizes http: (single colon) as protocol", () => {
    const result = formatMDXLink({ text: "Link", url: "http://example.com" });
    expect(result).toEqual({ text: "Link", url: "http://example.com" });
  });

  test("recognizes https: (single colon) as protocol", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "https://example.com",
    });
    expect(result).toEqual({ text: "Link", url: "https://example.com" });
  });

  test("leaves urls starting with mailto: unchanged", () => {
    const result = formatMDXLink({
      text: "Contact",
      url: "mailto:contact@example.com",
    });
    expect(result).toEqual({
      text: "Contact",
      url: "mailto:contact@example.com",
    });
  });

  test("leaves urls starting with tel: unchanged", () => {
    const result = formatMDXLink({ text: "Call", url: "tel:555-1234" });
    expect(result).toEqual({ text: "Call", url: "tel:555-1234" });
  });

  test("adds .html before query string", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "/page?foo=bar&baz=qux",
    });
    expect(result.url).toBe("/page.html?foo=bar&baz=qux");
  });

  test("adds .html before fragment", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "/section#heading",
    });
    expect(result.url).toBe("/section.html#heading");
  });

  test("preserves query string and fragment together", () => {
    const result = formatMDXLink({
      text: "Link",
      url: "/page?id=123#result",
    });
    expect(result.url).toBe("/page.html?id=123#result");
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

describe("formatMDXPermalink", () => {
  test("renders permalink with proper formatting", () => {
    expect(formatMDXPermalink("foo")).toBe("{#foo}");
  });
});

describe("formatMDXSpecifiedByLink", () => {
  test("renders plain text specification link", () => {
    expect(formatMDXSpecifiedByLink("https://spec.example")).toBe(
      "\n\nSpecified by: https://spec.example",
    );
  });

  test("percent-encodes an injected URL", () => {
    const result = formatMDXSpecifiedByLink(
      'https://example.com/spec"/>{globalThis.P=1}<img src=x onerror="alert(1)',
    );
    expect(result).toBe(
      "\n\nSpecified by: https://example.com/spec%22/%3E%7BglobalThis.P=1%7D%3Cimg%20src=x%20onerror=%22alert%281%29",
    );
    expect(result).not.toContain('"/>');
    expect(result).not.toContain("{");
    expect(result).not.toContain("<img");
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
