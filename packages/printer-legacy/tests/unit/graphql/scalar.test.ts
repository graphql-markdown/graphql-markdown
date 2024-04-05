import { GraphQLScalarType } from "graphql/type";

import {
  printCodeScalar,
  printScalarMetadata,
  printSpecification,
} from "../../../src/graphql/scalar";

describe("scalar", () => {
  const type = new GraphQLScalarType<number>({
    name: "ScalarTypeName",
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

      const typeSpecifiedBy = new GraphQLScalarType<number>({
        name: "ScalarTypeName",
        specifiedByURL: "https://graphql-markdown.dev/",
      });

      const metadata = printScalarMetadata(typeSpecifiedBy);

      expect(metadata).toMatchInlineSnapshot(`
        "### <SpecifiedBy url="https://graphql-markdown.dev/"/>

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
