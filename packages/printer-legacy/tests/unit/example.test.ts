import { buildSchema } from "graphql";

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
`);
  const exampleDirective = schema.getDirective("example")!;

  describe("printExample()", () => {
    test("returns a formatted example for the type using @example directive for scalar", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("ScalarExample"), {
          directive: exampleDirective,
          argName: "value",
        }),
      ).toBe('"This is an example"');
    });

    test("returns undefined if no example directive", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("JSON"), {
          directive: exampleDirective,
          argName: "value",
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
            argName: "value",
          },
        ),
      ).toBeUndefined();
    });

    test("returns JSON formatted string example using subtype examples", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExtrapolateExample"), {
          directive: exampleDirective,
          argName: "value",
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
          argName: "value",
        }),
      ).toBe('{\n  "example": "This is an example",\n  "value": {}\n}');
    });

    test("returns a formatted example supporting list format", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeListExample"), {
          directive: exampleDirective,
          argName: "value",
        }),
      ).toBe('{\n  "example": [\n    "This is an example"\n  ]\n}');
    });

    test("returns an extrapolated from complex types", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeComplexExample"), {
          directive: exampleDirective,
          argName: "value",
        }),
      ).toBe(
        '{\n  "example": [\n    {\n      "example": [\n        "This is an example"\n      ]\n    }\n  ]\n}',
      );
    });
  });
});
