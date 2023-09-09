import type { GraphQLObjectType } from "graphql";
import { buildSchema } from "graphql";

import type {
  GroupByDirectiveOptions,
  SchemaMap,
  DirectiveName,
  GraphQLOperationType,
} from "@graphql-markdown/types";

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

  const groupOptions: GroupByDirectiveOptions = {
    fallback: "common",
    directive: "doc" as DirectiveName,
    field: "category",
  };

  describe("getGroups()", () => {
    const schemaMap: SchemaMap = {
      objects: schema.getTypeMap() as Record<
        string,
        GraphQLObjectType<unknown, unknown>
      >,
      queries: schema.getQueryType()?.getFields() as unknown as Record<
        string,
        GraphQLOperationType
      >,
    };

    test.each([[undefined], [null]])(
      "returns undefined if groupByDirective is %s",
      (value) => {
        expect.assertions(1);

        expect(getGroups(schemaMap, value)).toBeUndefined();
      },
    );

    test("returns group for each types in schema", () => {
      expect.assertions(1);

      expect(getGroups(schemaMap, groupOptions)).toEqual({
        objects: expect.objectContaining({
          Bird: "animal",
          Boolean: "common",
          Elf: "common",
          Fish: "common",
          Query: "common",
          String: "common",
          Unicorn: "common",
        }),
        queries: {
          Fish: "animal",
        },
      });
    });
  });

  describe("getGroupName()", () => {
    test.each([
      [schema.getType("Bird")!],
      [schema.getQueryType()!.getFields()!["Fish"]],
    ])("returns group name if category directive", (type) => {
      expect.assertions(1);

      expect(getGroupName(type, groupOptions)).toBe("animal");
    });

    test.each([
      { case: "null type", type: null },
      { case: "undefined type", type: undefined },
    ])("returns undefined if type is $case", ({ type }) => {
      expect.assertions(1);

      expect(getGroupName(type, groupOptions)).toBeUndefined();
    });

    test.each([
      { case: "null type", options: null },
      { case: "undefined type", options: undefined },
    ])("returns undefined if groupByDirective is $case", ({ options }) => {
      expect.assertions(1);

      const type = schema.getType("Bird")!;

      expect(getGroupName(type, options)).toBeUndefined();
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

      expect(getGroupName(type, groupOptions)).toBe("common");
    });
  });
});
