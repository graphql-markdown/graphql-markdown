import t from "tap";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import {
  GraphQLInputField,
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
  // GraphQLInputObjectTypeConfig,
  // GraphQLInputFieldConfig,
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
  getLoader,
  ModuleName,
  ClassName,
  LoadersType,
} from "../../src/graphql";
import { ObjMap } from "graphql/jsutils/ObjMap";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_FILE = path.resolve(__dirname, "../__data__/tweet.graphql");
const SCHEMA_CUSTOM_ROOT_FILE = path.resolve(
  __dirname,
  "../__data__/schema_with_custom_root_types.graphql"
);

(t as any).snapshotFile = path.resolve(
  __dirname,
  "..",
  "__snapshots__",
  "graphql.test.cjs"
);

t.test("graphql", async () => {
  let schema: GraphQLSchema;
  const fileLoader = new GraphQLFileLoader();

  t.beforeEach(async () => {
    schema = await gqlToolsLoadSchema(SCHEMA_FILE, {
      loaders: [fileLoader],
    });
  });

  t.test("loadSchema()", async () => {
    t.test("returns valid schema", async () => {
      const testSchema = await loadSchema(SCHEMA_FILE, {
        loaders: [fileLoader],
      });
      t.equal(JSON.stringify(testSchema), JSON.stringify(schema));
    });

    t.test("returns valid schema with custom root type", async () => {
      const testSchema = await loadSchema(SCHEMA_CUSTOM_ROOT_FILE, {
        loaders: [fileLoader],
        rootTypes: { query: "Root", subscription: "" },
      });

      t.equal(testSchema.getQueryType()?.name, "Root");
      t.equal(testSchema.getMutationType(), undefined);
      t.equal(testSchema.getSubscriptionType(), undefined);
    });
  });

  t.test("getLoader()", async () => {
    t.test("returns loader", async () => {
      const documentLoader = "@graphql-tools/graphql-file-loader" as ModuleName;
      const { loader, options } = await getLoader(
        "GraphQLFileLoader" as ClassName,
        documentLoader
      );

      t.same(loader, fileLoader);
      t.same(options, undefined);
    });
  });

  t.test("getDocumentLoaders()", async () => {
    t.test(
      "returns loaders when plugin config loaders format is a string",
      async () => {
        const loaders = {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
        } as LoadersType;
        const { loaders: documentLoaders, loaderOptions } =
          await getDocumentLoaders(loaders);

        t.same(documentLoaders, [fileLoader]);
        t.same(loaderOptions, {});
      }
    );

    t.test(
      "returns loaders and configuration when plugin config loaders format is an object",
      async () => {
        const loaders = {
          GraphQLFileLoader: {
            module: "@graphql-tools/graphql-file-loader",
            options: {
              option1: true,
            },
          },
        } as LoadersType;
        const { loaders: documentLoaders, loaderOptions } =
          await getDocumentLoaders(loaders);

        t.same(documentLoaders, [fileLoader]);
        t.same(loaderOptions, {
          option1: true,
        });
      }
    );
  });

  // covers printDefaultValue()
  t.test("getDefaultValue()", async () => {
    const data: any[] = [
      { type: GraphQLInt, defaultValue: 5, expected: 5 },
      { type: GraphQLInt, defaultValue: 0, expected: 0 },
      { type: GraphQLFloat, defaultValue: 5.3, expected: 5.3 },
      { type: GraphQLFloat, defaultValue: 0.0, expected: 0.0 },
      { type: GraphQLBoolean, defaultValue: true, expected: true },
      { type: GraphQLBoolean, defaultValue: false, expected: false },
      { type: GraphQLInt, defaultValue: undefined, expected: undefined },
      { type: GraphQLID, defaultValue: undefined, expected: undefined },
      { type: GraphQLFloat, defaultValue: undefined, expected: undefined },
      { type: GraphQLString, defaultValue: undefined, expected: undefined },
      { type: GraphQLBoolean, defaultValue: undefined, expected: undefined },
      {
        type: new GraphQLList(GraphQLID),
        defaultValue: undefined,
        expected: undefined,
      },
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
    ];

    data.map(async ({ type, defaultValue, expected }) =>
      t.test(`returns ${expected} value as default for ${type}`, async () => {
        const argument = {
              description: undefined,
              defaultValue,
              type,
            } as GraphQLInputField;

        t.equal(getDefaultValue(argument), expected);
      })
    );

    t.test(
      "returns unformatted default value for type GraphQLEnum",
      async () => {
        const enumType = new GraphQLEnumType({
          name: "RGB",
          values: {
            RED: { value: "RED" },
            GREEN: { value: "GREEN" },
            BLUE: { value: "BLUE" },
          },
        });

        const argument = {
          description: undefined,
          type: enumType,
          defaultValue: "RED"
        }  as GraphQLInputField;

        t.equal(getDefaultValue(argument), "RED");
      }
    );

    t.test(
      "returns array default value unformatted for type GraphQLList(GraphQLEnum)",
      async () => {
        const enumType = new GraphQLEnumType({
          name: "RGB",
          values: {
            RED: { value: "RED" },
            GREEN: { value: "GREEN" },
            BLUE: { value: "BLUE" },
          },
        });

        const argument = {
          description: undefined,
          type: new GraphQLList(enumType),
          defaultValue: ["RED"],
        } as GraphQLInputField;

        t.equal(getDefaultValue(argument), "[RED]");
      }
    );
  });

  t.test("getIntrospectionFieldsList()", async () => {
    t.test("returns list of queries", async () => {
      const list = getIntrospectionFieldsList(schema.getQueryType());

      t.matchSnapshot(JSON.stringify(list, null, 2), "returns list of queries");
    });

    t.test("returns list of mutations", async () => {
      const list = getIntrospectionFieldsList(schema.getMutationType());

      t.matchSnapshot(JSON.stringify(list, null, 2), "returns list of mutations");
    });

    t.test("returns list of subscriptions", async () => {
      const list = getIntrospectionFieldsList(schema.getSubscriptionType());

      t.matchSnapshot(JSON.stringify(list, null, 2), "returns list of subscriptions");
    });

    t.test("returns undefined if null", async () => {
      const list = getIntrospectionFieldsList(null);

      t.equal(list, undefined);
    });
  });

  t.test("getFields()", async () => {
    t.test("returns list of type fields", async () => {
      const fields = getFields(schema.getMutationType() as GraphQLType);

      t.matchSnapshot(JSON.stringify(fields, null, 2), "returns list of type fields");
    });

    t.test("returns empty list if getFields not supported", async () => {
      const fields = getFields({} as GraphQLType);

      t.strictSame(fields, []);
    });
  });

  t.test("getTypeName()", async () => {
    t.test("returns type name for object", async () => {
      const name = getTypeName(schema.getType("Tweet") as GraphQLNamedType);

      t.equal(name, "Tweet");
    });

    t.test("returns type name for interface", async () => {
      const name = getTypeName(schema.getType("Node") as GraphQLNamedType);

      t.equal(name, "Node");
    });

    t.test("returns type name for scalar", async () => {
      const name = getTypeName(schema.getType("ID") as GraphQLNamedType);

      t.equal(name, "ID");
    });

    t.test("returns default name for unknown", async () => {
      const name = getTypeName(undefined as any, "FooBar");

      t.equal(name, "FooBar");
    });
  });

  t.test("getTypeFromSchema()", async () => {
    t.test("returns a filter map filtered by GraphQLObjectType", async () => {
      const map = getTypeFromSchema(schema, GraphQLObjectType);

      t.matchSnapshot(JSON.stringify(map, null, 2), "returns a filter map filtered by GraphQLObjectType");
    });

    t.test("returns a filter map filtered by GraphQLUnionType", async () => {
      const map = getTypeFromSchema(schema, GraphQLUnionType);

      t.matchSnapshot(JSON.stringify(map, null, 2), "returns a filter map filtered by GraphQLUnionType");
    });

    t.test(
      "returns a filter map filtered by GraphQLInterfaceType",
      async () => {
        const map = getTypeFromSchema(schema, GraphQLInterfaceType);

        t.matchSnapshot(JSON.stringify(map, null, 2), "returns a filter map filtered by GraphQLInterfaceType");
      }
    );

    t.test("returns a filter map filtered by GraphQLEnumType", async () => {
      const map = getTypeFromSchema(schema, GraphQLEnumType);

      t.matchSnapshot(JSON.stringify(map, null, 2), "returns a filter map filtered by GraphQLEnumType");
    });

    t.test(
      "returns a filter map filtered by GraphQLInputObjectType",
      async () => {
        const map = getTypeFromSchema(schema, GraphQLInputObjectType);

        t.matchSnapshot(JSON.stringify(map, null, 2), "returns a filter map filtered by GraphQLInputObjectType");
      }
    );

    t.test("returns a filter map filtered by GraphQLScalarType", async () => {
      const map = getTypeFromSchema(schema, GraphQLScalarType);

      t.matchSnapshot(JSON.stringify(map, null, 2), "returns a filter map filtered by GraphQLScalarType");
    });
  });

  t.test("getSchemaMap()", async () => {
    t.test("returns schema types map", async () => {
      const schemaTypeMap = getSchemaMap(schema);

      t.matchSnapshot(JSON.stringify(schemaTypeMap, null, 2), "returns schema types map");
    });

    t.test("returns schema types map with custom root types", async () => {
      const testSchema = await loadSchema(SCHEMA_CUSTOM_ROOT_FILE, {
        loaders: [new GraphQLFileLoader()],
        rootTypes: { query: "Root", subscription: "" },
      });

      const schemaTypeMap = getSchemaMap(testSchema);

      t.matchSnapshot(JSON.stringify(schemaTypeMap, null, 2), "returns schema types map with custom root types");
    });
  });

  t.test("isParametrizedField()", async () => {
    t.test("returns true if type is parametrized", async () => {
      const mutations = getIntrospectionFieldsList(
        schema.getMutationType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;

      t.ok(isParametrizedField(mutations["createTweet"]));
    });

    t.test("returns false if type is not parametrized", async () => {
      const queries = getIntrospectionFieldsList(
        schema.getQueryType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;

      t.notOk(isParametrizedField(queries["TweetsMeta"]));
    });
  });

  t.test("isOperation()", async () => {
    t.test("returns true if type is mutation", async () => {
      const mutations = getIntrospectionFieldsList(
        schema.getMutationType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      t.ok(isOperation(mutations["createTweet"]));
    });

    t.test("returns true if type is query", async () => {
      const queries = getIntrospectionFieldsList(
        schema.getQueryType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;
      t.ok(isOperation(queries["Tweets"]));
    });

    t.test("returns true if type is subscription", async () => {
      const subscriptions = getIntrospectionFieldsList(
        schema.getSubscriptionType()
      ) as ObjMap<GraphQLField<unknown, unknown, unknown>>;

      t.ok(isOperation(subscriptions["Notifications"]));
    });

    t.test("returns false if type is not an operation", async () => {
      const objects = getTypeFromSchema(schema, GraphQLObjectType);

      t.notOk(isOperation(objects["Tweet"]));
    });
  });

  t.test("getRelationOfInterface()", async () => {
    t.test("returns types and interfaces extending an interface", async () => {
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

      t.matchSnapshot(JSON.stringify(relations, null, 2), "returns types and interfaces extending an interface");
    });
  });

  t.test("getRelationOfUnion", async () => {
    t.test("returns unions using a type", async () => {
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

      t.matchSnapshot(JSON.stringify(relations, null, 2), "returns unions using a type");
    });
  });

  t.test("getRelationOfImplementation", async () => {
    t.test("returns implementations compatible with type", async () => {
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

      t.matchSnapshot(JSON.stringify(relations, null, 2), "returns implementations compatible with type");
    });
  });

  t.test("getRelationOfReturn", async () => {
    t.test(
      "returns queries, subscriptions and mutations using a type",
      async () => {
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

        t.matchSnapshot(JSON.stringify(relations, null, 2), "returns queries, subscriptions and mutations using a type");
      }
    );
  });

  t.test("getRelationOfField", async () => {
    t.test(
      "returns queries, subscriptions and mutations using a type",
      async () => {
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

        t.matchSnapshot(JSON.stringify(relations, null, 2), "returns queries, subscriptions and mutations using a type");
      }
    );
  });
});
