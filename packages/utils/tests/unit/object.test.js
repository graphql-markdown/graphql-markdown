const { hasProperty, hasMethod } = require("../../src/object");

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

    test("returns false if object has not method", () => {
      expect.hasAssertions();

      expect(hasMethod({ foo: "test" }, "foo")).toBeFalsy();
    });
  });
});
