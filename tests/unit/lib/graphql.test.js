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

    describe("getDocumentLoaders", () => {
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

    describe("getDefaultValue()", () => {
      test.each([
        { type: GraphQLInt, value: 5 },
        { type: GraphQLInt, value: 0 },
        { type: GraphQLFloat, value: 5.3 },
        { type: GraphQLFloat, value: 0.0 },
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

      test("returns array default value as string for type GraphQLList(GraphQLID)", () => {
        expect.hasAssertions();

        const argument = {
          name: "id",
          description: undefined,
          type: new GraphQLList(GraphQLID),
          defaultValue: ["0", "1"],
          extensions: undefined,
        };

        expect(getDefaultValue(argument)).toBe('["0", "1"]');
      });

      test("returns array default value as string for type GraphQLList(GraphQLInt)", () => {
        expect.hasAssertions();

        const argument = {
          name: "foobar",
          description: undefined,
          type: new GraphQLList(GraphQLInt),
          defaultValue: [0, 1],
          extensions: undefined,
        };

        expect(getDefaultValue(argument)).toBe("[0, 1]");
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
});
