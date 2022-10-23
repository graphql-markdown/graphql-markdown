const {
  parseGroupByOption,
  getGroups,
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

    const groupOptions = {
      fallback: "common",
      directive: "doc",
      field: "category",
    };

    describe("parseGroupByOption()", () => {
      test("returns object with groupBy config", () => {
        expect.assertions(3);

        const groupOptionsFlag = "@doc(category|=common)";
        const { directive, field, fallback } =
          parseGroupByOption(groupOptionsFlag);

        expect(directive).toBe("doc");
        expect(field).toBe("category");
        expect(fallback).toBe("common");
      });

      test("returns object with default fallback if not set", () => {
        expect.assertions(3);

        const groupOptionsFlag = "@doc(category)";
        const { directive, field, fallback } =
          parseGroupByOption(groupOptionsFlag);

        expect(directive).toBe("doc");
        expect(field).toBe("category");
        expect(fallback).toBe("Miscellaneous");
      });

      test("throws an error if string format is invalid", () => {
        expect.assertions(1);

        const groupOptionsFlag = "@doc(category|=)";

        expect(() => {
          parseGroupByOption(groupOptionsFlag);
        }).toThrow(`Invalid "${groupOptionsFlag}"`);
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
      const schemaMap = {
        objects: schema.getTypeMap(),
      };

      test("returns undefined if groupByDirective not defined", () => {
        expect.assertions(1);

        expect(getGroups(schemaMap, undefined)).toBeUndefined();
      });

      test("returns group for each types in schema", () => {
        expect.assertions(1);

        expect(getGroups(schemaMap, groupOptions)).toMatchInlineSnapshot(`
          {
            "Bird": "animal",
            "Boolean": "common",
            "Elf": "common",
            "Fish": "common",
            "String": "common",
            "Unicorn": "common",
            "__Directive": "common",
            "__DirectiveLocation": "common",
            "__EnumValue": "common",
            "__Field": "common",
            "__InputValue": "common",
            "__Schema": "common",
            "__Type": "common",
            "__TypeKind": "common",
          }
        `);
      });
    });

    describe("getGroupName()", () => {
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

        expect(getGroupName(type, groupOptions)).toBe("common");
      });
    });
  });
});
