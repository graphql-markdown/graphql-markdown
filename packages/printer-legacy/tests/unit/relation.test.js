const { GraphQLScalarType } = require("graphql");

jest.mock("@graphql-markdown/utils", () => {
  return {
    string: { toSlug: jest.fn() },
    url: { pathUrl: jest.fn() },
    object: { hasProperty: jest.fn() },
    graphql: {
      getRelationOfReturn: jest.fn(),
      getNamedType: jest.fn(),
      isOperation: jest.fn(),
      isEnumType: jest.fn(),
      isUnionType: jest.fn(),
      isInterfaceType: jest.fn(),
      isObjectType: jest.fn(),
      isInputType: jest.fn(),
      isScalarType: jest.fn(),
      isDirectiveType: jest.fn(),
    },
  };
});
const Utils = require("@graphql-markdown/utils");

const {
  printRelationOf,
  getRootTypeLocaleFromString,
} = require("../../src/relation");

describe("relation", () => {
  describe("printRelationOf()", () => {
    beforeEach(() => {
      jest.mock("graphql");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("prints type relations", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest
        .spyOn(Utils.graphql, "getRelationOfReturn")
        .mockImplementation(() => ({
          queries: [{ name: "Foo" }],
          interfaces: [{ name: "Bar" }],
          subscriptions: [{ name: "Baz" }],
        }));

      const relation = printRelationOf(
        type,
        "RelationOf",
        Utils.graphql.getRelationOfReturn,
        {},
      );

      expect(relation).toMatchInlineSnapshot(`
            "### RelationOf

            [\`Bar\`](#)  <Badge class="secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="secondary" text="query"/>

            "
          `);
    });

    test("returns empty string if type is undefined", () => {
      expect.hasAssertions();

      const relation = printRelationOf(
        undefined,
        "RelationOf",
        Utils.graphql.getRelationOfReturn,
      );

      expect(relation).toBe("");
    });

    test("returns empty string if type is operation", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest.spyOn(Utils.graphql, "isOperation").mockImplementation(() => true);

      const relation = printRelationOf(
        type,
        "RelationOf",
        Utils.graphql.getRelationOfReturn,
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation is not a function", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(type, "RelationOf", undefined);

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns undefined", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(
        type,
        "RelationOf",
        jest.fn().mockReturnValue(undefined),
      );

      expect(relation).toBe("");
    });

    test("returns empty string if getRelation returns empty list", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      const relation = printRelationOf(
        type,
        "RelationOf",
        jest.fn().mockReturnValue([]),
      );

      expect(relation).toBe("");
    });
  });

  describe("getRootTypeLocaleFromString()", () => {
    test("returns object of local strings from root type string", () => {
      expect.hasAssertions();

      const deprecation = getRootTypeLocaleFromString("queries");

      expect(deprecation).toMatchInlineSnapshot(`
            {
              "plural": "queries",
              "singular": "query",
            }
          `);
    });
  });
});
