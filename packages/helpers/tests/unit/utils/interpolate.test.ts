import { getObjPath, interpolate } from "../../../src/utils/interpolate";

describe("interpolate", () => {
  describe("getObjPath()", () => {
    test("returns the nested property value based on string path", () => {
      expect.hasAssertions();

      expect(getObjPath("foo.bar", { foo: { bar: 42 } })).toBe(42);
    });

    test("returns fallback if path is invalid", () => {
      expect.hasAssertions();

      expect(getObjPath("foo.bak", { foo: { bar: 42 } }, "fallback")).toBe(
        "fallback",
      );
    });

    test("returns fallback if obj is not an object", () => {
      expect.hasAssertions();

      expect(getObjPath("foo.bak", undefined, "fallback")).toBe("fallback");
    });

    test("returns fallback if path is not a string", () => {
      expect.hasAssertions();

      expect(getObjPath(undefined, { foo: { bar: 42 } }, "fallback")).toBe(
        "fallback",
      );
    });
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
