import {
  toSlug,
  hasOwnProperty,
  hasOwnMethod,
} from "../../../src/lib/utils";

describe("lib", () => {
  describe("utils", () => {
    describe("toSlug()", () => {
      test("returns kebab style slug", () => {
        const text = "This is not a slug, but you can use toSlug() function.";
        const expected = "this-is-not-a-slug-but-you-can-use-to-slug-function";
        expect(toSlug(text)).toBe(expected);
      });
    });

    describe("hasProperty()", () => {
      test("returns true if object has property", () => {
        expect(hasOwnProperty({ foo: "test" }, "foo")).toBeTruthy();
      });

      test("returns false if object has not property", () => {
        expect(hasOwnProperty({ foo: "test" }, "bar")).toBeFalsy();
      });
    });

    describe("hasOwnMethod()", () => {
      test("returns true if object has method", () => {
        expect(
          hasOwnMethod(
            {
              foo: () => {
                return {};
              },
            },
            "foo",
          ),
        ).toBeTruthy();
      });

      test("returns false if object has not method", () => {
        expect(hasOwnMethod({ foo: "test" }, "foo")).toBeFalsy();
      });
    });
  });
});
