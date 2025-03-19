// packages/utils/tests/unit/object.test.ts
import { isEmpty } from "../../src/object";

describe("object", () => {
  describe("isEmpty()", () => {
    test("returns true if object has no property or method", () => {
      expect.assertions(1);

      expect(isEmpty({})).toBeTruthy();
    });

    test("returns false if object has a method or property", () => {
      expect.assertions(1);

      expect(isEmpty({ foo: "test" })).toBeFalsy();
    });

    test("returns true for null values", () => {
      expect.assertions(1);

      expect(isEmpty(null)).toBeTruthy();
    });

    test("returns true for undefined values", () => {
      expect.assertions(1);

      expect(isEmpty(undefined)).toBeTruthy();
    });

    test("returns true for non-object values", () => {
      expect.assertions(3);

      expect(isEmpty("string")).toBeTruthy();
      expect(isEmpty(123)).toBeTruthy();
      expect(isEmpty(true)).toBeTruthy();
    });

    test("returns false for objects with nested properties", () => {
      expect.assertions(1);

      const obj = {
        nested: {
          property: "value",
        },
      };

      expect(isEmpty(obj)).toBeFalsy();
    });

    test("returns false for arrays with elements", () => {
      expect.assertions(1);

      expect(isEmpty([1, 2, 3])).toBeFalsy();
    });

    test("returns true for empty arrays", () => {
      expect.assertions(1);

      // This is a bit tricky since arrays are objects, but empty arrays have length 0
      // The implementation should consider this case
      expect(isEmpty([])).toBeTruthy();
    });
  });
});
