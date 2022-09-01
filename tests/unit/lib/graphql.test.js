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
  getTypeFromSchema,
  getSchemaMap,
  isParametrizedField,
  isOperation,
  getDocumentLoaders,
  getRelationOfInterface,
  getRelationOfUnion,
  getRelationOfReturn,
  getRelationOfField,
  getRelationOfImplementation,
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

        const schemaTypeMap = getFilteredTypeMap(schema);

        expect(schemaTypeMap).toMatchInlineSnapshot(`
          {
            "Boolean": "Boolean",
            "Date": "Date",
            "ID": "ID",
            "Int": "Int",
            "Media": "Media",
            "Meta": "Meta",
            "Node": "Node",
            "Notification": "Notification",
            "SRI": "SRI",
            "Stat": "Stat",
            "String": "String",
            "Tweet": "Tweet",
            "TweetContent": "TweetContent",
            "Url": "Url",
            "User": "User",
          }
        `);
      });

      test.each([[undefined], [null]])(
        "returns undefined if schema is not defined",
        (schema) => {
          expect.hasAssertions();

          const schemaTypeMap = getFilteredTypeMap(schema);

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

    describe("getTypeFromSchema()", () => {
      test("returns a filter map filtered by GraphQLObjectType", () => {
        expect.hasAssertions();

        const map = getTypeFromSchema(schema, GraphQLObjectType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLObjectType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLUnionType", () => {
        expect.hasAssertions();

        const map = getTypeFromSchema(schema, GraphQLUnionType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLUnionType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLInterfaceType", () => {
        expect.hasAssertions();

        const map = getTypeFromSchema(schema, GraphQLInterfaceType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLInterfaceType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLEnumType", () => {
        expect.hasAssertions();

        const map = getTypeFromSchema(schema, GraphQLEnumType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLEnumType.json`),
        );
      });

      test("returns a filter map filtered by GraphQLInputObjectType", () => {
        expect.hasAssertions();

        const map = getTypeFromSchema(schema, GraphQLInputObjectType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(
            EXPECT_PATH,
            `getTypeFromTypeMapGraphQLInputObjectType.json`,
          ),
        );
      });

      test("returns a filter map filtered by GraphQLScalarType", () => {
        expect.hasAssertions();

        const map = getTypeFromSchema(schema, GraphQLScalarType);

        expect(JSON.stringify(map, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `getTypeFromTypeMapGraphQLScalarType.json`),
        );
      });

      test.each([[null], [undefined]])(
        "returns undefined it typeMap is not defined",
        (typeMap) => {
          expect.hasAssertions();

          const map = getTypeFromSchema(typeMap, GraphQLScalarType);

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

        const objects = getTypeFromSchema(schema, GraphQLObjectType);
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
        {
          "mutations": [
            {
              "args": [
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 308,
                      "start": 292,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 299,
                        "start": 292,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 308,
                        "start": 301,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 307,
                          "start": 301,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 307,
                            "start": 301,
                          },
                          "value": "String",
                        },
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "subject",
                  "type": "String!",
                },
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 324,
                      "start": 310,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 318,
                        "start": 310,
                      },
                      "value": "duration",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 324,
                        "start": 320,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 323,
                          "start": 320,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 323,
                            "start": 320,
                          },
                          "value": "Int",
                        },
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "duration",
                  "type": "Int!",
                },
              ],
              "astNode": {
                "arguments": [
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 308,
                      "start": 292,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 299,
                        "start": 292,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 308,
                        "start": 301,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 307,
                          "start": 301,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 307,
                            "start": 301,
                          },
                          "value": "String",
                        },
                      },
                    },
                  },
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 324,
                      "start": 310,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 318,
                        "start": 310,
                      },
                      "value": "duration",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 324,
                        "start": 320,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 323,
                          "start": 320,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 323,
                            "start": 320,
                          },
                          "value": "Int",
                        },
                      },
                    },
                  },
                ],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 336,
                  "start": 279,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 291,
                    "start": 279,
                  },
                  "value": "addStudyItem",
                },
                "type": {
                  "kind": "NamedType",
                  "loc": {
                    "end": 336,
                    "start": 327,
                  },
                  "name": {
                    "kind": "Name",
                    "loc": {
                      "end": 336,
                      "start": 327,
                    },
                    "value": "StudyItem",
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "addStudyItem",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "StudyItem",
            },
          ],
          "queries": [
            {
              "args": [
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 175,
                      "start": 160,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 167,
                        "start": 160,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 175,
                        "start": 169,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 175,
                          "start": 169,
                        },
                        "value": "String",
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "subject",
                  "type": "String",
                },
              ],
              "astNode": {
                "arguments": [
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 175,
                      "start": 160,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 167,
                        "start": 160,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 175,
                        "start": 169,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 175,
                          "start": 169,
                        },
                        "value": "String",
                      },
                    },
                  },
                ],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 190,
                  "start": 146,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 159,
                    "start": 146,
                  },
                  "value": "getStudyItems",
                },
                "type": {
                  "kind": "ListType",
                  "loc": {
                    "end": 190,
                    "start": 178,
                  },
                  "type": {
                    "kind": "NonNullType",
                    "loc": {
                      "end": 189,
                      "start": 179,
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 188,
                        "start": 179,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 188,
                          "start": 179,
                        },
                        "value": "StudyItem",
                      },
                    },
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "getStudyItems",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "[StudyItem!]",
            },
            {
              "args": [
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 221,
                      "start": 214,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 216,
                        "start": 214,
                      },
                      "value": "id",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 221,
                        "start": 218,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 220,
                          "start": 218,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 220,
                            "start": 218,
                          },
                          "value": "ID",
                        },
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "id",
                  "type": "ID!",
                },
              ],
              "astNode": {
                "arguments": [
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 221,
                      "start": 214,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 216,
                        "start": 214,
                      },
                      "value": "id",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 221,
                        "start": 218,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 220,
                          "start": 218,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 220,
                            "start": 218,
                          },
                          "value": "ID",
                        },
                      },
                    },
                  },
                ],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 233,
                  "start": 201,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 213,
                    "start": 201,
                  },
                  "value": "getStudyItem",
                },
                "type": {
                  "kind": "NamedType",
                  "loc": {
                    "end": 233,
                    "start": 224,
                  },
                  "name": {
                    "kind": "Name",
                    "loc": {
                      "end": 233,
                      "start": 224,
                    },
                    "value": "StudyItem",
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "getStudyItem",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "StudyItem",
            },
          ],
          "subscriptions": [
            {
              "args": [],
              "astNode": {
                "arguments": [],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 418,
                  "start": 390,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 404,
                    "start": 390,
                  },
                  "value": "listStudyItems",
                },
                "type": {
                  "kind": "ListType",
                  "loc": {
                    "end": 418,
                    "start": 406,
                  },
                  "type": {
                    "kind": "NonNullType",
                    "loc": {
                      "end": 417,
                      "start": 407,
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 416,
                        "start": 407,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 416,
                          "start": 407,
                        },
                        "value": "StudyItem",
                      },
                    },
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "listStudyItems",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "[StudyItem!]",
            },
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
        {
          "directives": [
            "@deprecated",
            "@specifiedBy",
          ],
          "inputs": [],
          "interfaces": [
            "Record",
          ],
          "mutations": [
            {
              "args": [
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 394,
                      "start": 378,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 385,
                        "start": 378,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 394,
                        "start": 387,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 393,
                          "start": 387,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 393,
                            "start": 387,
                          },
                          "value": "String",
                        },
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "subject",
                  "type": "String!",
                },
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 410,
                      "start": 396,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 404,
                        "start": 396,
                      },
                      "value": "duration",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 410,
                        "start": 406,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 409,
                          "start": 406,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 409,
                            "start": 406,
                          },
                          "value": "Int",
                        },
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "duration",
                  "type": "Int!",
                },
              ],
              "astNode": {
                "arguments": [
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 394,
                      "start": 378,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 385,
                        "start": 378,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 394,
                        "start": 387,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 393,
                          "start": 387,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 393,
                            "start": 387,
                          },
                          "value": "String",
                        },
                      },
                    },
                  },
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 410,
                      "start": 396,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 404,
                        "start": 396,
                      },
                      "value": "duration",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 410,
                        "start": 406,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 409,
                          "start": 406,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 409,
                            "start": 406,
                          },
                          "value": "Int",
                        },
                      },
                    },
                  },
                ],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 422,
                  "start": 365,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 377,
                    "start": 365,
                  },
                  "value": "addStudyItem",
                },
                "type": {
                  "kind": "NamedType",
                  "loc": {
                    "end": 422,
                    "start": 413,
                  },
                  "name": {
                    "kind": "Name",
                    "loc": {
                      "end": 422,
                      "start": 413,
                    },
                    "value": "StudyItem",
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "addStudyItem",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "StudyItem",
            },
          ],
          "objects": [
            "StudyItem",
          ],
          "queries": [
            {
              "args": [
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 257,
                      "start": 242,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 249,
                        "start": 242,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 257,
                        "start": 251,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 257,
                          "start": 251,
                        },
                        "value": "String",
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "subject",
                  "type": "String",
                },
              ],
              "astNode": {
                "arguments": [
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 257,
                      "start": 242,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 249,
                        "start": 242,
                      },
                      "value": "subject",
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 257,
                        "start": 251,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 257,
                          "start": 251,
                        },
                        "value": "String",
                      },
                    },
                  },
                ],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 272,
                  "start": 228,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 241,
                    "start": 228,
                  },
                  "value": "getStudyItems",
                },
                "type": {
                  "kind": "ListType",
                  "loc": {
                    "end": 272,
                    "start": 260,
                  },
                  "type": {
                    "kind": "NonNullType",
                    "loc": {
                      "end": 271,
                      "start": 261,
                    },
                    "type": {
                      "kind": "NamedType",
                      "loc": {
                        "end": 270,
                        "start": 261,
                      },
                      "name": {
                        "kind": "Name",
                        "loc": {
                          "end": 270,
                          "start": 261,
                        },
                        "value": "StudyItem",
                      },
                    },
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "getStudyItems",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "[StudyItem!]",
            },
            {
              "args": [
                {
                  "astNode": {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 307,
                      "start": 296,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 298,
                        "start": 296,
                      },
                      "value": "id",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 307,
                        "start": 300,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 306,
                          "start": 300,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 306,
                            "start": 300,
                          },
                          "value": "String",
                        },
                      },
                    },
                  },
                  "defaultValue": undefined,
                  "deprecationReason": undefined,
                  "description": undefined,
                  "extensions": {},
                  "name": "id",
                  "type": "String!",
                },
              ],
              "astNode": {
                "arguments": [
                  {
                    "defaultValue": undefined,
                    "description": undefined,
                    "directives": [],
                    "kind": "InputValueDefinition",
                    "loc": {
                      "end": 307,
                      "start": 296,
                    },
                    "name": {
                      "kind": "Name",
                      "loc": {
                        "end": 298,
                        "start": 296,
                      },
                      "value": "id",
                    },
                    "type": {
                      "kind": "NonNullType",
                      "loc": {
                        "end": 307,
                        "start": 300,
                      },
                      "type": {
                        "kind": "NamedType",
                        "loc": {
                          "end": 306,
                          "start": 300,
                        },
                        "name": {
                          "kind": "Name",
                          "loc": {
                            "end": 306,
                            "start": 300,
                          },
                          "value": "String",
                        },
                      },
                    },
                  },
                ],
                "description": undefined,
                "directives": [],
                "kind": "FieldDefinition",
                "loc": {
                  "end": 319,
                  "start": 283,
                },
                "name": {
                  "kind": "Name",
                  "loc": {
                    "end": 295,
                    "start": 283,
                  },
                  "value": "getStudyItem",
                },
                "type": {
                  "kind": "NamedType",
                  "loc": {
                    "end": 319,
                    "start": 310,
                  },
                  "name": {
                    "kind": "Name",
                    "loc": {
                      "end": 319,
                      "start": 310,
                    },
                    "value": "StudyItem",
                  },
                },
              },
              "deprecationReason": undefined,
              "description": undefined,
              "extensions": {},
              "name": "getStudyItem",
              "resolve": undefined,
              "subscribe": undefined,
              "type": "StudyItem",
            },
          ],
          "subscriptions": [],
        }
      `);
    });
  });
});
