import { describe, expect, test } from "vitest";

import {
  normalizeMarkdownWhitespace,
  trimBlankLines,
} from "../../src/markdown";

describe("markdown whitespace helpers", () => {
  describe("trimBlankLines", () => {
    test("removes leading and trailing blank lines only", () => {
      expect(trimBlankLines("\n \n  code\n\ntext\n\t\n")).toBe(
        "  code\n\ntext",
      );
    });

    test("returns empty string for blank input", () => {
      expect(trimBlankLines("\n\n  \n")).toBe("");
    });
  });

  describe("normalizeMarkdownWhitespace", () => {
    test("collapses blank line runs", () => {
      expect(normalizeMarkdownWhitespace("a\n\n\n\nb\n \n\nc")).toBe(
        "a\n\nb\n\nc",
      );
    });

    test("strips a single trailing space but keeps hard line breaks", () => {
      expect(normalizeMarkdownWhitespace("# T \nline  \n> ")).toBe(
        "# T\nline  \n>",
      );
    });

    test("leaves fenced code blocks untouched", () => {
      const code = "```graphql\ntype A {\n\n\n  a: Int \n}\n```";
      expect(normalizeMarkdownWhitespace(`x\n\n\n${code}\n\n\ny`)).toBe(
        `x\n\n${code}\n\ny`,
      );
    });

    test("handles tilde fences and longer closing fences", () => {
      const code = "~~~\na\n\n\nb \n~~~~";
      expect(normalizeMarkdownWhitespace(`${code}\n\n\nz`)).toBe(
        `${code}\n\nz`,
      );
    });
  });
});
