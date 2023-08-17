import { buildSchema } from "graphql";

import {
  getRelationOfField,
  getRelationOfImplementation,
  getRelationOfInterface,
  getRelationOfReturn,
  getRelationOfUnion,
} from "../../../src/graphql/relation";

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
});
