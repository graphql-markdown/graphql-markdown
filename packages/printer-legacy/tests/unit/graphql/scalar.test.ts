import { GraphQLScalarType } from "graphql/type";

import {
  printCodeScalar,
  printScalarMetadata,
  printSpecification,
} from "../../../src/graphql/scalar";
import { DEFAULT_OPTIONS } from "../../../src/const/options";

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

      const deprecation = printSpecification(type, DEFAULT_OPTIONS);

      expect(deprecation).toMatchInlineSnapshot(`
"### <span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="https://lorem.ipsum" title="Specified by https://lorem.ipsum">⎘</a></span>

"
`);
    });

    test("does not print specification link if directive specified by is not present", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
      });

      const deprecation = printSpecification(type, DEFAULT_OPTIONS);

      expect(deprecation).toBe("");
    });
  });

  describe("printScalarMetadata()", () => {
    test("returns empty if not specifiedByUrl", () => {
      expect.hasAssertions();

      const metadata = printScalarMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toBe("");
    });

    test("returns specifiedBy tag if specifiedByUrl", () => {
      expect.hasAssertions();

      const typeSpecifiedBy = new GraphQLScalarType<number>({
        name: "ScalarTypeName",
        specifiedByURL: "https://graphql-markdown.dev/",
      });

      const metadata = printScalarMetadata(typeSpecifiedBy, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(`
"### <span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="https://graphql-markdown.dev/" title="Specified by https://graphql-markdown.dev/">⎘</a></span>

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
