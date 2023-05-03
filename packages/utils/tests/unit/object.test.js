const { hasProperty, hasMethod, isEmpty } = require("../../src/object");

describe("object", () => {
  describe("hasProperty()", () => {
    test("returns true if object has property", () => {
      expect.hasAssertions();

      expect(hasProperty({ foo: "test" }, "foo")).toBeTruthy();
    });

    test("returns false if object has not property", () => {
      expect.hasAssertions();

      expect(hasProperty({ foo: "test" }, "bar")).toBeFalsy();
    });

    test("returns false if not an object", () => {
      expect.hasAssertions();

      expect(hasProperty("test", "bar")).toBeFalsy();
    });

    test("returns false if null", () => {
      expect.hasAssertions();

      expect(hasProperty(null, "bar")).toBeFalsy();
    });
  });

  describe("hasMethod()", () => {
    test("returns true if object has method", () => {
      expect.hasAssertions();

      expect(hasMethod({ foo: () => ({}) }, "foo")).toBeTruthy();
    });

    test("returns false if object has no method", () => {
      expect.hasAssertions();

      expect(hasMethod({ foo: "test" }, "foo")).toBeFalsy();
    });
  });

  describe("isEmpty()", () => {
    test("returns true if object has no property or method", () => {
      expect.hasAssertions();

      expect(isEmpty({})).toBeTruthy();
    });

    test("returns false if object has a method or property", () => {
      expect.hasAssertions();

      expect(isEmpty({ foo: "test" })).toBeFalsy();
    });

    test("returns true if not an object", () => {
      expect.hasAssertions();

      expect(isEmpty(42)).toBeTruthy();
    });
  });
});
