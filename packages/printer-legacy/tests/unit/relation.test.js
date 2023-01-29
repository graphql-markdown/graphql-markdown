const { GraphQLScalarType } = require("graphql");

const graphqlLib = require("@graphql-markdown/utils").graphql;

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
      jest.resetAllMocks();
    });

    test("prints type relations", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "String",
        description: "Lorem Ipsum",
      });

      jest.spyOn(graphqlLib, "getRelationOfReturn").mockImplementation(() => ({
        queries: [{ name: "Foo" }],
        interfaces: [{ name: "Bar" }],
        subscriptions: [{ name: "Baz" }],
      }));

      const deprecation = printRelationOf(
        type,
        "RelationOf",
        graphqlLib.getRelationOfReturn,
      );

      expect(deprecation).toMatchInlineSnapshot(`
            "### RelationOf

            [\`Bar\`](#)  <Badge class="secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="secondary" text="query"/>

            "
          `);
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
