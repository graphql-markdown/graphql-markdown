import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import type { GraphQLSchema } from "graphql/type";
import { GraphQLDirective, GraphQLObjectType } from "graphql/type";
import { DirectiveLocation } from "graphql/language";
import { buildSchema } from "graphql/utilities";

import { getOperation, getTypeFromSchema } from "../../src/introspection";
import {
  isDeprecated,
  isOperation,
  isGraphQLFieldType,
  isApiType,
  isSystemType,
  executableDirectiveLocation,
  typeSystemDirectiveLocation,
} from "../../src/guard";

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

  describe("ApiType or SystemType", () => {
    const schema = buildSchema(`
    directive @noDoc on OBJECT | INTERFACE | FIELD_DEFINITION

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
  `);

    const types = [
      {
        gqlType: schema.getQueryType()!.getFields().getStudyItems,
        isApi: true,
        text: "operation",
      },
      {
        gqlType: schema.getDirective("include"),
        isApi: true,
        text: "executable directive",
      },
      {
        gqlType: schema.getDirective("noDoc"),
        isApi: false,
        text: "system directive",
      },
      {
        gqlType: schema.getType("Record"),
        isApi: false,
        text: "interface type",
      },
      {
        gqlType: schema.getType("StudyItem"),
        isApi: false,
        text: "object type",
      },
    ];

    describe("isApiType()", () => {
      test.each(types)(
        "returns $isApiType if type is $text",
        ({ gqlType, isApi }) => {
          expect.assertions(1);

          expect(isApiType(gqlType)).toBe(isApi);
        },
      );
    });

    describe("isSystemType()", () => {
      test.each(types)(
        "returns !$isApiType if type is $text",
        ({ gqlType, isApi }) => {
          expect.assertions(1);

          expect(isSystemType(gqlType)).not.toBe(isApi);
        },
      );
    });
  });

  describe("DirectiveLocation", () => {
    const locations = [
      { locations: [DirectiveLocation.QUERY], executable: true },
      { locations: [DirectiveLocation.MUTATION], executable: true },
      { locations: [DirectiveLocation.SUBSCRIPTION], executable: true },
      { locations: [DirectiveLocation.FIELD], executable: true },
      { locations: [DirectiveLocation.FRAGMENT_DEFINITION], executable: true },
      { locations: [DirectiveLocation.FRAGMENT_SPREAD], executable: true },
      { locations: [DirectiveLocation.INLINE_FRAGMENT], executable: true },
      { locations: [DirectiveLocation.VARIABLE_DEFINITION], executable: true },
      {
        locations: [DirectiveLocation.QUERY, DirectiveLocation.ENUM],
        executable: true,
      },
      {
        locations: [DirectiveLocation.ENUM],
        executable: false,
      },
      {
        locations: [],
        executable: false,
      },
    ];

    describe("executableDirectiveLocation()", () => {
      test.each(locations)(
        "returns $executable if location is $locations",
        ({ locations, executable }) => {
          expect.assertions(1);

          const directive = new GraphQLDirective({
            name: "testExecutableDirectiveLocation",
            locations,
          });

          expect(executableDirectiveLocation(directive)).toBe(executable);
        },
      );
    });

    describe("typeSystemDirectiveLocation()", () => {
      test.each(locations)(
        "returns !$executable if location is $locations",
        ({ locations, executable }) => {
          expect.assertions(1);

          const directive = new GraphQLDirective({
            name: "testExecutableDirectiveLocation",
            locations,
          });

          expect(typeSystemDirectiveLocation(directive)).not.toBe(executable);
        },
      );
    });
  });
});
