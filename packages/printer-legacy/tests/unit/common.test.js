const {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLScalarType,
} = require("graphql");

const {
  getConstDirectiveMap,
} = require("@graphql-markdown/utils");

const {
  printCustomDirectives,
  printDeprecation,
  printDescription,
} = require("../../src/common");

describe("common", () => {
  describe("printDescription()", () => {
    test("returns the type description text", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
        description: "Lorem ipsum",
      });
      const description = printDescription(type);

      expect(description).toMatchInlineSnapshot(`
        "

        Lorem ipsum"
      `);
    });

    test("returns the default text if no description", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      });
      const description = printDescription(type);

      expect(description).toMatchInlineSnapshot(`
        "

        No description"
      `);
    });

    test("returns the defined text if no description", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      });
      const description = printDescription(type, undefined, "");

      expect(description).toMatchInlineSnapshot(`
        "

        "
      `);
    });

    test("returns the default text if description is undefined", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
        description: undefined,
      });
      const description = printDescription(type);

      expect(description).toMatchInlineSnapshot(`
        "

        No description"
      `);
    });

    test("returns the default text if noText is not a string", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
        description: undefined,
      });
      const description = printDescription(type, undefined, {
        text: "Not a string",
      });

      expect(description).toMatchInlineSnapshot(`
        "

        No description"
      `);
    });

    test("return DEPRECATED tag if deprecated", () => {
      const type = {
        description: "Lorem ipsum",
        isDeprecated: true,
        deprecationReason: "Foobar",
      };
      const description = printDescription(type);

      expect(description).toMatchInlineSnapshot(`
        "

        :::caution DEPRECATED
        Foobar
        :::

        Lorem ipsum"
      `);
    });

    test("return custom directive description if applied", () => {
      const directiveType = new GraphQLDirective({
        name: "testDirective",
        locations: [DirectiveLocation.OBJECT],
      });

      const type = {
        name: "TestType",
        description: "Lorem ipsum",
        astNode: {
          directives: [
            {
              name: {
                value: "testDirective",
              },
            },
          ],
        },
      };

      const options = {
        customDirectives: {
          testDirective: {
            type: directiveType,
            descriptor: (directive) => `Test ${directive.name}`,
          },
        },
      };

      const description = printDescription(type, options);

      expect(description).toMatchInlineSnapshot(`
        "

        Lorem ipsum

        Test testDirective"
      `);
    });
  });

  describe("printDeprecation()", () => {
    test("prints deprecated badge if type is deprecated", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
      };
      const deprecation = printDeprecation(type);

      expect(deprecation).toMatchInlineSnapshot(`
        "

        :::caution DEPRECATED
        :::"
      `);
    });

    test("prints deprecation reason if type is deprecated with reason", () => {
      expect.hasAssertions();

      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
        deprecationReason: "foobar",
      };
      const deprecation = printDeprecation(type);

      expect(deprecation).toMatchInlineSnapshot(`
        "

        :::caution DEPRECATED
        foobar
        :::"
      `);
    });

    test("does not print deprecated badge if type is not deprecated", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      const deprecation = printDeprecation(type);

      expect(deprecation).toBe("");
    });
  });

  describe("printCustomDirectives()", () => {
    const directiveType = new GraphQLDirective({
      name: "testDirective",
      locations: [DirectiveLocation.OBJECT],
    });
    const type = {
      name: "TestType",
      astNode: {
        directives: [
          {
            name: {
              value: "testDirective",
            },
          },
        ],
      },
    };

    test("does not print directive description if type has no directive", () => {
      expect.hasAssertions();

      const description = printCustomDirectives(type, {});

      expect(description).toBe("");
    });

    test("prints directive description", () => {
      expect.hasAssertions();

      const options = {
        customDirectives: {
          testDirective: {
            type: directiveType,
            descriptor: (directive) => `Test ${directive.name}`,
          },
        },
      };
      const constDirectiveMap = getConstDirectiveMap(type, options);
      const description = printCustomDirectives(type, constDirectiveMap);

      expect(description).toMatchInlineSnapshot(`""`);
    });
  });
});
