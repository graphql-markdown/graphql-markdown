import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

jest.mock("graphql/execution", (): unknown => {
  const graphql = jest.requireActual("graphql/execution");
  return {
    __esModule: true,
    ...graphql,
    getDirectiveValues: jest.fn(graphql.getDirectiveValues),
  };
});

import type { GraphQLSchema } from "graphql/type";
import type { ObjectTypeDefinitionNode, ASTNode } from "graphql/language";

import {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  isDirective,
} from "graphql/type";
import { getDirectiveValues } from "graphql/execution";
import { DirectiveLocation, Kind } from "graphql/language";
import { buildSchema } from "graphql/utilities";

import {
  getDirective,
  getTypeDirectiveArgValue,
  getFields,
  getOperation,
  getSchemaMap,
  getTypeDirectiveValues,
  getTypeFromSchema,
  getTypeName,
  hasDirective,
  isValidDirectiveLocation,
  getDirectiveLocationForASTPath,
  IntrospectionError,
} from "../../src/introspection";
import { loadSchema } from "../../src/loader";

const SCHEMA_FILE = require.resolve("../__data__/tweet.graphql");
const SCHEMA_CUSTOM_ROOT_FILE =
  require.resolve("../__data__/schema_with_custom_root_types.graphql");
const INTROSPECTION_SCHEMA_FILE =
  require.resolve("../__data__/introspection.json");
const SCHEMA_ISSUE_802_FILE = require.resolve("../__data__/schema_802.graphql");
const SCHEMA_ISSUE_1907_FILE =
  require.resolve("../__data__/schema_1907.graphql");

