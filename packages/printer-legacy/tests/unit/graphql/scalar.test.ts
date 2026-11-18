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

      expect(deprecation).toMatchInlineSnapshot(String.raw`
{
  "level": 3,
  "title": "<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="https://lorem.ipsum/" title="Specified by https://lorem.ipsum/">⎘</a></span>",
}
`);
    });

    test("does not print specification link if directive specified by is not present", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
      });

      const deprecation = printSpecification(type, DEFAULT_OPTIONS);

      expect(deprecation).toBeUndefined();
    });

    test.each([
      ["javascript:alert(1)"],
      ["data:text/html,x"],
      ["not a url"],
      ["/spec"],
    ])(
      "does not print specification link for invalid or non-http(s) URL %s",
      (specifiedByURL) => {
        expect.hasAssertions();

        const type = new GraphQLScalarType({
          name: "LoremScalar",
          specifiedByURL,
        });

        const formatter = vi.fn();
        const deprecation = printSpecification(type, {
          ...DEFAULT_OPTIONS,
          formatMDXSpecifiedByLink: formatter,
        });

        expect(deprecation).toBeUndefined();
        expect(formatter).not.toHaveBeenCalled();
      },
    );

    test("passes normalized URL and percent-encodes injected markup characters", () => {
      expect.hasAssertions();

      const payload =
        'https://example.com/spec"/>{globalThis.P=1}<img src=x onerror="alert(1)';
      const type = new GraphQLScalarType({
        name: "LoremScalar",
        specifiedByURL: payload,
      });

      const formatter = vi.fn(() => {
        return "formatted";
      });
      printSpecification(type, {
        ...DEFAULT_OPTIONS,
        formatMDXSpecifiedByLink: formatter,
      });

      const [arg] = formatter.mock.calls[0];
      expect(formatter).toHaveBeenCalledWith(new URL(payload).href);
      expect(arg).not.toContain('"');
      expect(arg).not.toContain("<");
      expect(arg).not.toContain(">");
    });

    test("normalizes URL without trailing slash before formatting", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        specifiedByURL: "https://lorem.ipsum",
      });

      const formatter = vi.fn(() => {
        return "formatted";
      });
      printSpecification(type, {
        ...DEFAULT_OPTIONS,
        formatMDXSpecifiedByLink: formatter,
      });

      expect(formatter).toHaveBeenCalledWith("https://lorem.ipsum/");
    });
  });

  describe("printScalarMetadata()", () => {
    test("returns undefined if not specifiedByUrl", () => {
      expect.hasAssertions();

      const metadata = printScalarMetadata(type, DEFAULT_OPTIONS);

      expect(metadata).toBeUndefined();
    });

    test("returns specifiedBy tag if specifiedByUrl", () => {
      expect.hasAssertions();

      const typeSpecifiedBy = new GraphQLScalarType<number>({
        name: "ScalarTypeName",
        specifiedByURL: "https://graphql-markdown.dev/",
      });

      const metadata = printScalarMetadata(typeSpecifiedBy, DEFAULT_OPTIONS);

      expect(metadata).toMatchInlineSnapshot(String.raw`
{
  "level": 3,
  "title": "<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="https://graphql-markdown.dev/" title="Specified by https://graphql-markdown.dev/">⎘</a></span>",
}
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
