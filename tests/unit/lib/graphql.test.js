const path = require("path");

const { loadSchema } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const {
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
} = require("graphql");

const {
  getDefaultValue,
  getFilteredTypeMap,
  getIntrospectionFieldsList,
  getFields,
  getTypeName,
  getTypeFromTypeMap,
  getSchemaMap,
  isParametrizedField,
  isOperation,
  getDocumentLoaders,
  getRelationOfInterface,
  getRelationOfUnion,
  getRelationOfReturn,
  getRelationOfField,
} = require("../../../src/lib/graphql");

const SCHEMA_FILE = require.resolve("../../__data__/tweet.graphql");

const EXPECT_PATH = path.join(
  __dirname,
  "__expect__",
  __OS__,
  path.basename(__filename),
);

describe("lib", () => {
  describe("graphql", () => {
    let schema;

    beforeAll(async () => {
      schema = await loadSchema(SCHEMA_FILE, {
        loaders: [new GraphQLFileLoader()],
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
    describe("getDefaultValue()", () => {
      test.each([
        { type: GraphQLInt, value: 5 },
        { type: GraphQLInt, value: 0 },
        { type: GraphQLFloat, value: 5.3 },
        { type: GraphQLFloat, value: 0.0 },
        { type: GraphQLBoolean, value: true },
        { type: GraphQLBoolean, value: false },
      ])("returns $value value as default for $type", ({ type, value }) => {
        expect.hasAssertions();

        const argument = {
          name: "foobar",
          description: undefined,
          type: type,
          defaultValue: value,
          extensions: undefined,
        };

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

          const argument = {
            name: "foobar",
            description: undefined,
            type: type,
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

    describe("getFilteredTypeMap()", () => {
      test("returns a filtered map of schema types", () => {
        expect.hasAssertions();

        const schemaTypeMap = getFilteredTypeMap(schema.getTypeMap());

        expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getFilteredTypeMap.json`),
        );
      });

      test.each([[undefined], [null]])(
        "returns undefined if typeMap is not defined",
        (typeMap) => {
          expect.hasAssertions();

          const schemaTypeMap = getFilteredTypeMap(typeMap);

          expect(schemaTypeMap).toBeUndefined();
        },
      );
    });

    describe("getIntrospectionFieldsList()", () => {
      test("returns list of queries", () => {
        expect.hasAssertions();

        const list = getIntrospectionFieldsList(schema.getQueryType());

        expect(JSON.stringify(list, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getIntrospectionFieldsListQueries.json`),
        );
      });

      test("returns list of mutations", () => {
        expect.hasAssertions();

        const list = getIntrospectionFieldsList(schema.getMutationType());

        expect(JSON.stringify(list, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getIntrospectionFieldsListMutations.json`),
        );
      });

      test("returns list of subscriptions", () => {
        expect.hasAssertions();

        const list = getIntrospectionFieldsList(schema.getSubscriptionType());

        expect(JSON.stringify(list, null, 2)).toMatchFile(
          path.join(
            EXPECT_PATH,
            `getIntrospectionFieldsListSubscriptions.json`,
          ),
        );
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

        const fields = getFields(schema.getMutationType());

        expect(JSON.stringify(fields, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getFields.json`),
        );
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

        const name = getTypeName(schema.getType("Tweet"));

        expect(name).toBe("Tweet");
      });

      test("returns type name for interface", () => {
        expect.hasAssertions();

        const name = getTypeName(schema.getType("Node"));

        expect(name).toBe("Node");
      });

      test("returns type name for scalar", () => {
        expect.hasAssertions();

        const name = getTypeName(schema.getType("ID"));

        expect(name).toBe("ID");
      });

      test("returns default name for unknown", () => {
        expect.hasAssertions();

        const name = getTypeName({ toString: undefined }, "FooBar");

        expect(name).toBe("FooBar");
      });
    });

    describe("getTypeFromTypeMap()", () => {
      test("returns a filter map filtered by GraphQLObjectType", () => {
        expect.hasAssertions();

        const map = getTypeFromTypeMap(schema.getTypeMap(), GraphQLObjectType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLObjectType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLUnionType", () => {
        expect.hasAssertions();

        const map = getTypeFromTypeMap(schema.getTypeMap(), GraphQLUnionType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLUnionType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLInterfaceType", () => {
        expect.hasAssertions();

        const map = getTypeFromTypeMap(
          schema.getTypeMap(),
          GraphQLInterfaceType,
        );

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLInterfaceType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLEnumType", () => {
        expect.hasAssertions();

        const map = getTypeFromTypeMap(schema.getTypeMap(), GraphQLEnumType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLEnumType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLInputObjectType", () => {
        expect.hasAssertions();

        const map = getTypeFromTypeMap(
          schema.getTypeMap(),
          GraphQLInputObjectType,
        );

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(
            EXPECT_PATH,
            `getTypeFromTypeMapGraphQLInputObjectType.json`,
          ),
        );
      });

      test("returns a filter map filtered by GraphQLScalarType", () => {
        expect.hasAssertions();

        const map = getTypeFromTypeMap(schema.getTypeMap(), GraphQLScalarType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLScalarType.json`),
        );
      });

      test.each([[null], [undefined]])(
        "returns undefined it typeMap is not defined",
        (typeMap) => {
          expect.hasAssertions();

          const map = getTypeFromTypeMap(typeMap, GraphQLScalarType);

          expect(map).toBeUndefined();
        },
      );
    });

    describe("getSchemaMap()", () => {
      test("returns schema types map", () => {
        expect.hasAssertions();

        const schemaTypeMap = getSchemaMap(schema);

        expect(JSON.stringify(schemaTypeMap, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getSchemaMap.json`),
        );
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

        const objects = getTypeFromTypeMap(
          schema.getTypeMap(),
          GraphQLObjectType,
        );
        const res = isOperation(objects["Tweet"]);

        expect(res).toBeFalsy();
      });
    });
  });

  describe("getRelationOfInterface", () => {
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

      const interfaceType = schema.getType("Mammal");

      const relations = getRelationOfInterface(interfaceType, schema);

      expect(relations).toMatchInlineSnapshot(`
        Object {
          "interfaces": Array [
            "Canine",
          ],
          "objects": Array [
            "Dog",
          ],
        }
      `);
    });
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

      const compositeType = schema.getType("Meeting");

      const relations = getRelationOfUnion(compositeType, schema);

      expect(relations).toMatchInlineSnapshot(`
        Object {
          "unions": Array [
            "Task",
          ],
        }
      `);
    });
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

      const compositeType = schema.getType("StudyItem");

      const relations = getRelationOfReturn(compositeType, schema);

      expect(relations).toMatchInlineSnapshot(`
        Object {
          "mutations": Array [
            "addStudyItem",
          ],
          "queries": Array [
            "getStudyItems",
            "getStudyItem",
          ],
          "subscriptions": Array [
            "listStudyItems",
          ],
        }
      `);
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

      const compositeType = schema.getType("String");

      const relations = getRelationOfField(compositeType, schema);

      expect(relations).toMatchInlineSnapshot(`
        Object {
          "directives": Array [],
          "inputs": Array [],
          "interfaces": Array [
            "Record",
          ],
          "mutations": Array [
            "addStudyItem",
          ],
          "objects": Array [
            "StudyItem",
          ],
          "queries": Array [
            "getStudyItems",
            "getStudyItem",
          ],
          "subscriptions": Array [],
        }
      `);
    });
  });
});
