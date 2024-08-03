import {
  GraphQLDirective,
  GraphQLInt,
  GraphQLScalarType,
  GraphQLString,
} from "graphql/type";

jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    getFormattedDefaultValue: jest.fn((type): unknown => {
      return type?.defaultValue;
    }),
    getTypeName: jest.fn((t): string => {
      return (t.name ?? t.toString()) as string;
    }),
    hasDirective: jest.fn(),
    isDeprecated: jest.fn((t): boolean => {
      return (t.isDeprecated as boolean) || false;
    }),
  };
});

import { printCodeArguments, printCodeField } from "../../src/code";
import { DEFAULT_OPTIONS } from "../../src/const/options";

describe("code", () => {
  afterAll(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe("printCodeArguments()", () => {
    test("returns a Markdown one line per formatted argument with default value surrounded by ()", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "OperationName",
        locations: [],
        args: {
          ParamWithDefault: {
            type: GraphQLString,
            defaultValue: "defaultValue",
          },
          ParamNoDefault: {
            type: new GraphQLScalarType<unknown>({ name: "Any" }),
          },
          ParamIntZero: { type: GraphQLInt, defaultValue: 0 },
          ParamIntNoDefault: { type: GraphQLInt },
        },
      });

      const code = printCodeArguments(type);

      expect(code).toMatchInlineSnapshot(`
        "(
          ParamWithDefault: String = defaultValue
          ParamNoDefault: Any
          ParamIntZero: Int = 0
          ParamIntNoDefault: Int
        )"
      `);
    });

    test("returns an empty string if args list empty", () => {
      expect.hasAssertions();

      const type = {
        name: "OperationName",
        args: [],
      };

      const code = printCodeArguments(type);

      expect(code).toBe("");
    });

    test("returns an empty string if no args", () => {
      expect.hasAssertions();

      const type = {
        name: "OperationName",
      };

      const code = printCodeArguments(type);

      expect(code).toBe("");
    });
  });

  describe("printCodeField()", () => {
    test("returns a field with its type", () => {
      expect.hasAssertions();

      const type = { name: "FooBar", type: "string" };

      const code = printCodeField(type);

      expect(code).toMatchInlineSnapshot(`
        "FooBar: string
        "
      `);
    });

    test("returns a field with its type and arguments", () => {
      expect.hasAssertions();

      const type = {
        name: "TypeFooBar",
        type: GraphQLString,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      const code = printCodeField(type);

      expect(code).toMatchInlineSnapshot(`
        "TypeFooBar(
          ArgFooBar: String
        ): String
        "
      `);
    });

    test("returns an empty string in @deprecated and SKIP", () => {
      expect.hasAssertions();

      const type = {
        name: "TypeFooBar",
        type: GraphQLString,
        isDeprecated: true,
        args: [
          {
            name: "ArgFooBar",
            type: GraphQLString,
          },
        ],
      };

      const code = printCodeField(type, {
        ...DEFAULT_OPTIONS,
        deprecated: "skip",
      });

      expect(code).toBe("");
    });
  });
});
