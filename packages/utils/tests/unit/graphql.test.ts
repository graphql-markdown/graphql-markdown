import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import {
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLID,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  buildSchema,
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLType,
  GraphQLField,
  GraphQLInputObjectTypeConfig,
  GraphQLInputFieldConfig,
} from "graphql";

import {
  getDefaultValue,
  getIntrospectionFieldsList,
  getFields,
  getTypeName,
  getTypeFromSchema,
  getSchemaMap,
  loadSchema,
  isParametrizedField,
  isOperation,
  getDocumentLoaders,
  getRelationOfInterface,
  getRelationOfUnion,
  getRelationOfReturn,
  getRelationOfField,
  getRelationOfImplementation,
} from "../../src/graphql";
import { ObjMap } from "graphql/jsutils/ObjMap";

const SCHEMA_FILE = require.resolve("../__data__/tweet.graphql");
const SCHEMA_CUSTOM_ROOT_FILE = require.resolve(
  "../__data__/schema_with_custom_root_types.graphql"
);

describe("graphql", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await gqlToolsLoadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
    });
  });

  describe("loadSchema()", () => {
    test("returns valid schema", async () => {
      const testSchema = await loadSchema(SCHEMA_FILE, {
        loaders: [new GraphQLFileLoader()],
      });
      expect(JSON.stringify(testSchema)).toBe(JSON.stringify(schema));
    });

    test("returns valid schema with custom root type", async () => {
      const testSchema = await loadSchema(SCHEMA_CUSTOM_ROOT_FILE, {
        loaders: [new GraphQLFileLoader()],
        rootTypes: { query: "Root", subscription: "" },
      });

      expect(testSchema.getQueryType()?.name).toBe("Root");
      expect(testSchema.getMutationType()).toBeUndefined();
      expect(testSchema.getSubscriptionType()).toBeUndefined();
    });
  });

  describe("getDocumentLoaders()", () => {
    test("returns loaders when plugin config loaders format is a string", () => {
      const loaders = {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
      };
      const { loaders: documentLoaders, loaderOptions } =
        getDocumentLoaders(loaders);

      expect(documentLoaders).toMatchObject([new GraphQLFileLoader()]);
      expect(loaderOptions).toMatchObject({});
    });

    test("returns loaders and configuration when plugin config loaders format is an object", () => {
      const loaders = {
        GraphQLFileLoader: {
          module: "@graphql-tools/graphql-file-loader",
          options: {
            option1: true,
          },
        },
      };
      const { loaders: documentLoaders, loaderOptions } =
        getDocumentLoaders(loaders);

      expect(documentLoaders).toMatchObject([new GraphQLFileLoader()]);
      expect(loaderOptions).toMatchObject({
        option1: true,
      });
    });
  });

  // covers printDefaultValue()
  describe.skip("getDefaultValue()", () => {
    test.each([
      { type: GraphQLInt, value: 5 },
      { type: GraphQLInt, value: 0 },
      { type: GraphQLFloat, value: 5.3 },
      { type: GraphQLFloat, value: 0.0 },
      { type: GraphQLBoolean, value: true },
      { type: GraphQLBoolean, value: false },
    ])("returns $value value as default for $type", ({ type, value }) => {
      expect.hasAssertions();

      const argument = new GraphQLInputObjectType({
        name: "foobar",
        description: undefined,
        defaultValue: value,
        type,
        fields: {} as ObjMap<GraphQLInputFieldConfig>,
      } as GraphQLInputObjectTypeConfig);

      expect(getDefaultValue(argument)).toEqual(value);
    });

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

        const argument = new GraphQLInputObjectType({
          name: "foobar",
          description: undefined,
          type: type,
          defaultValue: undefined,
          extensions: undefined,
          fields: {} as ObjMap<GraphQLInputFieldConfig>,
        } as GraphQLInputObjectTypeConfig);

        expect(getDefaultValue(argument)).toBeUndefined();
      }
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

        const argument = new GraphQLInputObjectType({
          name: "id",
          description: undefined,
          type,
          defaultValue,
          fields: {} as ObjMap<GraphQLInputFieldConfig>,
        } as GraphQLInputObjectTypeConfig);

        expect(getDefaultValue(argument)).toBe(expected);
      }
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

      const argument = new GraphQLInputObjectType({
        name: "color",
        description: undefined,
        type: enumType,
        defaultValue: "RED",
        extensions: undefined,
        fields: {} as ObjMap<GraphQLInputFieldConfig>,
      } as GraphQLInputObjectTypeConfig);

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

      const argument = new GraphQLInputObjectType({
        name: "color",
        description: undefined,
        type: new GraphQLList(enumType),
        defaultValue: ["RED"],
        extensions: undefined,
        fields: {} as ObjMap<GraphQLInputFieldConfig>,
      } as GraphQLInputObjectTypeConfig);

      expect(getDefaultValue(argument)).toBe("[RED]");
    });
  });

  describe("getIntrospectionFieldsList()", () => {
    test("returns list of queries", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(schema.getQueryType());

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns list of mutations", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(schema.getMutationType());

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns list of subscriptions", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(schema.getSubscriptionType());

      expect(JSON.stringify(list, null, 2)).toMatchSnapshot();
    });

    test("returns undefined if null", () => {
      expect.hasAssertions();

      const list = getIntrospectionFieldsList(null);

      expect(list).toBeUndefined();
    });
  });

  describe("getFields()", () => {
    test("returns list of type fields", () => {
      expect.hasAssertions();

      const fields = getFields(schema.getMutationType() as GraphQLType);

      expect(JSON.stringify(fields, null, 2)).toMatchSnapshot();
    });

    test("returns empty list if getFields not supported", () => {
      expect.hasAssertions();

      const fields = getFields({} as GraphQLType);

      expect(fields).toStrictEqual([]);
    });
  });

  describe("getTypeName()", () => {
    test("returns type name for object", () => {
      expect.hasAssertions();

      const name = getTypeName(schema.getType("Tweet") as GraphQLNamedType);

      expect(name).toBe("Tweet");
    });

    test("returns type name for interface", () => {
      expect.hasAssertions();

      const name = getTypeName(schema.getType("Node") as GraphQLNamedType);

      expect(name).toBe("Node");
    });

    test("returns type name for scalar", () => {
      expect.hasAssertions();

      const name = getTypeName(schema.getType("ID") as GraphQLNamedType);

      expect(name).toBe("ID");
    });

    test("returns default name for unknown", () => {
      expect.hasAssertions();

      const name = getTypeName({} as GraphQLNamedType, "FooBar");

      expect(name).toBe("FooBar");
    });
  });

  describe("getTypeFromSchema()", () => {
    test("returns a filter map filtered by GraphQLObjectType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema(schema, GraphQLObjectType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLUnionType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema(schema, GraphQLUnionType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLInterfaceType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema(schema, GraphQLInterfaceType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLEnumType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema(schema, GraphQLEnumType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLInputObjectType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema(schema, GraphQLInputObjectType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });

    test("returns a filter map filtered by GraphQLScalarType", () => {
      expect.hasAssertions();

      const map = getTypeFromSchema(schema, GraphQLScalarType);

      expect(JSON.stringify(map, null, 2)).toMatchSnapshot();
    });
  });

  describe("getSchemaMap()", () => {
    test("returns schema types map", () => {
      expect.hasAssertions();

      const schemaTypeMap = getSchemaMap(schema);

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

      const mutations = getIntrospectionFieldsList(
        schema.getMutationType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      const res = isParametrizedField(mutations["createTweet"]);

      expect(res).toBeTruthy();
    });

    test("returns false if type is not parametrized", () => {
      expect.hasAssertions();

      const queries = getIntrospectionFieldsList(
        schema.getQueryType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      const res = isParametrizedField(queries["TweetsMeta"]);

      expect(res).toBeFalsy();
    });
  });

  describe("isOperation()", () => {
    test("returns true if type is mutation", () => {
      expect.hasAssertions();

      const mutations = getIntrospectionFieldsList(
        schema.getMutationType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      const res = isOperation(mutations["createTweet"]);

      expect(res).toBeTruthy();
    });

    test("returns true if type is query", () => {
      expect.hasAssertions();

      const queries = getIntrospectionFieldsList(
        schema.getQueryType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      const res = isOperation(queries["Tweets"]);

      expect(res).toBeTruthy();
    });

    test("returns true if type is subscription", () => {
      expect.hasAssertions();

      const subscriptions = getIntrospectionFieldsList(
        schema.getSubscriptionType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      const res = isOperation(subscriptions["Notifications"]);

      expect(res).toBeTruthy();
    });

    test("returns false if type is not an operation", () => {
      expect.hasAssertions();

      const objects = getTypeFromSchema(schema, GraphQLObjectType);
      const res = isOperation(objects["Tweet"]);

      expect(res).toBeFalsy();
    });
  });
});

describe("getRelationOfInterface()", () => {
  test("returns types and interfaces extending an interface", () => {
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

    const interfaceType = schema.getType("Mammal") as GraphQLNamedType;

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

  describe("getRelationOfUnion", () => {
    test("returns unions using a type", () => {
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

      const compositeType = schema.getType("Meeting") as GraphQLNamedType;

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

      const compositeType = schema.getType("Being") as GraphQLNamedType;

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

    describe("getRelationOfReturn", () => {
      test("returns queries, subscriptions and mutations using a type", () => {
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

        const compositeType = schema.getType("StudyItem") as GraphQLNamedType;

        const relations = getRelationOfReturn(compositeType, schema);

        expect(relations).toMatchSnapshot();
      });
    });

    describe("getRelationOfField", () => {
      test("returns queries, subscriptions and mutations using a type", () => {
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

        const compositeType = schema.getType("String") as GraphQLNamedType;

        const relations = getRelationOfField(compositeType, schema);

        expect(relations).toMatchSnapshot();
      });
    });
  });
});
