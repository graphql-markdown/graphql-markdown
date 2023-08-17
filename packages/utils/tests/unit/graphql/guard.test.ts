import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import type { GraphQLSchema } from "graphql";
import { buildSchema, GraphQLObjectType } from "graphql";

import {
  getIntrospectionFieldsList,
  getTypeFromSchema,
} from "../../../src/graphql/introspection";
import {
  isDeprecated,
  isOperation,
  isParametrizedField,
} from "../../../src/graphql/guard";

const SCHEMA_FILE = require.resolve("../../__data__/tweet.graphql");

describe("graphql", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await gqlToolsLoadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
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
