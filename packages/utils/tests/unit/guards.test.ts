/**
 * Unit tests for type guard utilities.
 * @module
 */

import {
  isTypeObject,
  hasProperty,
  hasProperties,
  hasArrayProperty,
  hasNonEmptyArrayProperty,
  hasStringProperty,
  hasFunctionProperty,
  isNonEmptyArray,
} from "../../src/guards";

describe("Type Guard Utilities", () => {
  describe("isTypeObject", () => {
    it("should return true for plain objects", () => {
      expect(isTypeObject({})).toBe(true);
      expect(isTypeObject({ key: "value" })).toBe(true);
      expect(isTypeObject([])).toBe(true);
      expect(isTypeObject(new Date())).toBe(true);
      expect(isTypeObject(new Map())).toBe(true);
    });

    it("should return false for non-objects", () => {
      expect(isTypeObject(null)).toBe(false);
      expect(isTypeObject(undefined)).toBe(false);
      expect(isTypeObject(42)).toBe(false);
      expect(isTypeObject("string")).toBe(false);
      expect(isTypeObject(true)).toBe(false);
    });

    it("should narrow type correctly", () => {
      const value: unknown = { name: "test" };
      if (isTypeObject(value)) {
        expect(Object.keys(value)).toBeDefined();
      }
    });
  });

  describe("hasProperty", () => {
    it("should return true when property exists", () => {
      const obj = { name: "test", value: 42 };
      expect(hasProperty(obj, "name")).toBe(true);
      expect(hasProperty(obj, "value")).toBe(true);
    });

    it("should return false when property does not exist", () => {
      const obj = { name: "test" };
      expect(hasProperty(obj, "nonexistent")).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(hasProperty(null, "prop")).toBe(false);
      expect(hasProperty(undefined, "prop")).toBe(false);
      expect(hasProperty(42, "prop")).toBe(false);
      expect(hasProperty("string", "prop")).toBe(false);
    });

    it("should handle properties with falsy values", () => {
      const obj = { empty: "", zero: 0, false: false };
      expect(hasProperty(obj, "empty")).toBe(true);
      expect(hasProperty(obj, "zero")).toBe(true);
      expect(hasProperty(obj, "false")).toBe(true);
    });

    it("should narrow type correctly", () => {
      const obj: unknown = { name: "test" };
      if (hasProperty(obj, "name")) {
        // Type is narrowed to Record<"name", unknown>, but the actual value is a string
        expect(obj.name).toBe("test");
      }
    });
  });

  describe("hasProperties", () => {
    it("should return true when all properties exist", () => {
      const obj = { name: "test", description: "desc", id: 1 };
      expect(hasProperties(obj, "name", "description")).toBe(true);
      expect(hasProperties(obj, "name", "description", "id")).toBe(true);
    });

    it("should return false when any property is missing", () => {
      const obj = { name: "test", description: "desc" };
      expect(hasProperties(obj, "name", "missing")).toBe(false);
      expect(hasProperties(obj, "name", "description", "missing")).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(hasProperties(null, "prop1", "prop2")).toBe(false);
      expect(hasProperties(undefined, "prop1")).toBe(false);
    });

    it("should return true when checking against empty key list", () => {
      // This behavior tests the variadic nature of hasProperties
      const obj = { name: "test" };
      // When no keys are provided, the every() call on an empty array returns true
      const result = hasProperties(obj);
      expect(result).toBe(true);
    });
  });

  describe("hasArrayProperty", () => {
    it("should return true when property is an array", () => {
      const obj = { items: [1, 2, 3] };
      expect(hasArrayProperty(obj, "items")).toBe(true);
    });

    it("should return true for empty arrays", () => {
      const obj = { items: [] };
      expect(hasArrayProperty(obj, "items")).toBe(true);
    });

    it("should return false when property is not an array", () => {
      const obj = { items: "not an array", count: 42, active: true };
      expect(hasArrayProperty(obj, "items")).toBe(false);
      expect(hasArrayProperty(obj, "count")).toBe(false);
      expect(hasArrayProperty(obj, "active")).toBe(false);
    });

    it("should return false when property does not exist", () => {
      const obj = { items: [1, 2] };
      expect(hasArrayProperty(obj, "missing")).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(hasArrayProperty(null, "prop")).toBe(false);
      expect(hasArrayProperty(undefined, "prop")).toBe(false);
      expect(hasArrayProperty("string", "prop")).toBe(false);
    });

    it("should narrow type to array", () => {
      const obj: unknown = { items: [1, 2, 3] };
      if (hasArrayProperty(obj, "items")) {
        expect(Array.isArray(obj.items)).toBe(true);
      }
    });
  });

  describe("hasNonEmptyArrayProperty", () => {
    it("should return true for non-empty arrays", () => {
      const obj = { items: [1, 2, 3], tags: ["a"] };
      expect(hasNonEmptyArrayProperty(obj, "items")).toBe(true);
      expect(hasNonEmptyArrayProperty(obj, "tags")).toBe(true);
    });

    it("should return false for empty arrays", () => {
      const obj = { items: [] };
      expect(hasNonEmptyArrayProperty(obj, "items")).toBe(false);
    });

    it("should return false when property is not an array", () => {
      const obj = { items: "not an array", count: 42 };
      expect(hasNonEmptyArrayProperty(obj, "items")).toBe(false);
      expect(hasNonEmptyArrayProperty(obj, "count")).toBe(false);
    });

    it("should return false when property does not exist", () => {
      const obj = { items: [1, 2] };
      expect(hasNonEmptyArrayProperty(obj, "missing")).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(hasNonEmptyArrayProperty(null, "prop")).toBe(false);
      expect(hasNonEmptyArrayProperty(undefined, "prop")).toBe(false);
    });

    it("should narrow type to non-empty array", () => {
      const obj: unknown = { items: [1, 2, 3] };
      if (hasNonEmptyArrayProperty(obj, "items")) {
        expect(obj.items.length).toBeGreaterThan(0);
      }
    });
  });

  describe("hasStringProperty", () => {
    it("should return true for string properties", () => {
      const obj = { name: "test", description: "desc" };
      expect(hasStringProperty(obj, "name")).toBe(true);
      expect(hasStringProperty(obj, "description")).toBe(true);
    });

    it("should return true for empty strings", () => {
      const obj = { name: "" };
      expect(hasStringProperty(obj, "name")).toBe(true);
    });

    it("should return false for non-string properties", () => {
      const obj = { name: 42, active: true, items: [], obj: {} };
      expect(hasStringProperty(obj, "name")).toBe(false);
      expect(hasStringProperty(obj, "active")).toBe(false);
      expect(hasStringProperty(obj, "items")).toBe(false);
      expect(hasStringProperty(obj, "obj")).toBe(false);
    });

    it("should return false when property does not exist", () => {
      const obj = { name: "test" };
      expect(hasStringProperty(obj, "missing")).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(hasStringProperty(null, "prop")).toBe(false);
      expect(hasStringProperty(undefined, "prop")).toBe(false);
      expect(hasStringProperty(42, "prop")).toBe(false);
    });

    it("should narrow type to string", () => {
      const obj: unknown = { name: "test" };
      if (hasStringProperty(obj, "name")) {
        expect(typeof obj.name).toBe("string");
      }
    });
  });

  describe("hasFunctionProperty", () => {
    const myFunc = () => "result";
    const obj = { callback: myFunc, arrow: () => 42 };

    it("should return true for function properties", () => {
      expect(hasFunctionProperty(obj, "callback")).toBe(true);
      expect(hasFunctionProperty(obj, "arrow")).toBe(true);
    });

    it("should return false for non-function properties", () => {
      const obj = { callback: "not a function", value: 42, array: [1, 2] };
      expect(hasFunctionProperty(obj, "callback")).toBe(false);
      expect(hasFunctionProperty(obj, "value")).toBe(false);
      expect(hasFunctionProperty(obj, "array")).toBe(false);
    });

    it("should return false when property does not exist", () => {
      expect(hasFunctionProperty(obj, "missing")).toBe(false);
    });

    it("should return false for non-objects", () => {
      expect(hasFunctionProperty(null, "prop")).toBe(false);
      expect(hasFunctionProperty(undefined, "prop")).toBe(false);
    });

    it("should narrow type to function", () => {
      const obj: unknown = { callback: () => "result" };
      if (hasFunctionProperty(obj, "callback")) {
        expect(typeof obj.callback).toBe("function");
      }
    });
  });

  describe("isNonEmptyArray", () => {
    it("should return true for non-empty arrays", () => {
      expect(isNonEmptyArray([1])).toBe(true);
      expect(isNonEmptyArray([1, 2, 3])).toBe(true);
      expect(isNonEmptyArray(["string"])).toBe(true);
      expect(isNonEmptyArray([null])).toBe(true);
      expect(isNonEmptyArray([undefined])).toBe(true);
      expect(isNonEmptyArray([{}])).toBe(true);
      expect(isNonEmptyArray([[]])).toBe(true);
    });

    it("should return false for empty arrays", () => {
      expect(isNonEmptyArray([])).toBe(false);
    });

    it("should return false for non-array values", () => {
      expect(isNonEmptyArray(null)).toBe(false);
      expect(isNonEmptyArray(undefined)).toBe(false);
      expect(isNonEmptyArray("string")).toBe(false);
      expect(isNonEmptyArray(42)).toBe(false);
      expect(isNonEmptyArray(true)).toBe(false);
      expect(isNonEmptyArray({})).toBe(false);
    });

    it("should narrow type to array with elements", () => {
      const value: unknown = [1, 2, 3];
      if (isNonEmptyArray(value)) {
        expect(Array.isArray(value)).toBe(true);
        expect(value.length).toBeGreaterThan(0);
      }
    });

    it("should handle arrays with mixed types", () => {
      const value: unknown = [1, "string", true, null, {}];
      if (isNonEmptyArray(value)) {
        expect(value.length).toBe(5);
        expect(value[0]).toBe(1);
        expect(value[1]).toBe("string");
      }
    });

    it("should handle large arrays", () => {
      const largeArray = Array(1000).fill(0);
      expect(isNonEmptyArray(largeArray)).toBe(true);
    });

    it("should properly distinguish empty from non-empty", () => {
      const empty: unknown = [];
      const nonEmpty: unknown = [undefined];
      expect(isNonEmptyArray(empty)).toBe(false);
      expect(isNonEmptyArray(nonEmpty)).toBe(true);
    });
  });
});
