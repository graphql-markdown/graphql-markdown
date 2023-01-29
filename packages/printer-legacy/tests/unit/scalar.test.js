const { GraphQLInt, GraphQLScalarType } = require("graphql");

const {
  printCodeScalar,
  printScalarMetadata,
  printSpecification,
} = require("../../src/scalar");

describe("scalar", () => {
  const type = new GraphQLScalarType({
    name: "ScalarTypeName",
    type: GraphQLInt,
  });

  describe("printSpecification()", () => {
    test("prints specification link if directive specified by is present", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      const deprecation = printSpecification(type);

      expect(deprecation).toMatchInlineSnapshot(`
            "### <SpecifiedBy url="https://lorem.ipsum"/>

            "
          `);
    });

    test("does not print specification link if directive specified by is not present", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
      });

      const deprecation = printSpecification(type);

      expect(deprecation).toBe("");
    });
  });

  describe("printScalarMetadata()", () => {
    test("returns empty if not specifiedByUrl", () => {
      expect.hasAssertions();

      const metadata = printScalarMetadata(type);

      expect(metadata).toBe("");
    });

    test("returns specifiedBy tag if specifiedByUrl", () => {
      expect.hasAssertions();

      const typeSpecifiedBy = new GraphQLScalarType({
        name: "ScalarTypeName",
        type: GraphQLInt,
        specifiedByURL: "https://graphql-markdown.github.io/",
      });

      const metadata = printScalarMetadata(typeSpecifiedBy);

      expect(metadata).toMatchInlineSnapshot(`
        "### <SpecifiedBy url="https://graphql-markdown.github.io/"/>

        "
      `);
    });
  });

  describe("printCodeScalar()", () => {
    test("returns scalar code structure", () => {
      expect.hasAssertions();

      const code = printCodeScalar(type);

      expect(code).toMatchInlineSnapshot(`"scalar ScalarTypeName"`);
    });
  });
});
