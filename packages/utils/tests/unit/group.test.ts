import { GraphQLNamedType, buildSchema } from "graphql";

import { getGroups, getGroupName } from "../../src/group";

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

    type Query {
      Fish: [Fish!]! @doc(category: "animal")
    }
  `);

  const groupOptions = {
    fallback: "common",
    directive: "doc",
    field: "category",
  };

  describe("getGroups()", () => {
    const schemaMap = {
      objects: schema.getTypeMap(),
      queries: schema?.getQueryType()?.getFields(),
    };

    test("returns undefined if groupByDirective not defined", () => {
      expect.assertions(1);

      expect(getGroups(schemaMap, undefined)).toBeUndefined();
    });

    test("returns group for each types in schema", () => {
      expect.assertions(1);

      expect(getGroups(schemaMap, groupOptions)).toMatchInlineSnapshot(`
        {
          "objects": {
            "Bird": "animal",
            "Boolean": "common",
            "Elf": "common",
            "Fish": "common",
            "Query": "common",
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
          },
          "queries": {
            "Fish": "animal",
          },
        }
      `);
    });
  });

  describe("getGroupName()", () => {
    test("returns group name if category directive", () => {
      expect.assertions(2);

      const type = schema.getType("Bird")!;
      const queryType = schema!.getQueryType()!.getFields()!["Fish"];

      expect(getGroupName(type, groupOptions)).toBe("animal");
      expect(getGroupName(queryType, groupOptions)).toBe("animal");
    });

    test.each([
      { case: "invalid type", type: {} },
      { case: "no directive", type: schema.getType("Unicorn") },
      {
        case: "no directives array",
        type: { ...schema.getType("Unicorn"), astNode: { directives: "" } },
      },
      { case: "no matching directive", type: schema.getType("Elf") },
    ])("returns fallback group name if $case", ({ type }) => {
      expect.assertions(1);

      expect(getGroupName(type as unknown as GraphQLNamedType, groupOptions)).toBe("common");
    });
  });
});
