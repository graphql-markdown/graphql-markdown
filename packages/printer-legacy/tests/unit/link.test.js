const { GraphQLList, GraphQLDirective, GraphQLObjectType } = require("graphql");

const { DEFAULT_OPTIONS } = require("../../src/printer");
const { toLink } = require("../../src/link");

describe("link", () => {
  const basePath = "docs/graphql";

  describe("toLink()", () => {
    test("returns markdown link for GraphQL directive", () => {
      expect.hasAssertions();

      const entityName = "TestDirective";
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      const link = toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestDirective",
          "url": "docs/graphql/directives/test-directive",
        }
      `);
    });

    test("returns markdown link surrounded by [] for GraphQL list/array", () => {
      expect.hasAssertions();

      const entityName = "TestObjectList";
      const type = new GraphQLList(
        new GraphQLObjectType({
          name: entityName,
        }),
      );

      const link = toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "TestObjectList",
          "url": "docs/graphql/objects/test-object-list",
        }
      `);
    });

    test("returns plain text for unknown entities", () => {
      expect.hasAssertions();

      const type = "any";
      const entityName = "fooBar";

      const link = toLink(type, entityName, undefined, {
        ...DEFAULT_OPTIONS,
        basePath,
      });

      expect(link).toMatchInlineSnapshot(`
        {
          "text": "fooBar",
          "url": "#",
        }
      `);
    });
  });
});
