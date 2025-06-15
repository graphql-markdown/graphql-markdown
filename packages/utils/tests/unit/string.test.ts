import {
  capitalize,
  escapeMDX,
  prune,
  replaceDiacritics,
  stringCaseBuilder,
  slugify,
  startCase,
  kebabCase,
  firstUppercase,
} from "../../src/string";

describe("string", () => {
  describe("stringCaseBuilder()", () => {
    test("applies no transformation if one is not given", () => {
      expect.hasAssertions();

      const text = "this is Not Transformed to lowercase 42 times.";
      const expected = "this is Not Transformed to lowercase 42 times.";

      expect(stringCaseBuilder(text, undefined)).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect(stringCaseBuilder(undefined, undefined)).toBe("");
    });

    test("returns a string with a transformation applied for each word using custom char for splitting", () => {
      const text = "The quick brown fox/jumps over the lazy dog.";
      const expected =
        "*The* *quick* *brown* *fox/jumps* *over* *the* *lazy* *dog.*";
      const transformation = (word: string): string => {
        return `*${word}*`;
      };

      expect(stringCaseBuilder(text, transformation, " ", " ")).toBe(expected);
    });

    test("returns a string with a transformation applied for each word using custom default splitting", () => {
      const text = "The quick brown fox/jumps over the lazy dog.";
      const expected =
        "*The* *quick* *brown* *fox* *jumps* *over* *the* *lazy* *dog*";
      const transformation = (word: string): string => {
        return `*${word}*`;
      };

      const value = stringCaseBuilder(text, transformation, " ");

      expect(value).toBe(expected);
    });
  });

  describe("replaceDiacritics()", () => {
    test("returns string without diacritic characters", () => {
      expect.hasAssertions();

      const text = "Âéêś";
      const expected = "Aees";

      expect(replaceDiacritics(text)).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(replaceDiacritics(undefined)).toBe("");
    });
  });

  describe("prune()", () => {
    test.each([
      {
        text: "-string-that-begins-and-ends-with-dash-",
        expected: "string-that-begins-and-ends-with-dash",
      },
      {
        text: "-string-that-begins-with-dash",
        expected: "string-that-begins-with-dash",
      },
      {
        text: "string-that-ends-with-dash-",
        expected: "string-that-ends-with-dash",
      },
      {
        text: "string-with-no-dashes-in-beginning-or-end",
        expected: "string-with-no-dashes-in-beginning-or-end",
      },
    ])("removes dash from beginning and/or end", ({ text, expected }) => {
      expect.hasAssertions();

      expect(prune(text, "-")).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(prune(undefined)).toBe("");
    });

    test("returns unchanged string if substr is an empty string", () => {
      expect.hasAssertions();

      expect(prune("A string.")).toBe("A string.");
    });

    test("removes multiple characters", () => {
      expect.hasAssertions();

      expect(
        prune("**The quick brown fox jumps over the lazy dog.**", "**"),
      ).toBe("The quick brown fox jumps over the lazy dog.");
    });
  });

  describe("slugify()", () => {
    test("returns kebab style slug", () => {
      expect.hasAssertions();

      const text = "This is not a slug, but you can use to slug function.";
      const expected = "this-is-not-a-slug-but-you-can-use-to-slug-function";

      expect(slugify(text)).toBe(expected);
    });

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(slugify(undefined)).toBe("");
    });
  });

  describe("escapeMDX()", () => {
    test("returns string with HTML &#x0000; format for MDX special characters", () => {
      expect.hasAssertions();

      expect(
        escapeMDX("{MDX} <special> characters and formatting _test_"),
      ).toBe(
        "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters and formatting &#x005F;test&#x005F;",
      );
    });

    test("does not transform MDX special characters enclosed as code", () => {
      expect.hasAssertions();

      expect(escapeMDX(">`{MDX}` `<special>` characters `_test_`")).toBe(
        "&#x003E;`{MDX}` `<special>` characters `_test_`",
      );
    });

    test.each([
      [5, "5"],
      [{ five: 5 }, "[object Object]"],
    ])("returns a stringified version if not a string", (value, expected) => {
      expect.hasAssertions();

      expect(escapeMDX(value)).toBe(expected);
    });
  });

  describe("capitalize()", () => {
    test.each([
      ["A", "A"],
      ["foobar", "Foobar"],
      [
        "the quick brown fox jumps over the lazy dog",
        "The quick brown fox jumps over the lazy dog",
      ],
      ["42 dollars", "42 dollars"],
      ["fooBar", "Foobar"],
    ])(
      "returns capitalized string: first letter uppercase, rest lowercase - %#",
      (input, expected) => {
        expect.hasAssertions();

        expect(capitalize(input)).toBe(expected);
      },
    );

    test("returns empty string if param not a string", () => {
      expect.hasAssertions();

      expect(capitalize(undefined)).toBe("");
    });
  });

  describe("startCase()", () => {
    test("returns startCase version", () => {
      expect.hasAssertions();

      expect(startCase("the quick Brown Fox")).toBe("The Quick Brown Fox");
    });
  });

  describe("kebabCase()", () => {
    test("returns a kebabCase version", () => {
      expect.hasAssertions();

      expect(kebabCase("the quick Brown Fox")).toBe("the-quick-brown-fox");
    });
  });

  describe("firstUppercase()", () => {
    test("returns empty string if not a string", () => {
      expect.hasAssertions();

      expect(firstUppercase(null)).toBe("");
    });

    test("returns a firstUppercase version", () => {
      expect.hasAssertions();

      expect(firstUppercase("the quick Brown Fox")).toBe("The quick Brown Fox");
    });
  });
});
