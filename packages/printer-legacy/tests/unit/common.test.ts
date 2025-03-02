import type { MetaOptions, PrintTypeOptions } from "@graphql-markdown/types";

import { GraphQLDirective, GraphQLScalarType } from "graphql/type";
import { DirectiveLocation } from "graphql/language";

import {
  printCustomDirectives,
  printDeprecation,
  printDescription,
  printWarning,
} from "../../src/common";

import { DEFAULT_OPTIONS } from "../../src/const/options";

import * as GraphQL from "@graphql-markdown/graphql";
jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    ...jest.requireActual("@graphql-markdown/graphql"),
    isDeprecated: jest.fn(),
    hasDirective: jest.fn(),
  };
});
const mockGraphQL = jest.mocked(GraphQL, { shallow: true });

describe("common", () => {
  beforeEach(() => {
    mockGraphQL.isDeprecated.mockReturnValue(false);
  });

  afterAll(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe("printDescription()", () => {
    test("returns the type description text", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "TestDirective",
        locations: [],
        description: "Lorem ipsum",
      });
      const description = printDescription(type, DEFAULT_OPTIONS);

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
      const description = printDescription(type, DEFAULT_OPTIONS);

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
      const description = printDescription(type, DEFAULT_OPTIONS, "");

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
      const description = printDescription(type, DEFAULT_OPTIONS);

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
      const description = printDescription(type, DEFAULT_OPTIONS);

      expect(description).toMatchInlineSnapshot(`
        "

        No description"
      `);
    });

    test("return DEPRECATED tag if deprecated", () => {
      expect.hasAssertions();

      mockGraphQL.isDeprecated.mockReturnValue(true);

      const type = {
        description: "Lorem ipsum",
        isDeprecated: true,
        deprecationReason: "{ Foobar }",
      };
      const description = printDescription(type, DEFAULT_OPTIONS);

      expect(description).toMatchInlineSnapshot(`
"

<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

&#x007B; Foobar &#x007D;

</span>
</fieldset>

Lorem ipsum"
`);
    });

    test("return custom directive description if applied", () => {
      expect.hasAssertions();

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
        ...DEFAULT_OPTIONS,
        customDirectives: {
          testDirective: {
            type: directiveType,
            descriptor: (directive: GraphQLDirective): string => {
              return `Test ${directive.name}`;
            },
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

      mockGraphQL.isDeprecated.mockReturnValue(true);

      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
      };
      const deprecation = printDeprecation(type, DEFAULT_OPTIONS);

      expect(deprecation).toMatchInlineSnapshot(`
"

<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

</span>
</fieldset>"
`);
    });

    test("prints deprecation reason if type is deprecated with reason", () => {
      expect.hasAssertions();

      mockGraphQL.isDeprecated.mockReturnValue(true);

      const type = {
        name: "EntityTypeName",
        isDeprecated: true,
        deprecationReason: "{ foobar }",
      };
      const deprecation = printDeprecation(type, DEFAULT_OPTIONS);

      expect(deprecation).toMatchInlineSnapshot(`
"

<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

&#x007B; foobar &#x007D;

</span>
</fieldset>"
`);
    });

    test("does not print deprecated badge if type is not deprecated", () => {
      expect.hasAssertions();

      const type = new GraphQLScalarType({
        name: "LoremScalar",
        description: "Lorem Ipsum",
        specifiedByURL: "https://lorem.ipsum",
      });

      const deprecation = printDeprecation(type, DEFAULT_OPTIONS);

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

      const description = printCustomDirectives(type, DEFAULT_OPTIONS);

      expect(description).toBe("");
    });

    test("prints directive description", () => {
      expect.hasAssertions();

      const options = {
        ...DEFAULT_OPTIONS,
        customDirectives: {
          testDirective: {
            type: directiveType,
            descriptor: (directive: GraphQLDirective): string => {
              return `Test ${directive.name}`;
            },
          },
        },
      };

      const description = printCustomDirectives(type, options);

      expect(description).toMatchInlineSnapshot(`
"

Test testDirective"
`);
    });
  });

  describe("printWarning()", () => {
    test("prints admonition warning", () => {
      expect.assertions(1);

      expect(
        printWarning({ text: "test", title: "DEPRECATED" }, DEFAULT_OPTIONS),
      ).toMatchInlineSnapshot(`
"

<fieldset class="gqlmd-mdx-admonition-fieldset">
<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-warning">⚠️</span> **DEPRECATED**</legend>
<span>

test

</span>
</fieldset>"
`);
    });
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip("prints admonition caution for Docusaurus v2", () => {
      expect.assertions(1);

      const meta: MetaOptions = {
        generatorFrameworkName: "docusaurus",
        generatorFrameworkVersion: "2.4.2",
      };

      expect(
        printWarning({ text: "test", title: "DEPRECATED" }, {
          meta,
        } as unknown as PrintTypeOptions),
      ).toMatchInlineSnapshot(`
        "

        :::caution DEPRECATED

        test

        :::"
      `);
    });
    // eslint-disable-next-line jest/no-disabled-tests
    test.skip("prints admonition warning for Docusaurus v3", () => {
      expect.assertions(1);

      const meta: MetaOptions = {
        generatorFrameworkName: "docusaurus",
        generatorFrameworkVersion: "3.0.0",
      };

      expect(
        printWarning({ text: "test", title: "DEPRECATED" }, {
          meta,
        } as unknown as PrintTypeOptions),
      ).toMatchInlineSnapshot(`
        "

        :::warning[DEPRECATED]

        test

        :::"
      `);
    });
  });
});
