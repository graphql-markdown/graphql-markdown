import type { PrintTypeOptions } from "@graphql-markdown/types";

import { buildSchema } from "graphql/utilities";

import { getDirectiveExampleOption, printExample } from "../../src/example";

import * as Common from "../../src/common";
jest.mock("../../src/common");

import * as Link from "../../src/link";
jest.mock("../../src/link");

describe("example", () => {
  const schema = buildSchema(`
  directive @example(
    value: String
  ) on OBJECT | FIELD_DEFINITION | SCALAR

  directive @test(
    value: String
  ) on OBJECT | FIELD_DEFINITION | SCALAR

  scalar ScalarExample @example(value: "This is an example")

  scalar JSON

  type TypeExtrapolateExample {
    example: ScalarExample
    value: JSON @example(value: "{\\"example\\": \\"This is an example\\"}")
    id: ID!
  }

  type TypeExample @example(value: "{\\"example\\": \\"This is an example\\", \\"value\\": {}}") {
    example: ScalarExample
    value: JSON
    id: ID!
  }

  type TypeNestedExample {
    id: ID!
    privateExample: TypeExample
    publicExample: TypeExtrapolateExample
  }

  type TypeListExample {
    example: [ScalarExample!]!
  }

  type TypeComplexExample {
    example: [TypeListExample!]!
  }

  type Query {
    example(id: ID!): TypeExample @example(value: "query { example(id: \\"1\\") { example value id } }")
    examples(id: ID!): [TypeExample]
  }

  input SpectaQLInput {
    key: String!
    value: String!
  }

  directive @spectaql(
    options: [SpectaQLInput!]!
  ) on OBJECT | FIELD_DEFINITION | SCALAR

  type CustomExampleDirective {
    myField: String @spectaql(options: [{ key: "undocumented", value: "true" }])
    myFieldOtherField: String @spectaql(options: [{ key: "example", value: "An Example from the Directive" }])
    myFieldOtherOtherField: String @spectaql(options: [{ key: "examples", value: "[\\"Example 1 from the Directive\\", \\"Example 2 from the Directive\\"]" }])
  }
`);

  beforeEach(() => {
    jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(true);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getDirectiveExampleOption()", () => {
    test("returns default settings if no override", () => {
      expect.assertions(1);

      expect(
        getDirectiveExampleOption({
          schema,
        } as PrintTypeOptions),
      ).toMatchObject({
        directive: schema.getDirective("example"),
        field: "value",
        parser: undefined,
      });
    });

    test("returns undefined if directive does not exist", () => {
      expect.assertions(1);

      expect(
        getDirectiveExampleOption({
          schema: {},
        } as PrintTypeOptions),
      ).toBeUndefined();
    });

    test.each([
      {
        option: "directive",
        value: "test",
        expected: schema.getDirective("test"),
      },
      { option: "field", value: "test", expected: "test" },
    ])("returns override parameter $option", ({ option, value, expected }) => {
      expect.assertions(1);

      expect(
        getDirectiveExampleOption({
          schema,
          exampleSection: {
            [option]: value,
          } as unknown,
        } as PrintTypeOptions),
      ).toEqual(
        expect.objectContaining({
          [option]: expected,
        }),
      );
    });
  });

  describe("printExample()", () => {
    test("returns a formatted example for the type using @example directive for scalar", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("ScalarExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe('"This is an example"');
    });

    test("returns a formatted example for the operation using @example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getQueryType()?.getFields().example, {
          schema,
        } as PrintTypeOptions),
      ).toBe('{\n  example(id: "1") {\n    example\n    value\n    id\n  }\n}');
    });

    test("returns undefined if the operation has no @example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getQueryType()?.getFields().examples, {
          schema,
        } as PrintTypeOptions),
      ).toBeUndefined();
    });

    test("returns undefined if no example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("JSON"), {
          schema,
        } as PrintTypeOptions),
      ).toBeUndefined();
    });

    test("returns undefined if directive not printable", () => {
      expect.assertions(1);

      jest.spyOn(Link, "hasPrintableDirective").mockReturnValue(false);

      expect(
        printExample(schema.getType("ScalarExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBeUndefined();
    });

    test("returns undefined if not a valid GraphQL type", () => {
      expect.assertions(1);

      expect(
        printExample({}, {
          schema,
        } as PrintTypeOptions),
      ).toBeUndefined();
    });

    test("returns JSON formatted string example using subtype examples", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExtrapolateExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe(
        '{\n  "example": "This is an example",\n  "value": {\n    "example": "This is an example"\n  }\n}',
      );
    });

    test("returns JSON formatted string example using subtype examples skipping non printable type", () => {
      expect.assertions(1);

      jest
        .spyOn(Link, "hasPrintableDirective")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((type, _options) => {
          return (type as { name: string }).name !== "ScalarExample";
        });

      expect(
        printExample(schema.getType("TypeExtrapolateExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe('{\n  "value": {\n    "example": "This is an example"\n  }\n}');
    });

    test("skips attributes of non-printable type", () => {
      expect.assertions(1);

      jest
        .spyOn(Link, "hasPrintableDirective")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementation((type, _options) => {
          return (type as { name: string }).name !== "TypeExample";
        });

      expect(
        printExample(schema.getType("TypeNestedExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe(
        '{\n  "publicExample": {\n    "example": "This is an example",\n    "value": {\n      "example": "This is an example"\n    }\n  }\n}',
      );
    });

    test("returns a formatted example for the type using @example directive for complex type", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe('{\n  "example": "This is an example",\n  "value": {}\n}');
    });

    test("returns a formatted example supporting list format", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeListExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe('{\n  "example": [\n    "This is an example"\n  ]\n}');
    });

    test("returns an extrapolated from complex types", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeComplexExample"), {
          schema,
        } as PrintTypeOptions),
      ).toBe(
        '{\n  "example": [\n    {\n      "example": [\n        "This is an example"\n      ]\n    }\n  ]\n}',
      );
    });

    test("returns a formatted example using custom parser", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("CustomExampleDirective"), {
          schema,
          exampleSection: {
            directive: "spectaql",
            field: "options",
            parser: (options: unknown): unknown => {
              const example = (
                options as [{ key: string; value: string }]
              ).find((option) => {
                return ["example", "examples"].includes(option.key);
              });
              if (!example) {
                return undefined;
              }
              if (example.key === "example") {
                return example.value;
              }
              return (JSON.parse(example.value) as string[])[0];
            },
          },
        } as PrintTypeOptions),
      ).toBe(
        '{\n  "myFieldOtherField": "An Example from the Directive",\n  "myFieldOtherOtherField": "Example 1 from the Directive"\n}',
      );
    });
  });
});
