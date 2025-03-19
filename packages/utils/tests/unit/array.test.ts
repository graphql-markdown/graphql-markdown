// packages/utils/tests/unit/array.test.ts
import { toArray, convertArrayToMapObject } from "../../src/array";

describe("array", () => {
  describe("toArray()", () => {
    test("returns an array of values from a k/v object", () => {
      expect.assertions(1);

      const input = {
        bool: true,
        string: "test",
        number: 123,
        array: ["one", "two"],
        child: { key: "value" },
      };
      const expected = [true, "test", 123, ["one", "two"], { key: "value" }];
      expect(toArray(input)).toStrictEqual(expected);
    });

    test("returns undefined if not an object", () => {
      expect.assertions(3);

      expect(toArray(undefined)).toBeUndefined();
      expect(toArray(null)).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(toArray("not an object" as any)).toBeUndefined();
    });

    test("returns empty array for empty object", () => {
      expect.assertions(1);

      expect(toArray({})).toStrictEqual([]);
    });

    test("preserves order of object properties", () => {
      expect.assertions(1);

      const input = {
        z: "last",
        a: "first",
        m: "middle",
      };

      // Note: Modern JS engines preserve insertion order of object properties
      expect(toArray(input)).toStrictEqual(["last", "first", "middle"]);
    });
  });

  describe("convertArrayToMapObject()", () => {
    test("returns a k/v object from an array of objects with name property", () => {
      expect.assertions(1);

      const input: Record<string, unknown>[] = [
        { name: true },
        { name: "test" },
        { name: 123 },
        { name2: 1234 },
      ];
      const expected: Record<string, Record<string, unknown>> = {
        true: { name: true },
        test: { name: "test" },
        "123": { name: 123 },
      };

      const actual = convertArrayToMapObject(input);

      expect(actual).toStrictEqual(expected);
    });

    test("returns undefined if not an array", () => {
      expect.assertions(3);

      expect(convertArrayToMapObject(undefined)).toBeUndefined();
      expect(convertArrayToMapObject(null)).toBeUndefined();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(convertArrayToMapObject({} as any)).toBeUndefined();
    });

    test("returns empty object for empty array", () => {
      expect.assertions(1);

      expect(convertArrayToMapObject([])).toStrictEqual({});
    });

    test("handles objects with non-string name properties", () => {
      expect.assertions(1);

      const input = [
        { name: 123 },
        { name: true },
        { name: { nested: "object" } },
      ];

      const result = convertArrayToMapObject(input);

      expect(result).toStrictEqual({
        "123": { name: 123 },
        true: { name: true },
        "[object Object]": { name: { nested: "object" } },
      });
    });

    test("skips objects without name property", () => {
      expect.assertions(1);

      const input = [
        { name: "valid" },
        { id: "invalid" },
        { name: "another valid" },
      ];

      const result = convertArrayToMapObject(input);

      expect(result).toStrictEqual({
        valid: { name: "valid" },
        "another valid": { name: "another valid" },
      });
    });
  });
});
