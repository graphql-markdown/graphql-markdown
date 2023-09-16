import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLScalarType,
} from "graphql";

import {
  hasPrintableDirective,
  printCustomDirectives,
  printDeprecation,
  printDescription,
} from "../../src/common";

import { DEFAULT_OPTIONS } from "../../src/const/options";
import type { PrintTypeOptions } from "@graphql-markdown/types";

jest.mock("@graphql-markdown/graphql", () => {
  const original = jest.requireActual("@graphql-markdown/graphql");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    isDeprecated: jest.fn(original.isDeprecated),
    hasDirective: jest.fn(original.hasDirective),
  };
});
import * as mockGraphQL from "@graphql-markdown/graphql";

describe("common", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

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
      const description = printDescription(type);

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

  describe("hasPrintableDirective", () => {
    test.each([
      { options: undefined },
      {
        options: {
          skipDocDirective: undefined,
          onlyDocDirective: [],
          deprecated: undefined,
        },
      },
      {
        options: {
          skipDocDirective: [],
          onlyDocDirective: undefined,
          deprecated: undefined,
        },
      },
    ])("return true if no option set", ({ options }) => {
      expect(
        hasPrintableDirective({}, options as unknown as PrintTypeOptions),
      ).toBeTruthy();
    });
  });

  test("return false if type has skip directive", () => {
    const options = {
      skipDocDirective: ["noDoc"],
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "hasDirective").mockReturnValueOnce(true);
    expect(hasPrintableDirective({}, options)).toBeFalsy();
  });

  test("return true if type has not skip directive", () => {
    const options = {
      skipDocDirective: ["noDoc"],
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "hasDirective").mockReturnValueOnce(false);
    expect(hasPrintableDirective({}, options)).toBeTruthy();
  });

  test("return false if type has skip deprecated", () => {
    const options = {
      deprecated: "skip",
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "isDeprecated").mockReturnValueOnce(true);
    expect(hasPrintableDirective({}, options)).toBeFalsy();
  });

  test("return true if type has not skip deprecated", () => {
    const options = {
      deprecated: "default",
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "isDeprecated").mockReturnValueOnce(true);
    expect(hasPrintableDirective({}, options)).toBeTruthy();
  });

  test("return true if type has only directive", () => {
    const options = {
      onlyDocDirective: ["public"],
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "hasDirective").mockReturnValueOnce(true);
    expect(hasPrintableDirective({}, options)).toBeTruthy();
  });

  test("return false if type has not only directive", () => {
    const options = {
      onlyDocDirective: ["public"],
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "hasDirective").mockReturnValueOnce(false);
    expect(hasPrintableDirective({}, options)).toBeFalsy();
  });

  test("return false if type has only directive and skip deprecated", () => {
    const options = {
      deprecated: "skip",
      onlyDocDirective: ["public"],
    } as unknown as PrintTypeOptions;
    jest.spyOn(mockGraphQL, "isDeprecated").mockReturnValueOnce(true);
    jest.spyOn(mockGraphQL, "hasDirective").mockReturnValueOnce(true);
    expect(hasPrintableDirective({}, options)).toBeFalsy();
  });
});
