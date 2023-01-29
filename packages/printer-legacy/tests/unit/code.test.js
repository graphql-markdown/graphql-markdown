const {
  GraphQLDirective,

  GraphQLString,
} = require("graphql");

const { printCodeArguments, printCodeField } = require("../../src/code");

describe("code", () => {
  describe("printCodeArguments()", () => {
    test("returns a Markdown one line per formatted argument with default value surrounded by ()", () => {
      expect.hasAssertions();

      const type = new GraphQLDirective({
        name: "OperationName",
        locations: [],
        args: {
          ParamWithDefault: {
            type: "string",
            defaultValue: "defaultValue",
          },
          ParamNoDefault: { type: "any" },
          ParamIntZero: { type: "int", defaultValue: 0 },
          ParamIntNoDefault: { type: "int" },
        },
      });

      const code = printCodeArguments(type);

      expect(code).toMatchInlineSnapshot(`
        "(
          ParamWithDefault: string = defaultValue
          ParamNoDefault: any
          ParamIntZero: int = 0
          ParamIntNoDefault: int
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
  });
});
