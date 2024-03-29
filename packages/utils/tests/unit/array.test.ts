import { toArray, convertArrayToMapObject } from "../../src/array";

describe("array", () => {
  describe("toArray()", () => {
    test("returns an array of values from a k/v object", () => {
      expect.hasAssertions();

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
      expect.hasAssertions();

      expect(toArray(undefined)).toBeUndefined();
    });
  });

  describe("convertArrayToMapObject()", () => {
    test("returns a k/v object from an array of objects with name property", () => {
      expect.hasAssertions();

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
      expect.hasAssertions();

      expect(convertArrayToMapObject(undefined)).toBeUndefined();
    });
  });
});
