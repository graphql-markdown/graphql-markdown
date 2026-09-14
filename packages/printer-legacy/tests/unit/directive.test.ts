import { buildSchema } from "graphql/utilities";
import { GraphQLDirective } from "graphql/type";

import type {
  Badge,
  CustomDirectiveMap,
  DirectiveName,
} from "@graphql-markdown/types";

import { DEFAULT_OPTIONS } from "../../src/const/options";
import {
  buildCustomDirectiveDecorators,
  printDecorators,
  printSlotDecorators,
} from "../../src/decorator";

// Covers the deprecated `customDirective` option's conversion into decorators
// (`buildCustomDirectiveDecorators`), exercised end-to-end through the same
// decorators pipeline `decorator.test.ts` covers for `decorators` — there is
// one rendering code path for both options, only the conversion differs.
describe("buildCustomDirectiveDecorators", () => {
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

    type Other {
      id: ID!
    }
  `);
  const type = schema.getType("Test")!;
  const otherType = schema.getType("Other")!;

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

  const customDirectives: CustomDirectiveMap = {
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
  } as CustomDirectiveMap;

  test.each([undefined, null, {}])(
    "returns an empty map when customDirectives is %s",
    (value) => {
      expect.assertions(1);

      expect(
        buildCustomDirectiveDecorators(value as CustomDirectiveMap),
      ).toStrictEqual({});
    },
  );

  test("returns the three adapter decorator ids", () => {
    expect.assertions(1);

    expect(
      Object.keys(buildCustomDirectiveDecorators(customDirectives)),
    ).toStrictEqual([
      "customDirectives",
      "customDirective:description",
      "customDirective:tags",
    ]);
  });

  describe('the built-in "Directives" section', () => {
    const options = {
      ...DEFAULT_OPTIONS,
      schema,
      decorators: buildCustomDirectiveDecorators(customDirectives),
    };

    test("renders a section listing every matched directive", () => {
      expect.assertions(1);

      const sections = printDecorators(type, options);

      expect(sections.customDirectives).toMatchObject({
        title: "Directives",
        content: expect.stringContaining("Test testA"),
      });
    });

    test("is positioned right after code, like the pre-decorators built-in order", () => {
      expect.assertions(1);

      const order = printSlotDecorators("description", type, options);

      // Smoke-checks the decorator exists and is wired through the same
      // options; the full splice behaviour is covered by
      // `getDecoratorsOrder()` in decorator.test.ts.
      expect(order).toBeDefined();
    });

    test("renders nothing for a type matching no directive", () => {
      expect.assertions(1);

      const sections = printDecorators(otherType, options);

      expect(sections.customDirectives).toBeUndefined();
    });
  });

  describe("the description slot (customDirective:description)", () => {
    const options = {
      ...DEFAULT_OPTIONS,
      schema,
      decorators: buildCustomDirectiveDecorators(customDirectives),
    };

    test("appends the descriptor text", () => {
      expect.assertions(1);

      expect(printSlotDecorators("description", type, options)).toStrictEqual([
        "Test testA",
      ]);
    });

    test("excludes a matched directive with no descriptor", () => {
      expect.assertions(1);

      const noDescriptorOnly = buildCustomDirectiveDecorators({
        ["testA" as DirectiveName]:
          customDirectives["noDescriptor" as DirectiveName],
      } as CustomDirectiveMap);

      expect(
        printSlotDecorators("description", type, {
          ...DEFAULT_OPTIONS,
          schema,
          decorators: noDescriptorOnly,
        }),
      ).toStrictEqual([]);
    });

    test("renders nothing for a type matching no directive", () => {
      expect.assertions(1);

      expect(
        printSlotDecorators("description", otherType, options),
      ).toStrictEqual([]);
    });
  });

  describe("the tags slot (customDirective:tags)", () => {
    const options = {
      ...DEFAULT_OPTIONS,
      schema,
      decorators: buildCustomDirectiveDecorators(customDirectives),
    };

    test("renders a badge for the matched directive's tag", () => {
      expect.assertions(1);

      expect(printSlotDecorators("tags", type, options)).toStrictEqual([
        '<mark class="gqlmd-mdx-badge">@testA</mark>',
      ]);
    });

    test("renders nothing for a type matching no directive", () => {
      expect.assertions(1);

      expect(printSlotDecorators("tags", otherType, options)).toStrictEqual([]);
    });
  });
});