describe("introspection", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await loadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
    });
  });

  describe("getOperation()", () => {
    test("returns list of queries", () => {
      expect.hasAssertions();

      const list = getOperation(schema.getQueryType()!);

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns list of mutations", () => {
      expect.hasAssertions();

      const list = getOperation(schema.getMutationType()!);

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns list of subscriptions", () => {
      expect.hasAssertions();

      const list = getOperation(schema.getSubscriptionType()!);

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns {} if null", () => {
      expect.hasAssertions();

      const list = getOperation(null);

      expect(list).toMatchObject({});
    });
  });

  describe("getFields()", () => {
    test("returns list of type fields", () => {
      expect.hasAssertions();

      const fields = getFields(schema.getMutationType()!);

      expect(JSON.stringify(fields, null, 2)).toMatchSnapshot();
    });

    test("returns empty list if getFields not supported", () => {
      expect.hasAssertions();

      const fields = getFields("test");

      expect(fields).toStrictEqual([]);
    });
  });

  describe("getTypeName()", () => {
    test("returns type name for object", () => {
      expect.hasAssertions();

      const name = getTypeName(schema.getType("Tweet")!);

      expect(name).toBe("Tweet");
    });

    test("returns type name for interface", () => {
      expect.hasAssertions();

      const name = getTypeName(schema.getType("Node")!);

      expect(name).toBe("Node");
    });

    test("returns type name for scalar", () => {
      expect.hasAssertions();

      const name = getTypeName(schema.getType("ID")!);

      expect(name).toBe("ID");
    });

    test("returns default name for unknown", () => {
      expect.hasAssertions();

      const name = getTypeName({ toString: undefined }, "FooBar");

      expect(name).toBe("FooBar");
    });

    test("returns empty string is not default name set", () => {
      expect.hasAssertions();

      const name = getTypeName({ toString: undefined });

      expect(name).toBe("");
    });

    test("calls toString method when it exists", () => {
      expect.hasAssertions();

      const name = getTypeName({
        toString: () => {
          return "FooBar";
        },
      });

      expect(name).toBe("FooBar");
    });

    test("return type.name when it exists", () => {
      expect.hasAssertions();

      const name = getTypeName({ name: "FooBar" });

      expect(name).toBe("FooBar");
    });
  });

  describe("getTypeFromSchema()", () => {
    test("returns a filter map filtered by GraphQLObjectType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema<GraphQLObjectType>(
        schema,
        GraphQLObjectType,
      );

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLUnionType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema<GraphQLUnionType>(schema, GraphQLUnionType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLInterfaceType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema<GraphQLInterfaceType>(
        schema,
        GraphQLInterfaceType,
      );

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLEnumType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema<GraphQLEnumType>(schema, GraphQLEnumType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLInputObjectType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema<GraphQLInputObjectType>(
        schema,
        GraphQLInputObjectType,
      );

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLScalarType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema<GraphQLScalarType>(
        schema,
        GraphQLScalarType,
      );

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("handles null types from introspection JSON", async () => {
      const schema = await loadSchema(INTROSPECTION_SCHEMA_FILE, {
        loaders: [new JsonFileLoader()],
      });
      const map = getTypeFromSchema<GraphQLScalarType>(
        schema,
        GraphQLScalarType,
      );
      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test.each([[null], [undefined]])(
      "returns undefined if schema is not defined",
      (schema) => {
        expect.hasAssertions();

        const map = getTypeFromSchema<GraphQLScalarType>(
          schema,
          GraphQLScalarType,
        );

        expect(map).toBeUndefined();
      },
    );
  });

  describe("getSchemaMap()", () => {
    test("returns schema types map", () => {
      expect.hasAssertions();

      const schemaTypeMap = getSchemaMap(schema);

      expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchSnapshot();
    });

    test("returns {} if root type no declared (issue #802)", async () => {
      expect.hasAssertions();

      const schema802 = await loadSchema(SCHEMA_ISSUE_802_FILE, {
        loaders: [new GraphQLFileLoader()],
      });

      const schemaTypeMap = getSchemaMap(schema802);

      expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchSnapshot();
    });

    test("returns schema types map with custom root types", async () => {
      expect.hasAssertions();

      const testSchema = await loadSchema(SCHEMA_CUSTOM_ROOT_FILE, {
        loaders: [new GraphQLFileLoader()],
        rootTypes: { query: "Root", subscription: "" },
      });

      const schemaTypeMap = getSchemaMap(testSchema);

      expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchSnapshot();
    });

    test("returns schema types map with defined root types", async () => {
      expect.hasAssertions();

      const testSchema = await loadSchema(SCHEMA_ISSUE_1907_FILE, {
        loaders: [new GraphQLFileLoader()],
      });

      const schemaTypeMap = getSchemaMap(testSchema);

      expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchSnapshot();
    });
  });

  describe("hasDirective", () => {
    const schema = buildSchema(`
        directive @foobar on OBJECT

        interface Record {
          id: String!
        }

        type StudyItem implements Record @foobar {
          id: String!
          subject: String!
          duration: Int!
        }
        
        type Query {
          getStudyItems(subject: String): [StudyItem!]
          getStudyItem(id: String!): StudyItem
        }

        type Mutation {
          addStudyItem(subject: String!, duration: Int!): StudyItem
        }
    
        type Subscription {
          listStudyItems: [StudyItem!]
        }
      `);

    const foobar = new GraphQLDirective({
      name: "foobar",
      locations: [DirectiveLocation.SUBSCRIPTION, DirectiveLocation.OBJECT],
    });
    const foobaz = new GraphQLDirective({
      name: "foobaz",
      locations: [DirectiveLocation.SUBSCRIPTION],
    });

    test("return false if the type has no directive", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;

      expect(hasDirective(type, [foobar])).toBeFalsy();
    });

    test("return false if directives not defined", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;

      expect(hasDirective(type, undefined)).toBeFalsy();
    });

    test("return false if the type has no matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;

      expect(hasDirective(type, [foobaz])).toBeFalsy();
    });

    test("return true if the type has matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;

      expect(hasDirective(type, [foobar])).toBeTruthy();
    });

    test("return true if the type has one matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;

      expect(hasDirective(type, [foobar, foobaz])).toBeTruthy();
    });

    test("return true if the type is not a valid directive location and checkLocation is true", () => {
      expect.hasAssertions();

      const type = schema.getType("Record")!;

      expect(hasDirective(type, [foobar, foobaz], true)).toBeTruthy();
    });
  });

  describe("getDirective", () => {
    const schema = buildSchema(`
      directive @foobaz on OBJECT

      interface Record {
        id: String!
      }

      type StudyItem implements Record @foobaz {
        id: String!
        subject: String!
        duration: Int!
      }
      
      type Query {
        getStudyItems(subject: String): [StudyItem!]
        getStudyItem(id: String!): StudyItem
      }

      type Mutation {
        addStudyItem(subject: String!, duration: Int!): StudyItem
      }
  
      type Subscription {
        listStudyItems: [StudyItem!]
      }
    `);

    const foobar = new GraphQLDirective({
      name: "foobar",
      locations: [],
    });
    const foobaz = new GraphQLDirective({
      name: "foobaz",
      locations: [],
    });

    test("return empty list if the type has no directive", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;
      const actual = getDirective(type, [foobar]);

      expect(actual).toHaveLength(0);
    });

    test("return empty list if directives not defined", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;
      const actual = getDirective(type, undefined);

      expect(actual).toHaveLength(0);
    });

    test("return empty list if the type has no matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;
      const actual = getDirective(type, [foobar]);

      expect(actual).toHaveLength(0);
    });

    test("return list if the type has matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;
      const actual = getDirective(type, [foobaz]);

      expect(actual).toHaveLength(1);
      expect(actual[0].toString()).toBe("@foobaz");
      expect(isDirective(actual[0])).toBeTruthy();
    });

    test("return list if the type has one matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;
      const actual = getDirective(type, [foobar, foobaz]);

      expect(actual).toHaveLength(1);
      expect(actual[0].toString()).toBe("@foobaz");
      expect(isDirective(actual[0])).toBeTruthy();
    });
  });

  describe("getTypeDirectiveArgValue", () => {
    const schema = buildSchema(`
      directive @dirWithoutArg on OBJECT

      directive @testA(
        arg: ArgEnum = ARGA
      ) on OBJECT | FIELD_DEFINITION

      directive @testB(
        argA: Int!, 
        argB: [String!]
        argC: TestInput
      ) on FIELD_DEFINITION

      enum ArgEnum {
        ARGA
        ARGB
        ARGC
      }

      type Test @testA @dirWithoutArg {
        id: ID!
        fieldA: [String!] 
          @testA(arg: ARGC) 
          @testB(argA: 10, argB: ["testArgB"], argC: { id: "input-id" })
      }

      input TestInput {
        id: ID!
      }
    `);
    const type = schema.getType("Test")!;

    test("throws IntrospectionError if argument does not exist", () => {
      expect.assertions(1);

      const directiveName = "dirWithoutArg";
      const directiveType = schema.getDirective(directiveName)!;
      const argName = "fooBar";

      expect(() => {
        getTypeDirectiveArgValue(directiveType, type.astNode!, argName);
      }).toThrow(
        new IntrospectionError(`Directive argument '${argName}' not found!`),
      );
    });

    test("returns fields value if argument is of input type", () => {
      expect.assertions(1);

      const directiveName = "testB";
      const directiveType = schema.getDirective(directiveName)!;
      const typeFieldNode = (
        type.astNode! as ObjectTypeDefinitionNode
      ).fields!.find((field) => {
        return field.name.value === "fieldA";
      })!;
      const argName = "argC";

      expect(getTypeDirectiveArgValue(directiveType, typeFieldNode, argName))
        .toMatchInlineSnapshot(`
        {
          "id": "input-id",
        }
      `);
    });

    test("returns values if argument is of list type", () => {
      expect.assertions(1);

      const directiveName = "testB";
      const directiveType = schema.getDirective(directiveName)!;
      const typeFieldNode = (
        type.astNode! as ObjectTypeDefinitionNode
      ).fields!.find((field) => {
        return field.name.value === "fieldA";
      })!;
      const argName = "argB";

      expect(getTypeDirectiveArgValue(directiveType, typeFieldNode, argName))
        .toMatchInlineSnapshot(`
        [
          "testArgB",
        ]
      `);
    });

    test("returns value if argument is of a type", () => {
      expect.assertions(1);

      const directiveName = "testB";
      const directiveType = schema.getDirective(directiveName)!;
      const typeFieldNode = (
        type.astNode! as ObjectTypeDefinitionNode
      ).fields!.find((field) => {
        return field.name.value === "fieldA";
      })!;
      const argName = "argA";

      expect(
        getTypeDirectiveArgValue(directiveType, typeFieldNode, argName),
      ).toMatchInlineSnapshot(`10`);
    });

    test("returns default value if argument is optional and not set", () => {
      expect.assertions(1);

      const directiveName = "testA";
      const directiveType = schema.getDirective(directiveName)!;
      const argName = "arg";

      expect(
        getTypeDirectiveArgValue(directiveType, type, argName),
      ).toMatchInlineSnapshot(`"ARGA"`);
    });

    test("returns value if type is astNode", () => {
      expect.assertions(1);

      const directiveName = "testA";
      const directiveType = schema.getDirective(directiveName)!;
      const argName = "arg";

      expect(
        getTypeDirectiveArgValue(directiveType, type.astNode!, argName),
      ).toMatchInlineSnapshot(`"ARGA"`);
    });
  });

  describe("getTypeDirectiveValues", () => {
    const schema = buildSchema(`
      directive @dirWithoutArg on OBJECT

      directive @testA(
        arg: ArgEnum = ARGA
      ) on OBJECT | FIELD_DEFINITION

      directive @testB(
        argA: Int!, 
        argB: [String!]
        argC: TestInput
      ) on FIELD_DEFINITION

      enum ArgEnum {
        ARGA
        ARGB
        ARGC
      }

      type Test @testA @dirWithoutArg {
        id: ID!
        fieldA: [String!] 
          @testA(arg: ARGC) 
          @testB(argA: 10, argB: ["testArgB"], argC: { id: "input-id" })
      }

      input TestInput {
        id: ID!
      }
    `);
    const type = schema.getType("Test")!;
    const directiveType = schema.getDirective("testA")!;

    test("converts type to astNode", () => {
      expect.assertions(2);

      const values = getTypeDirectiveValues(directiveType, type);

      expect(getDirectiveValues).toHaveBeenCalledWith(
        directiveType,
        type.astNode,
      );
      expect(values).toMatchObject({ arg: "ARGA" });
    });

    test("does not convert astNode", () => {
      expect.assertions(2);

      const typeAstNode = type.astNode!;

      const values = getTypeDirectiveValues(directiveType, typeAstNode);

      expect(getDirectiveValues).toHaveBeenCalledWith(
        directiveType,
        typeAstNode,
      );
      expect(values).toMatchObject({ arg: "ARGA" });
    });
  });

  describe("isValidDirectiveLocation", () => {
    const schema = buildSchema(`
    directive @dirWithoutArg on OBJECT

    directive @testA(
      arg: ArgEnum = ARGA
    ) on OBJECT | FIELD_DEFINITION

    directive @testB(
      argA: Int!, 
      argB: [String!]
      argC: TestInput
    ) on FIELD_DEFINITION

    enum ArgEnum {
      ARGA
      ARGB
      ARGC
    }

    type Test @testA @dirWithoutArg {
      id: ID!
      fieldA: [String!] 
        @testA(arg: ARGC) 
        @testB(argA: 10, argB: ["testArgB"], argC: { id: "input-id" })
    }

    input TestInput {
      id: ID!
    }
  `);

    test("returns false if entity location is not a valid directive location", () => {
      expect.assertions(1);

      expect(
        isValidDirectiveLocation(
          schema.getType("ArgEnum"),
          schema.getDirective("testA")!,
        ),
      ).toBeFalsy();
    });

    test("returns true if entity location is a valid directive location", () => {
      expect.assertions(1);

      expect(
        isValidDirectiveLocation(
          schema.getType("Test"),
          schema.getDirective("testA")!,
        ),
      ).toBeTruthy();
    });

    test("returns false if entity has no astNode definition", () => {
      expect.assertions(1);

      expect(
        isValidDirectiveLocation({}, schema.getDirective("testA")!),
      ).toBeFalsy();
    });
  });

  describe("getDirectiveLocationForASTPath", () => {
    const schema = buildSchema(`
    directive @directiveTest on OBJECT

    enum ArgEnum {
      ARGA
      ARGB
      ARGC
    }

    type TestObject {
      id: ID!
      fieldA: [String!] 
    }

    input TestInput {
      id: ID!
    }

    interface TestInterface {
      id: String!
    }

    union TestUnion = ID | String 

    scalar JSON
  `);

    test.each([
      {
        entity: schema.getType("ArgEnum"),
        location: DirectiveLocation.ENUM,
      },
      {
        entity: schema.getType("TestObject"),
        location: DirectiveLocation.OBJECT,
      },
      {
        entity: schema.getType("TestInput"),
        location: DirectiveLocation.INPUT_OBJECT,
      },
      {
        entity: schema.getType("TestInterface"),
        location: DirectiveLocation.INTERFACE,
      },
      {
        entity: schema.getType("TestUnion"),
        location: DirectiveLocation.UNION,
      },
      {
        entity: schema.getType("JSON"),
        location: DirectiveLocation.SCALAR,
      },
    ])("returns directive location", ({ entity, location }) => {
      expect.assertions(1);

      expect(getDirectiveLocationForASTPath(entity?.astNode)).toBe(location);
    });

    test.each([
      [{}],
      [undefined],
      [
        {
          appliedTo: Kind.DIRECTIVE,
        },
      ],
    ])("throws on unsupported entity", (node: unknown) => {
      expect.assertions(1);

      expect(() => {
        return getDirectiveLocationForASTPath(node as ASTNode);
      }).toThrow();
    });
  });
});
