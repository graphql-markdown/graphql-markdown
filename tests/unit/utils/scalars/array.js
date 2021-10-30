const { toArray } = require("../../../../src/utils/scalars/array");

describe("utils", () => {
  describe("array", () => {
    describe("toArray()", () => {
      test("returns an array of values from a k/v object", () => {
        const input = {
          bool: true,
          string: "test",
          number: 123,
          array: ["one", "two"],
          child: { key: "value" },
        };
        const expected = [true, "test", 123, ["one", "two"], { key: "value" }];
        expect(toArray(input)).toEqual(expect.arrayContaining(expected));
      });

      test("returns undefined if not an object", () => {
        expect(toArray("test")).toBeUndefined();
      });
    });
  });
});
