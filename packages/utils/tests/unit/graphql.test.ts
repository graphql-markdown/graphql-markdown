import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import type { LoaderOption } from "@graphql-markdown/types";

jest.mock("graphql", () => {
  const graphql = jest.requireActual("graphql");
  return {
    ...graphql,
    getDirectiveValues: jest.fn((...args) =>
      graphql.getDirectiveValues(...args),
    ),
  };
});
import type {
  GraphQLDirective,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLType,
  ObjectTypeDefinitionNode,
} from "graphql";
import {
  buildSchema,
  getDirectiveValues,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  GraphQLUnionType,
  isDirective,
} from "graphql";

import {
  getConstDirectiveMap,
  getDefaultValue,
  getDirective,
  getTypeDirectiveArgValue,
  getDocumentLoaders,
  getFields,
  getIntrospectionFieldsList,
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfInterface,
  getRelationOfReturn,
  getRelationOfUnion,
  getSchemaMap,
  getTypeDirectiveValues,
  getTypeFromSchema,
  getTypeName,
  hasDirective,
  isDeprecated,
  isOperation,
  isParametrizedField,
  loadSchema,
} from "../../src/graphql";

const SCHEMA_FILE = require.resolve("../__data__/tweet.graphql");
const SCHEMA_CUSTOM_ROOT_FILE = require.resolve(
  "../__data__/schema_with_custom_root_types.graphql",
);
const INTROSPECTION_SCHEMA_FILE = require.resolve(
  "../__data__/introspection.json",
);
const SCHEMA_ISSUE_802_FILE = require.resolve("../__data__/schema_802.graphql");

