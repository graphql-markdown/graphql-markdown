import {
  appendExtensionToAbsolutePathWithoutExtension,
  appendLinkExtension,
  extractFrontmatterTitle,
  formatMarkdownFrontmatter,
  indentMarkdownLines,
  mergeFrontmatterLines,
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

    test("parses double-quoted title", () => {
      expect(parseFrontmatterTitleLine('title: "Double Quoted"')).toBe(
        "Double Quoted",
      );
    });

    test("returns empty string for non-title line", () => {
      expect(parseFrontmatterTitleLine("id: test")).toBe("");
    });

    test("handles title with leading/trailing whitespace", () => {
      expect(parseFrontmatterTitleLine("  title:   My Title   ")).toBe(
        "My Title",
      );
    });

    test("returns empty string when value is only quotes", () => {
      expect(parseFrontmatterTitleLine("title: ''")).toBe("");
    });

    test("returns empty string when no value after colon", () => {
      expect(parseFrontmatterTitleLine("title:")).toBe("");
    });

    test("returns unquoted value when quotes are mismatched", () => {
      expect(parseFrontmatterTitleLine("title: 'mismatched\"")).toBe(
        "'mismatched\"",
      );
    });

    test("handles quoted empty string", () => {
      expect(parseFrontmatterTitleLine('title: ""')).toBe("");
    });

    test("handles single-quoted empty string", () => {
      expect(parseFrontmatterTitleLine("title: ''")).toBe("");
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

  describe("mergeFrontmatterLines", () => {
    test("merges props into frontmatter lines", () => {
      expect(
        mergeFrontmatterLines({ title: "My Type", id: "book" }, null),
      ).toEqual(["title: My Type", "id: book"]);
    });

    test("formatted lines override props when keys overlap", () => {
      expect(
        mergeFrontmatterLines({ title: "Old Title", id: "book" }, [
          "title: New Title",
        ]),
      ).toEqual(["title: New Title", "id: book"]);
    });

    test("ignores comments and invalid lines", () => {
      expect(
        mergeFrontmatterLines({ title: "Old Title" }, [
          "# comment",
          "invalid",
          "title: New Title",
        ]),
      ).toEqual(["title: New Title"]);
    });

    test("ignores empty and whitespace-only lines", () => {
      expect(
        mergeFrontmatterLines({ title: "Test" }, ["", "   ", "title: Updated"]),
      ).toEqual(["title: Updated"]);
    });

    test("ignores lines without colon separator", () => {
      expect(
        mergeFrontmatterLines({ title: "Test" }, ["invalid-no-colon"]),
      ).toEqual(["title: Test"]);
    });

    test("ignores lines with empty key", () => {
      expect(mergeFrontmatterLines({ title: "Test" }, [": value"])).toEqual([
        "title: Test",
      ]);
    });

    test("ignores keys that contain # comment marker", () => {
      expect(
        mergeFrontmatterLines({ title: "Test" }, ["key#comment: value"]),
      ).toEqual(["title: Test"]);
    });

    test("handles multiple entries with same key (last wins)", () => {
      expect(
        mergeFrontmatterLines({ title: "Props Title" }, [
          "title: First",
          "title: Second",
        ]),
      ).toEqual(["title: Second"]);
    });

    test("returns empty array when both props and formatted are empty", () => {
      expect(mergeFrontmatterLines({}, [])).toEqual([]);
    });

    test("handles null props", () => {
      expect(mergeFrontmatterLines(null, ["title: Test", "id: 1"])).toEqual([
        "title: Test",
        "id: 1",
      ]);
    });

    test("trims whitespace from keys and values", () => {
      expect(mergeFrontmatterLines(null, ["  key  :  value  "])).toEqual([
        "key: value",
      ]);
    });

    test("preserves order of first appearance", () => {
      const result = mergeFrontmatterLines(
        { author: "Anonymous", title: "Book" },
        ["description: A test"],
      );
      expect(result).toContain("author: Anonymous");
      expect(result).toContain("title: Book");
      expect(result).toContain("description: A test");
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

    test("keeps relative paths unchanged", () => {
      expect(appendExtensionToAbsolutePathWithoutExtension("doc", ".md")).toBe(
        "doc",
      );
    });

    test("keeps paths with multi-char extensions unchanged", () => {
      expect(
        appendExtensionToAbsolutePathWithoutExtension("/path/file.html", ".md"),
      ).toBe("/path/file.html");
    });

    test("keeps paths with fragments unchanged", () => {
      expect(
        appendExtensionToAbsolutePathWithoutExtension(
          "/path/file.md#section",
          ".html",
        ),
      ).toBe("/path/file.md#section");
    });

    test("handles various extension lengths", () => {
      expect(
        appendExtensionToAbsolutePathWithoutExtension(
          "/path/file.abcde",
          ".md",
        ),
      ).toBe("/path/file.abcde");
    });

    test("handles paths with multiple dots", () => {
      expect(
        appendExtensionToAbsolutePathWithoutExtension(
          "/path/file.backup.old",
          ".md",
        ),
      ).toBe("/path/file.backup.old");
    });
  });

  describe("indentMarkdownLines", () => {
    test("indents non-empty lines and preserves empty lines", () => {
      expect(indentMarkdownLines("a\n\nb", 2)).toBe("  a\n\n  b");
    });
  });
});
