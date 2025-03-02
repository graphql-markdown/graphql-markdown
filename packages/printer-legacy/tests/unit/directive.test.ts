import { buildSchema } from "graphql/utilities";
import { GraphQLDirective } from "graphql/type";

import type {
  DirectiveName,
  Badge,
  PrintTypeOptions,
  CustomDirectiveMap,
  MDXString,
} from "@graphql-markdown/types";

import { DEFAULT_OPTIONS } from "../../src/const/options";

jest.mock("@graphql-markdown/utils", () => {
  return {
    // ...jest.requireActual("@graphql-markdown/utils"),
    isEmpty: jest.fn(),
    getConstDirectiveMap: jest.fn(),
    escapeMDX: jest.fn(),
  };
});
import * as Utils from "@graphql-markdown/utils";

jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    ...jest.requireActual("@graphql-markdown/graphql"),
    getConstDirectiveMap: jest.fn(),
  };
});
import * as GraphQL from "@graphql-markdown/graphql";

jest.mock("../../src/link", () => {
  return {
    printLink: jest.fn(),
  };
});
import * as Link from "../../src/link";

import {
  getCustomTags,
  printCustomDirectives,
  printCustomDirective,
  printCustomTags,
} from "../../src/directive";

describe("directive", () => {
  const schema = buildSchema(`
    directive @testA(
      arg: ArgEnum = ARGA
    ) on OBJECT | FIELD_DEFINITION

    directive @testB(
      argA: Int!, 
      argB: [String!]
    ) on FIELD_DEFINITION

    enum ArgEnum {
      ARGA
      ARGB
      ARGC
    }

    type Test @testA {
      id: ID!
      fieldA: [String!] 
        @testA(arg: ARGC) 
        @testB(argA: 10, argB: ["testArgB"])
    }
  `);
  const type = schema.getType("Test")!;
  const descriptor = (directive?: GraphQLDirective): string => {
    return `Test ${directive!.name}`;
  };
  const tag = (directive?: GraphQLDirective): Badge => {
    return {
      text: directive!.toString(),
      classname: "warning",
    };
  };
  const directiveNotDeclared = new GraphQLDirective({
    name: "Dummy",
    locations: [],
  });
  const options: PrintTypeOptions &
    Required<{ customDirectives: CustomDirectiveMap }> = {
    ...DEFAULT_OPTIONS,
    customDirectives: {
      ["testA" as DirectiveName]: {
        type: schema.getDirective("testA")!,
        descriptor,
        tag,
      },
      ["nonExist" as DirectiveName]: {
        type: directiveNotDeclared,
        descriptor,
      },
      ["noDescriptor" as DirectiveName]: {
        type: directiveNotDeclared,
      },
    } as CustomDirectiveMap,
  };

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("printCustomDirective()", () => {
    test("returns a MDX string of Directive component", () => {
      expect.assertions(1);

      const constDirectiveOption =
        options.customDirectives["testA" as DirectiveName];

      jest
        .spyOn(Link, "printLink")
        .mockReturnValue("[`foo`](/bar)" as MDXString);

      expect(printCustomDirective(type, constDirectiveOption, options))
        .toMatchInlineSnapshot(`
"#### [\`foo\`](/bar)
 Test testA
 "
`);
    });

    test("returns undefined if no descriptor exists", () => {
      expect.assertions(1);

      const constDirectiveOption =
        options.customDirectives["noDescriptor" as DirectiveName];

      jest
        .spyOn(Link, "printLink")
        .mockReturnValue("[`foo`](/bar)" as MDXString);

      expect(
        printCustomDirective(type, constDirectiveOption, options),
      ).toBeUndefined();
    });
  });

  describe("printCustomDirectives()", () => {
    test("returns empty string when config is not set", () => {
      expect.assertions(1);

      jest.spyOn(GraphQL, "getConstDirectiveMap").mockReturnValue(undefined);

      expect(
        printCustomDirectives(type, {} as unknown as PrintTypeOptions),
      ).toBe("");
    });

    test("returns a MDX string of Directive components", () => {
      expect.assertions(1);

      const mockConstDirectiveMap = {
        testA: options.customDirectives["testA" as DirectiveName],
      };
      jest
        .spyOn(GraphQL, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest
        .spyOn(Link, "printLink")
        .mockReturnValue("[`foo`](/bar)" as MDXString);

      expect(printCustomDirectives(type, options)).toMatchInlineSnapshot(`
"### Directives

#### [\`foo\`](/bar)
 Test testA
 

"
`);
    });

    test("exclude undefined description", () => {
      expect.assertions(1);

      const mockConstDirectiveMap = {
        testA: options.customDirectives["noDescriptor" as DirectiveName],
      };
      jest
        .spyOn(GraphQL, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest
        .spyOn(Link, "printLink")
        .mockReturnValue("[`foo`](/bar)" as MDXString);

      expect(printCustomDirectives(type, options)).toBe("");
    });
  });

  describe("getCustomTags()", () => {
    test("does not return tags if type has no matching directive", () => {
      expect.hasAssertions();

      jest.spyOn(Utils, "isEmpty").mockReturnValue(true);

      const tags = getCustomTags(type, options);

      expect(tags).toStrictEqual([]);
    });

    test("return tags matching directives", () => {
      expect.hasAssertions();

      const mockConstDirectiveMap = {
        testA: options.customDirectives["testA" as DirectiveName],
      };

      jest
        .spyOn(GraphQL, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest.spyOn(Utils, "isEmpty").mockReturnValue(false);

      const tags = getCustomTags(type, options);

      expect(tags).toStrictEqual([{ text: "@testA", classname: "warning" }]);
    });
  });

  describe("printCustomTags()", () => {
    test("prints empty string if type has no matching directive", () => {
      expect.hasAssertions();

      jest.spyOn(Utils, "isEmpty").mockReturnValue(true);

      const tags = printCustomTags(type, options);

      expect(tags).toBe("");
    });
    test("prints MDX badge for tags matching directives", () => {
      expect.hasAssertions();

      const mockConstDirectiveMap = {
        testA: options.customDirectives["testA" as DirectiveName],
      };
      jest
        .spyOn(GraphQL, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest.spyOn(Utils, "isEmpty").mockReturnValue(false);
      jest.spyOn(Utils, "escapeMDX").mockImplementation((text: unknown) => {
        return text as string;
      });

      const tags = printCustomTags(type, options);

      expect(tags).toBe('<mark class="gqlmd-mdx-badge">@testA</mark>');
    });
  });
});
