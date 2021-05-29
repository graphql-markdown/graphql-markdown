const { toSlug, toArray, hasProperty, hasMethod } = require("@/lib/utils");

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
        expect(hasProperty({ foo: "test" }, "foo")).toBeTruthy();
      });

      test("returns false if object has not property", () => {
        expect(hasProperty({ foo: "test" }, "bar")).toBeFalsy();
      });

      test("returns false if not an object", () => {
        expect(hasProperty("test", "bar")).toBeFalsy();
      });

      test("returns false if null", () => {
        expect(hasProperty(null, "bar")).toBeFalsy();
      });
    });

    describe("hasMethod()", () => {
      test("returns true if object has method", () => {
        expect(hasMethod({ foo: () => {} }, "foo")).toBeTruthy();
      });

      test("returns false if object has not method", () => {
        expect(hasMethod({ foo: "test" }, "foo")).toBeFalsy();
      });
    });

    describe("toArray()", () => {
      test("returns an array of values from a k/v object", () => {
        const input = {
          bool: true,
          string: "test",
          number: 123,
          array: ["one", "two"],
          child: { key: "value" },
        };
        const expected = [true, "test", 123, ["one", "two"], { key: "value" }];
        expect(toArray(input)).toEqual(expect.arrayContaining(expected));
      });

      test("returns undefined if not an object", () => {
        expect(toArray("test")).toBeUndefined();
      });
    });
  });
});
