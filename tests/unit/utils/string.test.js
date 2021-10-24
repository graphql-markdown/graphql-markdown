const { toSlug, escapeMDX } = require("../../../src/utils/string");

describe("utils", () => {
  describe("string", () => {
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
    });
  });
});
