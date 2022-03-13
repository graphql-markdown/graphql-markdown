const {
  toSlug,
  escapeMDX,
  stringCaseBuilder,
  prune,
} = require("../../../../src/utils/scalars/string");

describe("utils", () => {
  describe("string", () => {
    describe("stringCaseBuilder()", () => {
      test("applies no transformation if one is not given", () => {
        const text = "This is Not Transformed to lowercase.";
        const expected = "This is Not Transformed to lowercase";
        expect(stringCaseBuilder(text, undefined, " ")).toBe(expected);
      });
    });

    describe("prune()", () => {
      test("Removes dash from beginning and/or end", () => {
        let text = "-string-that-begins-and-ends-with-dash-";
        let expected = "string-that-begins-and-ends-with-dash";
        expect(prune(text, "-")).toBe(expected);

        text = "-string-that-begins-with-dash";
        expected = "string-that-begins-with-dash";
        expect(prune(text, "-")).toBe(expected);

        text = "string-that-ends-with-dash-";
        expected = "string-that-ends-with-dash";
        expect(prune(text, "-")).toBe(expected);

        text = "string-with-no-dashes-in-beginning-or-end";
        expected = "string-with-no-dashes-in-beginning-or-end";
        expect(prune(text, "-")).toBe(expected);
      });
    });

    describe("toSlug()", () => {
      test("returns kebab style slug", () => {
        const text = "This is not a slug, but you can use toSlug() function.";
        const expected = "this-is-not-a-slug-but-you-can-use-to-slug-function";
        expect(toSlug(text)).toBe(expected);
      });
    });

    describe("escapeMDX()", () => {
      test("returns string with HTML &#x0000; format for MDX special characters", () => {
        expect(escapeMDX("{MDX} <special> characters")).toBe(
          "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters",
        );
      });

      test("leaves input the same if it's not a string", () => {
        expect(escapeMDX(5)).toBe(5);
        expect(escapeMDX({ five: 5 })).toEqual({ five: 5 });
      });
    });
  });
});
