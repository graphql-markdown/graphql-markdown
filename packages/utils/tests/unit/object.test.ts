import { getObjPath, isEmpty } from "../../src/object";

describe("object", () => {
  describe("isEmpty()", () => {
    test("returns true if object has no property or method", () => {
      expect.hasAssertions();

      expect(isEmpty({})).toBeTruthy();
    });

    test("returns false if object has a method or property", () => {
      expect.hasAssertions();

      expect(isEmpty({ foo: "test" })).toBeFalsy();
    });
  });

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
});
