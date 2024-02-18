import { buildSchema } from "graphql/utilities";

import { printExample } from "../../src/example";

describe("example", () => {
  const schema = buildSchema(`
  directive @example(
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
  const exampleDirective = schema.getDirective("example")!;

  describe("printExample()", () => {
    test("returns a formatted example for the type using @example directive for scalar", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("ScalarExample"), {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBe('"This is an example"');
    });

    test("returns a formatted example for the operation using @example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getQueryType()?.getFields().example, {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBe('{\n  example(id: "1") {\n    example\n    value\n    id\n  }\n}');
    });

    test("returns undefined if the operation has no @example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getQueryType()?.getFields().examples, {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBeUndefined();
    });

    test("returns undefined if no example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("JSON"), {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBeUndefined();
    });

    test("returns undefined if not a valid GraphQL type", () => {
      expect.assertions(1);

      expect(
        printExample(
          {},
          {
            directive: exampleDirective,
            field: "value",
          },
        ),
      ).toBeUndefined();
    });

    test("returns JSON formatted string example using subtype examples", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExtrapolateExample"), {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBe(
        '{\n  "example": "This is an example",\n  "value": {\n    "example": "This is an example"\n  }\n}',
      );
    });

    test("returns a formatted example for the type using @example directive for complex type", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExample"), {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBe('{\n  "example": "This is an example",\n  "value": {}\n}');
    });

    test("returns a formatted example supporting list format", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeListExample"), {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBe('{\n  "example": [\n    "This is an example"\n  ]\n}');
    });

    test("returns an extrapolated from complex types", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeComplexExample"), {
          directive: exampleDirective,
          field: "value",
        }),
      ).toBe(
        '{\n  "example": [\n    {\n      "example": [\n        "This is an example"\n      ]\n    }\n  ]\n}',
      );
    });

    test("returns a formatted example using custom parser", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("CustomExampleDirective"), {
          directive: schema.getDirective("spectaql")!,
          field: "options",
          parser: (options: unknown): unknown => {
            const example = (options as [{ key: string; value: string }]).find(
              (option) => {
                return ["example", "examples"].includes(option.key);
              },
            );
            if (!example) {
              return undefined;
            }
            if (example.key === "example") {
              return example.value;
            }
            return (JSON.parse(example.value) as string[])[0];
          },
        }),
      ).toBe(
        '{\n  "myFieldOtherField": "An Example from the Directive",\n  "myFieldOtherOtherField": "Example 1 from the Directive"\n}',
      );
    });
  });
});
