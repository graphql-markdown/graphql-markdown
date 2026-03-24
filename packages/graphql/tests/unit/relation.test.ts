import { buildSchema } from "graphql/utilities";

import { getSchemaMap } from "../../src/introspection";

import {
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfInterface,
  getRelationOfReturn,
  getRelationOfUnion,
} from "../../src/relation";

describe("relation", () => {
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

      const schemaMap = getSchemaMap(schema);

      const interfaceType = schema.getType("Mammal");

      const relations = getRelationOfInterface(interfaceType, schemaMap);

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

      const schemaMap = getSchemaMap(schema);

      const compositeType = schema.getType("Meeting");

      const relations = getRelationOfUnion(compositeType, schemaMap);

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

      const schemaMap = getSchemaMap(schema);

      const compositeType = schema.getType("Being");

      const relations = getRelationOfImplementation(compositeType, schemaMap);

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

      const schemaMap = getSchemaMap(schema);

      const compositeType = schema.getType("StudyItem");

      const relations = getRelationOfReturn(compositeType, schemaMap);

      expect(relations).toMatchSnapshot();
    });

    test("preserves nested query namespace name for operation relations", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        type StudyItem {
          id: ID!
        }

        type Query {
          analytics: AnalyticsQuery!
        }

        type AnalyticsQuery {
          getStudyItem: StudyItem
        }
      `);

      const schemaMap = getSchemaMap(schema);
      const compositeType = schema.getType("StudyItem");

      const relations = getRelationOfReturn(compositeType, schemaMap);

      expect(relations.queries.map((q) => q.name)).toEqual([
        "analytics.getStudyItem",
      ]);
    });

    test("ignores operation entries with unresolved return types", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        type StudyItem {
          id: ID!
        }
      `);

      const compositeType = schema.getType("StudyItem");

      const relations = getRelationOfReturn(compositeType, {
        queries: {
          brokenStudyItem: {
            type: undefined,
          },
        },
      } as never);

      expect(relations).toEqual({
        queries: [],
        mutations: [],
        subscriptions: [],
      });
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

      const schemaMap = getSchemaMap(schema);

      const compositeType = schema.getType("String");

      const relations = getRelationOfField(compositeType, schemaMap);

      expect(relations).toMatchSnapshot();
    });

    test("preserves nested query namespace name for field relations", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        type StudyItem {
          id: ID!
        }

        type Query {
          analytics: AnalyticsQuery!
        }

        type AnalyticsQuery {
          getStudyItem(id: ID!): StudyItem
        }
      `);

      const schemaMap = getSchemaMap(schema);
      const compositeType = schema.getType("ID");

      const relations = getRelationOfField(compositeType, schemaMap);

      expect(
        relations.queries
          .filter((q) => {
            return typeof q === "object" && q !== null && "name" in q;
          })
          .map((q) => {
            return (q as { name: string }).name;
          }),
      ).toContain("analytics.getStudyItem");
    });

    test("ignores field entries with unresolved argument types", () => {
      expect.hasAssertions();

      const schema = buildSchema(`
        type Query {
          noop: String
        }
      `);

      const compositeType = schema.getType("String");

      const relations = getRelationOfField(compositeType, {
        queries: {
          brokenQuery: {
            args: [
              {
                name: "id",
                type: undefined,
              },
            ],
          },
        },
      } as never);

      expect(relations).toEqual({
        queries: [],
        mutations: [],
        subscriptions: [],
        objects: [],
        interfaces: [],
        inputs: [],
        directives: [],
      });
    });
  });
});
