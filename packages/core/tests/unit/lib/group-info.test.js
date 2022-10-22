const {
  parseGroupByOption,
  // getGroups,
  getGroupName,
} = require("../../../src/lib/group-info");

const { buildSchema } = require("graphql");

describe("lib", () => {
  describe("group-info", () => {
    const schema = buildSchema(`
    directive @doc(
      category: String
    ) on OBJECT | INPUT_OBJECT | UNION | ENUM | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION
    
    directive @tag(
      category: String
    ) on OBJECT | INPUT_OBJECT | UNION | ENUM | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION
    

    type Unicorn {
      name: String!
    }

    type Bird @doc(category: "animal") {
      name: String!
    }

    type Fish {
      name: String!
    }

    type Elf @tag(category: "fantasy") {
      name: String!
    }
  `);

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
      const groupOptions = {
        fallback: "default",
        directive: "doc",
        field: "category",
      };

      test("returns group name if category directive", () => {
        expect.assertions(1);
        const type = schema.getType("Bird");
        expect(getGroupName(type, groupOptions)).toBe("animal");
      });

      test.each([
        { case: "invalid type", type: {} },
        { case: "no directive", type: schema.getType("Unicorn") },
        { case: "no matching directive", type: schema.getType("Elf") },
      ])("returns fallback group name if $case", ({ type }) => {
        expect.assertions(1);
        expect(getGroupName(type, groupOptions)).toBe("default");
      });
    });
  });
});
