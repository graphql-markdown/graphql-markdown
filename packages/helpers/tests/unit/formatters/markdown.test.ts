import {
  appendExtensionToAbsolutePathWithoutExtension,
  appendLinkExtension,
  extractFrontmatterTitle,
  formatMarkdownFrontmatter,
  indentMarkdownLines,
  parseFrontmatterTitleLine,
  quoteMarkdownLines,
} from "../../../src/formatters/markdown";
describe("formatters markdown helpers", () => {
  describe("quoteMarkdownLines", () => {
    test("quotes each line", () => {
      expect(quoteMarkdownLines("one\ntwo")).toBe("> one\n> two");
    });
  });

  describe("parseFrontmatterTitleLine", () => {
    test("parses quoted title", () => {
      expect(parseFrontmatterTitleLine("title: 'My Title' ")).toBe("My Title");
    });

    test("parses unquoted title", () => {
      expect(parseFrontmatterTitleLine("title: Test Value")).toBe("Test Value");
    });

    test("returns empty string for non-title line", () => {
      expect(parseFrontmatterTitleLine("id: test")).toBe("");
    });
  });

  describe("formatMarkdownFrontmatter", () => {
    test("returns empty string when formatted is null", () => {
      expect(formatMarkdownFrontmatter(null)).toBe("");
    });

    test("wraps frontmatter lines", () => {
      expect(formatMarkdownFrontmatter(["title: Test"])).toBe(
        "---\ntitle: Test\n---",
      );
    });
  });

  describe("extractFrontmatterTitle", () => {
    test("extracts title from formatted frontmatter lines", () => {
      expect(extractFrontmatterTitle(["id: book", "title: 'My Title'"])).toBe(
        "My Title",
      );
    });

    test("returns empty string when title line is missing", () => {
      expect(extractFrontmatterTitle(["id: book"])).toBe("");
    });
  });

  describe("appendLinkExtension", () => {
    test("appends extension", () => {
      expect(appendLinkExtension("/path/doc", ".mdx")).toBe("/path/doc.mdx");
    });
  });

  describe("appendExtensionToAbsolutePathWithoutExtension", () => {
    test("appends extension for extensionless absolute path", () => {
      expect(
        appendExtensionToAbsolutePathWithoutExtension("/path/doc", ".md"),
      ).toBe("/path/doc.md");
    });

    test("keeps link unchanged when extension already exists", () => {
      expect(
        appendExtensionToAbsolutePathWithoutExtension("/path/doc.md", ".md"),
      ).toBe("/path/doc.md");
    });
  });

  describe("indentMarkdownLines", () => {
    test("indents non-empty lines and preserves empty lines", () => {
      expect(indentMarkdownLines("a\n\nb", 2)).toBe("  a\n\n  b");
    });
  });
});