describe("graphql", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await gqlToolsLoadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
    });
  });

  describe("loadSchema()", () => {
    test("returns valid schema", async () => {
      expect.hasAssertions();

      const testSchema = await loadSchema(SCHEMA_FILE, {
        loaders: [new GraphQLFileLoader()],
      });
      expect(JSON.stringify(testSchema)).toBe(JSON.stringify(schema));
    });

    test("returns valid schema with custom root type", async () => {
      expect.hasAssertions();

      const testSchema = await loadSchema(SCHEMA_CUSTOM_ROOT_FILE, {
        loaders: [new GraphQLFileLoader()],
        rootTypes: { query: "Root", subscription: "" },
      });

      expect(testSchema.getQueryType()!.name).toBe("Root");
      expect(testSchema.getMutationType()).toBeUndefined();
      expect(testSchema.getSubscriptionType()).toBeUndefined();
    });
  });

  describe("getDocumentLoaders()", () => {
    test("returns loaders when plugin config loaders format is a string", async () => {
      expect.hasAssertions();

      const loaderList = {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
      } as LoaderOption;
      const documentLoaders = await getDocumentLoaders(loaderList);

      expect(documentLoaders).toBeDefined();
      const { loaders, ...loaderOptions } = documentLoaders!;

      expect(loaders).toMatchObject([new GraphQLFileLoader()]);
      expect(loaderOptions).toMatchObject({});
    });

    test("returns loaders and configuration when plugin config loaders format is an object", async () => {
      expect.hasAssertions();

      const loaderList = {
        GraphQLFileLoader: {
          module: "@graphql-tools/graphql-file-loader",
          options: {
            option1: true,
          },
        },
      } as LoaderOption;
      const documentLoaders = await getDocumentLoaders(loaderList);

      expect(documentLoaders).toBeDefined();
      const { loaders, ...loaderOptions } = documentLoaders!;

      expect(loaders).toMatchObject([new GraphQLFileLoader()]);
      expect(loaderOptions).toMatchObject({
        option1: true,
      });
    });

    test("throw an error when loader list is invalid", async () => {
      expect.hasAssertions();

      const loaderList = { GraphQLFileLoader: {} } as LoaderOption;
      await expect(getDocumentLoaders(loaderList)).rejects.toThrow(
        `Wrong format for plugin loader "GraphQLFileLoader", it should be {module: String, options?: Object}`,
      );
    });
  });

  // covers printDefaultValue()
  describe("getDefaultValue()", () => {
    test("returns undefined if type is undefined", () => {
      expect.hasAssertions();
      expect(
        getDefaultValue({ type: undefined, defaultValue: 5 }),
      ).toBeUndefined();
    });

    test.each([
      { type: GraphQLInt, defaultValue: 5 },
      { type: GraphQLInt, defaultValue: 0 },
      { type: GraphQLFloat, defaultValue: 5.3 },
      { type: GraphQLFloat, defaultValue: 0.0 },
      { type: GraphQLBoolean, defaultValue: true },
      { type: GraphQLBoolean, defaultValue: false },
    ])(
      "returns $defaultValue value as default for $type",
      ({ type, defaultValue }) => {
        expect.hasAssertions();

        const argument = {
          name: "foobar",
          description: undefined,
          type,
          defaultValue,
          extensions: undefined,
        };

        expect(getDefaultValue(argument)).toEqual(defaultValue);
      },
    );

    test.each([
      { type: GraphQLInt },
      { type: GraphQLID },
      { type: GraphQLFloat },
      { type: GraphQLString },
      { type: GraphQLBoolean },
      { type: new GraphQLList(GraphQLID) },
    ])(
      "returns undefined for type $type if not default value defined",
      ({ type }) => {
        expect.hasAssertions();

        const argument = {
          name: "foobar",
          description: undefined,
          type,
          defaultValue: undefined,
          extensions: undefined,
        };

        expect(getDefaultValue(argument)).toBeUndefined();
      },
    );

    test.each([
      {
        type: new GraphQLList(GraphQLID),
        defaultValue: ["0", "1"],
        expected: '["0", "1"]',
      },
      {
        type: new GraphQLList(GraphQLInt),
        defaultValue: 42,
        expected: "[42]",
      },
    ])(
      "returns array default value as string for type $type",
      ({ type, defaultValue, expected }) => {
        expect.hasAssertions();

        const argument = {
          name: "id",
          description: undefined,
          type,
          defaultValue,
          extensions: undefined,
        };

        expect(getDefaultValue(argument)).toBe(expected);
      },
    );

    test("returns unformatted default value for type GraphQLEnum", () => {
      expect.hasAssertions();

      const enumType = new GraphQLEnumType({
        name: "RGB",
        values: {
          RED: { value: "RED" },
          GREEN: { value: "GREEN" },
          BLUE: { value: "BLUE" },
        },
      });

      const argument = {
        name: "color",
        description: undefined,
        type: enumType,
        defaultValue: "RED",
        extensions: undefined,
      };

      expect(getDefaultValue(argument)).toBe("RED");
    });

    test("returns array default value unformatted for type GraphQLList(GraphQLEnum)", () => {
      expect.hasAssertions();

      const enumType = new GraphQLEnumType({
        name: "RGB",
        values: {
          RED: { value: "RED" },
          GREEN: { value: "GREEN" },
          BLUE: { value: "BLUE" },
        },
      });

      const argument = {
        name: "color",
        description: undefined,
        type: new GraphQLList(enumType),
        defaultValue: ["RED"],
        extensions: undefined,
      };

      expect(getDefaultValue(argument)).toBe("[RED]");
    });
  });

  describe("getIntrospectionFieldsList()", () => {
    test("returns list of queries", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(schema.getQueryType()!);

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns list of mutations", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(schema.getMutationType()!);

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns list of subscriptions", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(schema.getSubscriptionType()!);

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns {} if null", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(null);

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

      const name = getTypeName({ toString: () => "FooBar" });

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
      const schema = await gqlToolsLoadSchema(INTROSPECTION_SCHEMA_FILE, {
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

      const schema802 = await gqlToolsLoadSchema(SCHEMA_ISSUE_802_FILE, {
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
  });

  describe("isParametrizedField()", () => {
    test("returns true if type is parametrized", () => {
      expect.hasAssertions();

      const mutations = getIntrospectionFieldsList(schema.getMutationType());
      const res = isParametrizedField(mutations["createTweet"]);

      expect(res).toBeTruthy();
    });

    test("returns false if type is not parametrized", () => {
      expect.hasAssertions();

      const queries = getIntrospectionFieldsList(schema.getQueryType());
      const res = isParametrizedField(queries["TweetsMeta"]);

      expect(res).toBeFalsy();
    });
  });

  describe("isOperation()", () => {
    test("returns true if type is mutation", () => {
      expect.hasAssertions();

      const mutations = getIntrospectionFieldsList(schema.getMutationType());
      const res = isOperation(mutations["createTweet"]);

      expect(res).toBeTruthy();
    });

    test("returns true if type is query", () => {
      expect.hasAssertions();

      const queries = getIntrospectionFieldsList(schema.getQueryType());
      const res = isOperation(queries["Tweets"]);

      expect(res).toBeTruthy();
    });

    test("returns true if type is subscription", () => {
      expect.hasAssertions();

      const subscriptions = getIntrospectionFieldsList(
        schema.getSubscriptionType(),
      );
      const res = isOperation(subscriptions["Notifications"]);

      expect(res).toBeTruthy();
    });

    test("returns false if type is not an operation", () => {
      expect.hasAssertions();

      const objects = getTypeFromSchema<GraphQLObjectType>(
        schema,
        GraphQLObjectType,
      )!;
      const res = isOperation(objects["Tweet"]);

      expect(res).toBeFalsy();
    });
  });

  describe("getRelationOfInterface()", () => {
    test("returns types and interfaces extending an interface", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        interface Being {
          name(surname: Boolean): String
        }
        
        interface Mammal {
          mother: Mammal
          father: Mammal
        }

        interface Pet implements Being {
          name(surname: Boolean): String
        }
        
        interface Canine implements Mammal & Being {
          name(surname: Boolean): String
          mother: Canine
          father: Canine
        }
        
        type Dog implements Being & Pet & Mammal & Canine {
          name(surname: Boolean): String
          nickname: String
          mother: Dog
          father: Dog
        }
      `);

      const interfaceType = schema.getType("Mammal");

      const relations = getRelationOfInterface(interfaceType, schema);

      expect(relations).toMatchInlineSnapshot(`
        {
          "interfaces": [
            "Canine",
          ],
          "objects": [
            "Dog",
          ],
        }
      `);
    });
  });

  describe("getRelationOfUnion", () => {
    test("returns unions using a type", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        type StudyItem {
          id: ID!
          subject: String!
          duration: Int!
        }
        
        type Meeting {
          id: ID!
          topic: String!
        }
        
        type Shopping {
          id: ID!
        }
        
        union Task = StudyItem | Meeting | Shopping
        
        type Schedule {
          task: Task
        }
      `);

      const compositeType = schema.getType("Meeting");

      const relations = getRelationOfUnion(compositeType, schema);

      expect(relations).toMatchInlineSnapshot(`
        {
          "unions": [
            "Task",
          ],
        }
      `);
    });
  });

  describe("getRelationOfImplementation", () => {
    test("returns implementations compatible with type", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        interface Being {
          name(surname: Boolean): String
        }

        interface Mammal {
          mother: Mammal
          father: Mammal
        }

        interface Canine implements Mammal & Being {
          name(surname: Boolean): String
          mother: Canine
          father: Canine
        }
        
        type Dog implements Being & Mammal & Canine {
          name(surname: Boolean): String
          nickname: String
          mother: Dog
          father: Dog
        }

        type Cat implements Being & Mammal {
          name(surname: Boolean): String
          nickname: String
          mother: Dog
          father: Dog
        }

        union Pet = Dog | Cat | Being
      `);

      const compositeType = schema.getType("Being");

      const relations = getRelationOfImplementation(compositeType, schema);

      expect(relations).toMatchInlineSnapshot(`
        {
          "interfaces": [
            "Canine",
          ],
          "objects": [
            "Dog",
            "Cat",
          ],
          "unions": [
            "Pet",
          ],
        }
      `);
    });
  });

  describe("getRelationOfReturn", () => {
    test("returns queries, subscriptions and mutations using a type", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        type StudyItem {
          id: ID!
          subject: String!
          duration: Int!
        }
        
        type Query {
          getStudyItems(subject: String): [StudyItem!]
          getStudyItem(id: ID!): StudyItem
        }

        type Mutation {
          addStudyItem(subject: String!, duration: Int!): StudyItem
        }
    
        type Subscription {
          listStudyItems: [StudyItem!]
        }
      `);

      const compositeType = schema.getType("StudyItem");

      const relations = getRelationOfReturn(compositeType, schema);

      expect(relations).toMatchSnapshot();
    });
  });

  describe("getRelationOfField", () => {
    test("returns queries, subscriptions and mutations using a type", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        interface Record {
          id: String!
        }

        type StudyItem implements Record {
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

      const compositeType = schema.getType("String");

      const relations = getRelationOfField(compositeType, schema);

      expect(relations).toMatchSnapshot();
    });
  });

  describe("hasDirective", () => {
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

    test("return false if the type has no directive", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;

      expect(hasDirective(type, "foobar")).toBeFalsy();
    });

    test("return false if directives not defined", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;

      expect(hasDirective(type, undefined)).toBeFalsy();
    });

    test("return false if the type has no matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;

      expect(hasDirective(type, "foobar")).toBeFalsy();
    });

    test("return true if the type has matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;

      expect(hasDirective(type, "foobaz")).toBeTruthy();
    });

    test("return true if the type has one matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;

      expect(hasDirective(type, ["foobar", "foobaz"])).toBeTruthy();
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

    test("return empty list if the type has no directive", () => {
      expect.hasAssertions();

      const type = schema.getType("Subscription")!;
      const actual = getDirective(type, "foobar");

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
      const actual = getDirective(type, "foobar");

      expect(actual).toHaveLength(0);
    });

    test("return list if the type has matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;
      const actual = getDirective(type, "foobaz");

      expect(actual).toHaveLength(1);
      expect(actual[0].toString()).toBe("@foobaz");
      expect(isDirective(actual[0])).toBeTruthy();
    });

    test("return list if the type has one matching directive", () => {
      expect.hasAssertions();

      const type = schema.getType("StudyItem")!;
      const actual = getDirective(type, ["foobar", "foobaz"]);

      expect(actual).toHaveLength(1);
      expect(actual[0].toString()).toBe("@foobaz");
      expect(isDirective(actual[0])).toBeTruthy();
    });
  });

  describe("getConstDirectiveMap", () => {
    const schema = buildSchema(`
      directive @testA(
        arg: ArgEnum = ARGA
      ) on OBJECT | FIELD_DEFINITION

      directive @testB(
        argA: Int!, 
        argB: [String!]
      ) on FIELD_DEFINITION

      enum ArgEnum {
        ARGA
        ARGB
        ARGC
      }

      type Test @testA {
        id: ID!
        fieldA: [String!] 
          @testA(arg: ARGC) 
          @testB(argA: 10, argB: ["testArgB"])
      }

      type TestWithoutDirective {
        id: ID!
      }
    `);
    const type = schema.getType("Test")!;
    const typeWithoutDirective = schema.getType("TestWithoutDirective")!;
    const descriptor = (
      directiveType: GraphQLNamedType,
      constDirectiveType: GraphQLDirective,
    ): string => `Test${constDirectiveType.name}`;
    const options = {
      customDirectives: {
        testA: {
          type: schema.getDirective("testA"),
          descriptor,
        },
        nonExist: {
          type: undefined,
          descriptor,
        },
      },
    };

    test("returns undefined when config is not set", () => {
      expect.assertions(1);

      const map = getConstDirectiveMap(type, { customDirectives: undefined });

      expect(map).toBeUndefined();
    });

    test("returns undefined when config custom directive does not exist", () => {
      expect.assertions(1);

      const map = getConstDirectiveMap(typeWithoutDirective, options);

      expect(map).toBeUndefined();
    });

    test("returns custom directives map", () => {
      expect.assertions(1);

      const map = getConstDirectiveMap(type, options);

      expect(map).toMatchSnapshot();
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

    test("throws an error if argument does not exist", () => {
      expect.assertions(1);

      const directiveName = "dirWithoutArg";
      const directiveType = schema.getDirective(directiveName)!;
      const argName = "fooBar";

      expect(() => {
        getTypeDirectiveArgValue(directiveType, type.astNode!, argName);
      }).toThrow(`Directive argument '${argName}' not found!`);
    });

    test("returns fields value if argument is of input type", () => {
      expect.assertions(1);

      const directiveName = "testB";
      const directiveType = schema.getDirective(directiveName)!;
      const typeFieldNode = (
        type.astNode! as ObjectTypeDefinitionNode
      ).fields!.find((field) => field.name.value === "fieldA")!;
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
      ).fields!.find((field) => field.name.value === "fieldA")!;
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
      ).fields!.find((field) => field.name.value === "fieldA")!;
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
      expect.assertions(1);

      getTypeDirectiveValues(directiveType, type);

      expect(getDirectiveValues).toHaveBeenCalledWith(
        directiveType,
        type.astNode,
      );
    });

    test("does not convert astNode", () => {
      expect.assertions(1);

      getTypeDirectiveValues(directiveType as GraphQLDirective, type.astNode!);

      expect(getDirectiveValues).toHaveBeenCalledWith(
        directiveType,
        type.astNode,
      );
    });
  });

  describe("isDeprecated", () => {
    const schema = buildSchema(`
        interface Record {
          id: String!
        }

        type StudyItem implements Record {
          id: String!
          subject: String!
          duration: Int!
        }
        
        type Query {
          getStudyItems(subject: String): [StudyItem!]
          getStudyItem(id: String!): StudyItem @deprecated
        }

        type Mutation {
          addStudyItem(subject: String!, duration: Int!): StudyItem
        }
    
        type Subscription {
          listStudyItems: [StudyItem!]
        }
      `);

    test("return false is the type is not deprecated", () => {
      expect.hasAssertions();

      const type = schema.getQueryType()!.getFields();

      expect(isDeprecated(type.getStudyItems)).toBeFalsy();
    });

    test("return true is the type is deprecated", () => {
      expect.hasAssertions();

      const type = schema.getQueryType()!.getFields();

      expect(isDeprecated(type.getStudyItem)).toBeTruthy();
    });

    test("return true is the type has isDeprecated = true", () => {
      expect.hasAssertions();

      expect(isDeprecated({ isDeprecated: true })).toBeTruthy();
    });
  });
});
