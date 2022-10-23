const { hasProperty, hasMethod } = require("../../../src/scalars/object");

describe("utils", () => {
  describe("object", () => {
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
        expect(hasMethod({ foo: () => ({}) }, "foo")).toBeTruthy();
      });

      test("returns false if object has not method", () => {
        expect(hasMethod({ foo: "test" }, "foo")).toBeFalsy();
      });
    });
  });
});
