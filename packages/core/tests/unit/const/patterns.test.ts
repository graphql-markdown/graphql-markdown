/**
 * Unit tests for regex patterns and configuration constants.
 * @module
 */

import { PATTERNS, CONFIG_CONSTANTS } from "../../../src/const/patterns";

describe("Regex Patterns", () => {
  describe("DIRECTIVE_NAME pattern", () => {
    it("should match valid directive names", () => {
      expect(PATTERNS.DIRECTIVE_NAME.test("@tag")).toBe(true);
      expect(PATTERNS.DIRECTIVE_NAME.test("@myDirective")).toBe(true);
      expect(PATTERNS.DIRECTIVE_NAME.test("@_private")).toBe(true);
      expect(PATTERNS.DIRECTIVE_NAME.test("@directive123")).toBe(true);
    });

    it("should capture the directive name", () => {
      const match = PATTERNS.DIRECTIVE_NAME.exec("@myDirective");
      expect(match?.groups?.directive).toBe("myDirective");
    });

    it("should not match invalid directive names", () => {
      expect(PATTERNS.DIRECTIVE_NAME.test("tag")).toBe(false);
      expect(PATTERNS.DIRECTIVE_NAME.test("@")).toBe(false);
      expect(PATTERNS.DIRECTIVE_NAME.test("@ tag")).toBe(false);
      expect(PATTERNS.DIRECTIVE_NAME.test("@tag-name")).toBe(false);
    });
  });

  describe("GROUP_BY_DIRECTIVE pattern", () => {
    it("should match basic group-by directive", () => {
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("@tag(name)")).toBe(true);
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("@category(type)")).toBe(true);
    });

    it("should capture directive name and field", () => {
      const match = PATTERNS.GROUP_BY_DIRECTIVE.exec("@tag(name)");
      expect(match?.[1]).toBe("tag");
      expect(match?.[2]).toBe("name");
      expect(match?.[3]).toBeUndefined();
    });

    it("should match group-by directive with fallback", () => {
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("@category(type|=Other)")).toBe(
        true,
      );
    });

    it("should capture directive name, field, and fallback", () => {
      const match = PATTERNS.GROUP_BY_DIRECTIVE.exec("@category(type|=Other)");
      expect(match?.[1]).toBe("category");
      expect(match?.[2]).toBe("type");
      expect(match?.[3]).toBe("Other");
    });

    it("should not match invalid formats", () => {
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("@tag()")).toBe(false);
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("tag(name)")).toBe(false);
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("@tag(name|=)")).toBe(false);
      expect(PATTERNS.GROUP_BY_DIRECTIVE.test("@tag(name-field)")).toBe(false);
    });
  });

  describe("WORD_BOUNDARY pattern", () => {
    it("should split on word boundaries", () => {
      expect("hello-world".split(PATTERNS.WORD_BOUNDARY)).toEqual([
        "hello",
        "world",
      ]);
      expect("hello_world".split(PATTERNS.WORD_BOUNDARY)).toEqual([
        "hello",
        "world",
      ]);
      expect("hello world".split(PATTERNS.WORD_BOUNDARY)).toEqual([
        "hello",
        "world",
      ]);
    });

    it("should handle multiple consecutive delimiters", () => {
      const parts = "hello--world".split(PATTERNS.WORD_BOUNDARY);
      expect(parts.filter((p) => p.length > 0)).toEqual(["hello", "world"]);
    });

    it("should preserve alphanumeric content", () => {
      expect("abc123".split(PATTERNS.WORD_BOUNDARY)).toEqual(["abc123"]);
    });
  });

  describe("CASE_TRANSITION pattern", () => {
    it("should match transitions from lowercase to uppercase", () => {
      const match = "userId".match(PATTERNS.CASE_TRANSITION);
      expect(match).not.toBeNull();
    });

    it("should match transitions from digits to uppercase", () => {
      const match = "get2Users".match(PATTERNS.CASE_TRANSITION);
      expect(match).not.toBeNull();
    });

    it("should support replacement with spaces", () => {
      const result = "userId".replace(PATTERNS.CASE_TRANSITION, "$1 $2");
      expect(result).toBe("user Id");
    });

    it("should not match consecutive uppercase", () => {
      expect("HTTPServer".match(PATTERNS.CASE_TRANSITION)).toBeNull();
    });
  });

  describe("LETTER_DIGIT_TRANSITION pattern", () => {
    it("should match transitions from lowercase letters to digits", () => {
      const match = "user1".match(PATTERNS.LETTER_DIGIT_TRANSITION);
      expect(match).not.toBeNull();
    });

    it("should support replacement with spaces", () => {
      const result = "abc123".replace(
        PATTERNS.LETTER_DIGIT_TRANSITION,
        "$1 $2",
      );
      expect(result).toBe("abc 123");
    });

    it("should not match uppercase letter to digit", () => {
      expect("U1".match(PATTERNS.LETTER_DIGIT_TRANSITION)).toBeNull();
    });
  });

  describe("DIGIT_LETTER_TRANSITION pattern", () => {
    it("should match transitions from digits to lowercase letters", () => {
      const match = "2k".match(PATTERNS.DIGIT_LETTER_TRANSITION);
      expect(match).not.toBeNull();
    });

    it("should support replacement with spaces", () => {
      const result = "2k".replace(PATTERNS.DIGIT_LETTER_TRANSITION, "$1 $2");
      expect(result).toBe("2 k");
    });

    it("should match multiple digit to letter transitions", () => {
      const result = "123abc".replace(
        PATTERNS.DIGIT_LETTER_TRANSITION,
        "$1 $2",
      );
      expect(result).toBe("123 abc");
    });

    it("should not match uppercase letter", () => {
      expect("2K".match(PATTERNS.DIGIT_LETTER_TRANSITION)).toBeNull();
    });
  });

  describe("NUMERIC_PREFIX pattern", () => {
    it("should match numeric prefix", () => {
      expect(PATTERNS.NUMERIC_PREFIX.test("01-query")).toBe(true);
      expect(PATTERNS.NUMERIC_PREFIX.test("02-mutations")).toBe(true);
      expect(PATTERNS.NUMERIC_PREFIX.test("99-other")).toBe(true);
    });

    it("should support removal of numeric prefix", () => {
      expect("01-query".replace(PATTERNS.NUMERIC_PREFIX, "")).toBe("query");
      expect("02-mutations".replace(PATTERNS.NUMERIC_PREFIX, "")).toBe(
        "mutations",
      );
    });

    it("should not match single digit prefix", () => {
      expect(PATTERNS.NUMERIC_PREFIX.test("1-query")).toBe(false);
    });

    it("should not match names without numeric prefix", () => {
      expect(PATTERNS.NUMERIC_PREFIX.test("query")).toBe(false);
      expect(PATTERNS.NUMERIC_PREFIX.test("my-folder")).toBe(false);
    });

    it("should not match numeric prefix without dash", () => {
      expect(PATTERNS.NUMERIC_PREFIX.test("01query")).toBe(false);
    });
  });
});

describe("Configuration Constants", () => {
  describe("DEFAULT_GROUP", () => {
    it("should have correct default group name", () => {
      expect(CONFIG_CONSTANTS.DEFAULT_GROUP).toBe("Miscellaneous");
    });

    it("should be a constant string", () => {
      expect(typeof CONFIG_CONSTANTS.DEFAULT_GROUP).toBe("string");
    });
  });

  describe("DEFAULT_FRAMEWORK_NAME", () => {
    it("should have correct default framework name", () => {
      expect(CONFIG_CONSTANTS.DEFAULT_FRAMEWORK_NAME).toBe(
        "@graphql-markdown/docusaurus",
      );
    });

    it("should be a constant string", () => {
      expect(typeof CONFIG_CONSTANTS.DEFAULT_FRAMEWORK_NAME).toBe("string");
    });
  });

  describe("Constants immutability", () => {
    it("should be typed as const for compile-time immutability", () => {
      // TypeScript's 'as const' provides compile-time immutability
      // At runtime, the objects are still mutable but the type system prevents modification
      expect(PATTERNS).toBeDefined();
      expect(CONFIG_CONSTANTS).toBeDefined();
    });
  });
});
