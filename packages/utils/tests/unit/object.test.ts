import { isEmpty } from "../../src/object";

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
});
