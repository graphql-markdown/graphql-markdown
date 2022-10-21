const { parseGroupByOption } = require("../../../src/lib/group-info");

describe("lib", () => {
  describe("group-info", () => {
    describe("parseGroupByOption()", () => {
      test("returns object with groupBy config", () => {
        expect.hasAssertions();

        const groupOptions = "@doc(category|=Common)";

        const { directive, field, fallback } = parseGroupByOption(groupOptions);

        expect(directive).toBe("doc");
        expect(field).toBe("category");
        expect(fallback).toBe("Common");
      });

      test("returns object with default fallback if not set", () => {
        const groupOptions = "@doc(category)";

        const { directive, field, fallback } = parseGroupByOption(groupOptions);

        expect(directive).toBe("doc");
        expect(field).toBe("category");
        expect(fallback).toBe("Miscellaneous");
      });

      test("throws an error if string format is invalid", () => {
        expect.hasAssertions();

        const groupOptions = "@doc(category|=)";

        expect(() => {
          parseGroupByOption(groupOptions);
        }).toThrow(`Invalid "${groupOptions}"`);
      });

      test.each([
        [undefined],
        [null],
        [1],
        [["foobar"]],
        [{ groupOptions: "foobar" }],
      ])(
        "returns undefined if groupOptions is not a string",
        (groupOptions) => {
          expect.hasAssertions();

          expect(parseGroupByOption(groupOptions)).toBeUndefined();
        },
      );
    });

    describe("getGroups()", () => {
      test("returns object", () => {});
    });

    describe("getGroupName()", () => {
      test("returns group name", () => {});
    });
  });
});
