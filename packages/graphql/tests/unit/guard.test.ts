import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import type { GraphQLSchema } from "graphql";
import { buildSchema, GraphQLObjectType } from "graphql";

import { getOperation, getTypeFromSchema } from "../../src/introspection";
import { isDeprecated, isOperation, isGraphQLFieldType } from "../../src/guard";

const SCHEMA_FILE = require.resolve("../__data__/tweet.graphql");

describe("graphql", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await gqlToolsLoadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
    });
  });

  describe("isGraphQLFieldType()", () => {
    test("returns true if type is parametrized", () => {
      expect.hasAssertions();

      const mutations = getOperation(schema.getMutationType());
      const res = isGraphQLFieldType(mutations["createTweet"]);

      expect(res).toBeTruthy();
    });

    test("returns false if type is not parametrized", () => {
      expect.hasAssertions();

      const queries = getOperation(schema.getQueryType());
      const res = isGraphQLFieldType(queries["TweetsMeta"]);

      expect(res).toBeFalsy();
    });
  });

  describe("isOperation()", () => {
    test("returns true if type is mutation", () => {
      expect.hasAssertions();

      const mutations = getOperation(schema.getMutationType());

      expect(isOperation(mutations["createTweet"])).toBeTruthy();
    });

    test("returns true if type is query", () => {
      expect.hasAssertions();

      const queries = getOperation(schema.getQueryType());

      expect(isOperation(queries["Tweets"])).toBeTruthy();
    });

    test("returns true if type is subscription", () => {
      expect.hasAssertions();

      const subscriptions = getOperation(schema.getSubscriptionType());

      expect(isOperation(subscriptions["Notifications"])).toBeTruthy();
    });

    test("returns false if type is not an operation", () => {
      expect.hasAssertions();

      const objects = getTypeFromSchema<GraphQLObjectType>(
        schema,
        GraphQLObjectType,
      )!;

      expect(isOperation(objects["Tweet"])).toBeFalsy();
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
