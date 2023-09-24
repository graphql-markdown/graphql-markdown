import { GraphQLDirective, buildSchema } from "graphql";

import type {
  DirectiveName,
  CustomDirective,
  CustomDirectiveFunction,
  Maybe,
  CustomDirectiveMap,
} from "@graphql-markdown/types";

import * as Directives from "../../src/directive";
const {
  getConstDirectiveMap,
  getCustomDirectiveOptions,
  getCustomDirectives,
  isCustomDirective,
} = Directives;

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
  `);

  const descriptor: CustomDirectiveFunction = (
    directive: Maybe<GraphQLDirective>,
  ): string => {
    return `Test ${directive!.name}`;
  };
  const wildcard: CustomDirectiveFunction = (
    directive: Maybe<GraphQLDirective>,
  ): string => {
    return `TestWildcard ${directive!.name}`;
  };
  const customDirectiveOptions: CustomDirective = {
    ["testA" as DirectiveName]: {
      descriptor,
    },
    ["nonExist" as DirectiveName]: {
      descriptor,
    },
  };

  const schemaMap = {
    directives: {
      testA: schema.getDirective("testA")!,
      testB: schema.getDirective("testB")!,
    },
  };

  describe("isCustomDirective()", () => {
    test("returns true if directive name listed in customDirectives", () => {
      expect.assertions(1);

      expect(
        isCustomDirective("testA" as DirectiveName, customDirectiveOptions),
      ).toBeTruthy();
    });

    test("returns true if customDirective has wildcard", () => {
      expect.assertions(1);

      expect(
        isCustomDirective("testB" as DirectiveName, {
          ["*" as DirectiveName]: {},
        }),
      ).toBeTruthy();
    });

    test("returns false if no match", () => {
      expect.assertions(1);

      expect(
        isCustomDirective("testC" as DirectiveName, customDirectiveOptions),
      ).toBeFalsy();
    });
  });

  describe("getCustomDirectiveOptions()", () => {
    test("returns specific description if match", () => {
      expect.assertions(2);

      const descriptorDirective = getCustomDirectiveOptions(
        "testA" as DirectiveName,
        {
          ["*" as DirectiveName]: { descriptor: wildcard },
          ...customDirectiveOptions,
        },
      )!;

      expect(descriptorDirective.descriptor).toBeDefined();

      expect(descriptorDirective.descriptor!(schemaMap.directives.testA)).toBe(
        "Test testA",
      );
    });

    test("returns wildcard description if wildcard match", () => {
      expect.assertions(2);

      const descriptorDirective = getCustomDirectiveOptions(
        "testB" as DirectiveName,
        {
          ["*" as DirectiveName]: { descriptor: wildcard },
          ...customDirectiveOptions,
        },
      )!;

      expect(descriptorDirective.descriptor).toBeDefined();

      expect(descriptorDirective.descriptor!(schemaMap.directives.testB)).toBe(
        "TestWildcard testB",
      );
    });

    test("returns undefined if no match", () => {
      expect.assertions(1);

      const descriptorDirective = getCustomDirectiveOptions(
        "testC" as DirectiveName,
        customDirectiveOptions,
      );

      expect(descriptorDirective).toBeUndefined();
    });
  });

  describe("getCustomDirectives()", () => {
    test("returns undefined if customDirectiveOptions not defined", () => {
      expect.assertions(1);

      expect(getCustomDirectives(schemaMap)).toBeUndefined();
    });

    test("returns undefined if schema map is undefined", () => {
      expect.assertions(1);

      expect(
        getCustomDirectives({ directives: undefined }, customDirectiveOptions),
      ).toBeUndefined();
    });

    test("returns undefined if schema map contains no directive definitions", () => {
      expect.assertions(1);

      expect(getCustomDirectives({}, customDirectiveOptions)).toBeUndefined();
    });

    test("returns matching custom directives in schema", () => {
      expect.assertions(2);

      const customDirectives = getCustomDirectives(
        schemaMap,
        customDirectiveOptions,
      )!;

      expect(customDirectives).toMatchInlineSnapshot(`
      {
        "testA": {
          "descriptor": [Function],
          "type": "@testA",
        },
      }
      `);
      expect(
        customDirectives["testA" as DirectiveName].descriptor!(
          schemaMap.directives.testA,
        ),
      ).toBe("Test testA");
    });

    test("returns undefined if no match", () => {
      expect.assertions(1);

      expect(getCustomDirectives(schemaMap, {})).toBeUndefined();
    });

    test("returns all directives if wildcard", () => {
      expect.assertions(3);

      const customDirectives = getCustomDirectives(schemaMap, {
        ["*" as DirectiveName]: { descriptor: wildcard } as CustomDirective,
      })!;

      expect(customDirectives).toMatchInlineSnapshot(`
      {
        "testA": {
          "descriptor": [Function],
          "type": "@testA",
        },
        "testB": {
          "descriptor": [Function],
          "type": "@testB",
        },
      }
      `);

      expect(
        customDirectives["testA" as DirectiveName].descriptor!(
          schemaMap.directives.testA,
        ),
      ).toBe("TestWildcard testA");

      expect(
        customDirectives["testB" as DirectiveName].descriptor!(
          schemaMap.directives.testB,
        ),
      ).toBe("TestWildcard testB");
    });

    test("returns all directives if wildcard without overriding specifics", () => {
      expect.assertions(3);

      const customDirectives = getCustomDirectives(schemaMap, {
        ["*" as DirectiveName]: { descriptor: wildcard } as CustomDirective,
        ...customDirectiveOptions,
      })!;

      expect(customDirectives).toMatchInlineSnapshot(`
      {
        "testA": {
          "descriptor": [Function],
          "type": "@testA",
        },
        "testB": {
          "descriptor": [Function],
          "type": "@testB",
        },
      }
      `);

      expect(
        customDirectives["testA" as DirectiveName].descriptor!(
          schemaMap.directives.testA,
        ),
      ).toBe("Test testA");

      expect(
        customDirectives["testB" as DirectiveName].descriptor!(
          schemaMap.directives.testB,
        ),
      ).toBe("TestWildcard testB");
    });
  });

  describe("getConstDirectiveMap", () => {
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

      type TestWithoutDirective {
        id: ID!
      }
    `);
    const type = schema.getType("Test")!;
    const typeWithoutDirective = schema.getType("TestWithoutDirective")!;
    const descriptor: CustomDirectiveFunction = (
      directive: Maybe<GraphQLDirective>,
    ): string => {
      return `Test${directive!.name}`;
    };
    const options: { customDirectives: CustomDirectiveMap } = {
      customDirectives: {
        ["testA" as DirectiveName]: {
          type: schema.getDirective("testA")!,
          descriptor,
        },
        ["nonExist" as DirectiveName]: {
          type: new GraphQLDirective({ name: "nonExist", locations: [] }),
          descriptor,
        },
      },
    };

    test("returns undefined when config is not set", () => {
      expect.assertions(1);

      const map = getConstDirectiveMap(type, undefined);

      expect(map).toBeUndefined();
    });

    test("returns undefined when config custom directive does not exist", () => {
      expect.assertions(1);

      const map = getConstDirectiveMap(
        typeWithoutDirective,
        options.customDirectives,
      );

      expect(map).toBeUndefined();
    });

    test("returns custom directives map", () => {
      expect.assertions(1);

      const map = getConstDirectiveMap(type, options.customDirectives);

      expect(map).toMatchInlineSnapshot(`
      {
        "testA": {
          "descriptor": [Function],
          "type": "@testA",
        },
      }
      `);
    });
  });
});
