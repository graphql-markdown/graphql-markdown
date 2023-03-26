const { GraphQLScalarType, GraphQLDirective } = require("graphql");

const { printDescription, printDeprecation } = require("../../src/common");

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

    test("return DEPRECATED tag if deprecated", () => {
      const type = {
        description: "Lorem ipsum",
        isDeprecated: true,
        deprecationReason: "Foobar",
      };
      const description = printDescription(type);

      expect(description).toMatchInlineSnapshot(`
        "<Badge class="warning" text="DEPRECATED: Foobar"/>

        Lorem ipsum"
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
            "<Badge class="warning" text="DEPRECATED"/>

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
            "<Badge class="warning" text="DEPRECATED: foobar"/>

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
});
