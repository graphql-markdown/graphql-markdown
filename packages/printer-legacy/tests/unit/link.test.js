const { GraphQLList, GraphQLDirective, GraphQLObjectType } = require("graphql");

const { toLink } = require("../../src/link");

describe("printer", () => {
  const baseURL = "graphql";
  const root = "docs";

  describe("toLink()", () => {
    test("returns markdown link for GraphQL directive", () => {
      expect.hasAssertions();

      const entityName = "TestDirective";
      const type = new GraphQLDirective({
        name: entityName,
        locations: [],
      });

      const link = toLink(type, entityName, undefined, root, baseURL);

      expect(JSON.stringify(link)).toMatchSnapshot();
    });

    test("returns markdown link surrounded by [] for GraphQL list/array", () => {
      expect.hasAssertions();

      const entityName = "TestObjectList";
      const type = new GraphQLList(
        new GraphQLObjectType({
          name: entityName,
        }),
      );

      const link = toLink(type, entityName, undefined, root, baseURL);

      expect(JSON.stringify(link)).toMatchSnapshot();
    });

    test("returns plain text for unknown entities", () => {
      expect.hasAssertions();

      const type = "any";
      const entityName = "fooBar";

      const link = toLink(type, entityName, undefined, root, baseURL);

      expect(JSON.stringify(link)).toMatchSnapshot();
    });
  });
});
