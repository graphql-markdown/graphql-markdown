import {
  capitalize,
  escapeMDX,
  interpolate,
  prune,
  replaceDiacritics,
  stringCaseBuilder,
  toSlug,
} from "../../src/string";

describe("string", () => {
  describe("stringCaseBuilder()", () => {
    test("applies no transformation if one is not given", () => {
      expect.hasAssertions();

      const text = "This is Not Transformed to lowercase.";
      const expected = "This is Not Transformed to lowercase";

      expect(stringCaseBuilder(text, undefined, " ")).toBe(expected);
    });
  });

  describe("replaceDiacritics()", () => {
    test("returns string without diacritic characters", () => {
      expect.hasAssertions();

      const text = "Âéêś";
      const expected = "Aees";

      expect(replaceDiacritics(text)).toBe(expected);
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
    ])("Removes dash from beginning and/or end", ({ text, expected }) => {
      expect.hasAssertions();

      expect(prune(text, "-")).toBe(expected);
    });
  });

  describe("toSlug()", () => {
    test("returns kebab style slug", () => {
      expect.hasAssertions();

      const text = "This is not a slug, but you can use toSlug() function.";
      const expected = "this-is-not-a-slug-but-you-can-use-to-slug-function";

      expect(toSlug(text)).toBe(expected);
    });
  });

  describe("escapeMDX()", () => {
    test("returns string with HTML &#x0000; format for MDX special characters", () => {
      expect.hasAssertions();

      expect(escapeMDX("{MDX} <special> characters")).toBe(
        "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters",
      );
    });

    test("return a stringified version if not a string", () => {
      expect.hasAssertions();

      expect(escapeMDX(5)).toBe("5");
      expect(escapeMDX({ five: 5 })).toBe("[object Object]");
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
      "returns capitalized string: first letter uppercase, rest lowercase",
      (input, expected) => {
        expect.hasAssertions();

        expect(capitalize(input)).toBe(expected);
      },
    );
  });

  describe("interpolate()", () => {
    test("returns an interpolated string with replaced values", () => {
      expect.hasAssertions();

      const values = { foo: 42, bar: { value: "test" } };
      const template = "${foo} is not ${bar.value}";

      expect(interpolate(template, values)).toBe("42 is not test");
    });

    test("returns an interpolated string with fallback values when not found", () => {
      expect.hasAssertions();

      const values = { foo: 42, bar: { value: "test" } };
      const template = "${foo} is not ${bar.notfound}";

      expect(interpolate(template, values, "fallback")).toBe(
        "42 is not fallback",
      );
    });
  });
});
