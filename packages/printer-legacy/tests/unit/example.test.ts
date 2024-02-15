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
    value: JSON
  }

  type TypeExample @example(value: "{\\\"example\\\": \\\"This is an example\\\", \\\"value\\\": {}}") {
    example: ScalarExample
    value: JSON
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
      ).toBe("This is an example");
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

    test("returns JSON formatted string example using subtype examples", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExtrapolateExample"), {
          directive: exampleDirective,
          argName: "value",
        }),
      ).toBe('{"example":"This is an example"}');
    });

    test("returns a formatted example for the type using @example directive for complex type", () => {
      expect.assertions(1);

      expect(
        printExample(schema.getType("TypeExample"), {
          directive: exampleDirective,
          argName: "value",
        }),
      ).toBe('{"example": "This is an example", "value": {}}');
    });
  });
});
