const {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLScalarType,
} = require("graphql");

const {
  graphql: { getConstDirectiveMap },
} = require("@graphql-markdown/utils");

const {
  printCustomDirectives,
  printCustomTags,
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

      expect(description).toBe("Lorem ipsum");
    });

    test("returns the default text if no description", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      });
      const description = printDescription(type);

      expect(description).toBe("No description");
    });

    test("returns the defined text if no description", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      });
      const description = printDescription(type, undefined, "");

      expect(description).toBe("");
    });

    test("returns the default text if description is undefined", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
        description: undefined,
      });
      const description = printDescription(type);

      expect(description).toBe("No description");
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

      expect(description).toBe("No description");
    });

    test("return DEPRECATED tag if deprecated", () => {
      const type = {
        description: "Lorem ipsum",
        isDeprecated: true,
        deprecationReason: "Foobar",
      };
      const description = printDescription(type);

      expect(description).toMatchInlineSnapshot(`
        "<Badge class="badge badge--warning" text="DEPRECATED: Foobar"/>

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
        "Lorem ipsumTest testDirective

        "
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
        "<Badge class="badge badge--warning" text="DEPRECATED"/>

        "
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
        "<Badge class="badge badge--warning" text="DEPRECATED: foobar"/>

        "
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

      expect(description).toMatchInlineSnapshot(`
        "Test testDirective

        "
      `);
    });
  });

  describe("printCustomTags()", () => {
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

    test("does not print tags if type has no matching directive", () => {
      expect.hasAssertions();

      const description = printCustomTags(type, {});

      expect(description).toBe("");
    });

    test("prints tags", () => {
      expect.hasAssertions();

      const options = {
        customDirectives: {
          testDirective: {
            type: directiveType,
            tag: (directive) => ({
              text: directive.name,
              classname: "warning",
            }),
          },
        },
      };
      const constDirectiveMap = getConstDirectiveMap(type, options);
      const description = printCustomTags(type, constDirectiveMap);

      expect(description).toMatchInlineSnapshot(`
        "<Badge class="badge badge--tag warning " text="testDirective"/>

        "
      `);
    });
  });
});
