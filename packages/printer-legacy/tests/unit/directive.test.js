const {
  GraphQLDirective,
  GraphQLBoolean,
  GraphQLString,
  DirectiveLocation,
} = require("graphql");
const { DEFAULT_OPTIONS } = require("../../src");

const {
  printCodeDirective,
  printDirectiveMetadata,
} = require("../../src/directive");

describe("directive", () => {
  describe("printDirectiveMetadata()", () => {
    test("returns directive metadata", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: [],
      });

      const code = printDirectiveMetadata(type, DEFAULT_OPTIONS);

      expect(code).toMatchInlineSnapshot(`""`);
    });
  });

  describe("printCodeDirective()", () => {
    test("returns a directive", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: [],
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`"directive @FooBar"`);
    });

    test("returns a directive with its arguments", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: [],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`
        "directive @FooBar(
          ArgFooBar: Boolean
        )"
      `);
    });

    test("returns a directive with multiple locations", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: [DirectiveLocation.QUERY, DirectiveLocation.FIELD],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`
        "directive @FooBar(
          ArgFooBar: Boolean
        ) on 
          | QUERY
          | FIELD"
      `);
    });

    test("returns a directive with single location", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "FooBar",
        type: GraphQLString,
        locations: [DirectiveLocation.QUERY],
        args: {
          ArgFooBar: {
            type: GraphQLBoolean,
          },
        },
      });

      const code = printCodeDirective(type);

      expect(code).toMatchInlineSnapshot(`
        "directive @FooBar(
          ArgFooBar: Boolean
        ) on QUERY"
      `);
    });
  });
});
