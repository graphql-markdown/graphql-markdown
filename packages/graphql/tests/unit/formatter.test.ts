import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from "graphql/type";
import { Kind, parseValue, print } from "graphql/language";

// graphql-js 16 prints `{k: 1}`, 17 prints `{ k: 1 }`: compare against the
// installed version's own printing of the expected value.
const printed = (value: string): string => {
  return print(parseValue(value));
};

import { getFormattedDefaultValue } from "../../src/formatter";

describe("formatter", () => {
  describe("getFormattedDefaultValue()", () => {
    test("returns undefined if type is undefined", () => {
      expect.hasAssertions();
      expect(
        getFormattedDefaultValue({ type: undefined, defaultValue: 5 }),
      ).toBeUndefined();
    });

    test.each([
      { type: GraphQLInt, defaultValue: 5 },
      { type: GraphQLInt, defaultValue: 0 },
      { type: GraphQLFloat, defaultValue: 5.3 },
      { type: GraphQLFloat, defaultValue: 0.0 },
      { type: GraphQLBoolean, defaultValue: true },
      { type: GraphQLBoolean, defaultValue: false },
    ])(
      "returns $defaultValue value as default for $type",
      ({ type, defaultValue }) => {
        expect.hasAssertions();

        const argument = {
          name: "foobar",
          description: undefined,
          type,
          defaultValue,
          extensions: undefined,
        };

        expect(getFormattedDefaultValue(argument)).toEqual(defaultValue);
      },
    );

    test.each([
      { type: GraphQLInt },
      { type: GraphQLID },
      { type: GraphQLFloat },
      { type: GraphQLString },
      { type: GraphQLBoolean },
      { type: new GraphQLList(GraphQLID) },
    ])(
      "returns undefined for type $type if not default value defined",
      ({ type }) => {
        expect.hasAssertions();

        const argument = {
          name: "foobar",
          description: undefined,
          type,
          defaultValue: undefined,
          extensions: undefined,
        };

        expect(getFormattedDefaultValue(argument)).toBeUndefined();
      },
    );

    test.each([
      {
        type: new GraphQLList(GraphQLID),
        defaultValue: ["0", "1"],
        expected: '["0", "1"]',
      },
      {
        type: new GraphQLList(GraphQLInt),
        defaultValue: 42,
        expected: "[42]",
      },
    ])(
      "returns array default value as string for type $type",
      ({ type, defaultValue, expected }) => {
        expect.hasAssertions();

        const argument = {
          name: "id",
          description: undefined,
          type,
          defaultValue,
          extensions: undefined,
        };

        expect(getFormattedDefaultValue(argument)).toBe(expected);
      },
    );

    test("returns unformatted default value for type GraphQLEnum", () => {
      expect.hasAssertions();

      const enumType = new GraphQLEnumType({
        name: "RGB",
        values: {
          RED: { value: "RED" },
          GREEN: { value: "GREEN" },
          BLUE: { value: "BLUE" },
        },
      });

      const argument = {
        name: "color",
        description: undefined,
        type: enumType,
        defaultValue: "RED",
        extensions: undefined,
      };

      expect(getFormattedDefaultValue(argument)).toBe("RED");
    });

    test("returns array default value unformatted for type GraphQLList(GraphQLEnum)", () => {
      expect.hasAssertions();

      const enumType = new GraphQLEnumType({
        name: "RGB",
        values: {
          RED: { value: "RED" },
          GREEN: { value: "GREEN" },
          BLUE: { value: "BLUE" },
        },
      });

      const argument = {
        name: "color",
        description: undefined,
        type: new GraphQLList(enumType),
        defaultValue: ["RED"],
        extensions: undefined,
      };

      expect(getFormattedDefaultValue(argument)).toBe("[RED]");
    });

    test("returns object default value unformatted for type InputObject", () => {
      expect.hasAssertions();

      const enumType = new GraphQLEnumType({
        name: "RGB",
        values: {
          RED: { value: "RED" },
          GREEN: { value: "GREEN" },
          BLUE: { value: "BLUE" },
        },
      });

      const input = new GraphQLInputObjectType({
        name: "TestInput",
        fields: {
          foo: { type: enumType },
        },
      });

      const argument = {
        name: "color",
        description: undefined,
        type: input,
        defaultValue: { foo: "RED" },
        extensions: undefined,
      };

      expect(getFormattedDefaultValue(argument)).toBe("{ foo: RED }");
    });
  });
});

describe("getFormattedDefaultValue() string escaping", () => {
  const malicious = "\n```\n<img src=x onerror=alert(1) />\n```\n";
  const scalar = new GraphQLScalarType({ name: "Custom" });

  test("prints a String default as an escaped single-line literal", () => {
    expect.hasAssertions();

    const result = getFormattedDefaultValue({
      type: GraphQLString,
      defaultValue: malicious,
    })!;

    expect(result).not.toContain("\n");
    expect(result).toBe(print({ kind: Kind.STRING, value: malicious }));
    expect(result).toBe('"\\n```\\n<img src=x onerror=alert(1) />\\n```\\n"');
  });

  test("escapes quotes and backslashes", () => {
    expect.hasAssertions();

    expect(
      getFormattedDefaultValue({ type: GraphQLString, defaultValue: 'a"b\\c' }),
    ).toBe('"a\\"b\\\\c"');
  });

  test("quotes and escapes a String! default", () => {
    expect.hasAssertions();

    expect(
      getFormattedDefaultValue({
        type: new GraphQLNonNull(GraphQLString),
        defaultValue: "a\nb",
      }),
    ).toBe('"a\\nb"');
  });

  test("quotes and escapes a [String]! default", () => {
    expect.hasAssertions();

    expect(
      getFormattedDefaultValue({
        type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        defaultValue: ["a", 'b"'],
      }),
    ).toBe('["a", "b\\""]');
  });

  test("quotes a custom scalar string default", () => {
    expect.hasAssertions();

    expect(
      getFormattedDefaultValue({ type: scalar, defaultValue: "x\ny" }),
    ).toBe('"x\\ny"');
  });

  test("keeps a non-null enum default unquoted", () => {
    expect.hasAssertions();

    const enumType = new GraphQLEnumType({
      name: "E",
      values: { A: { value: "A" } },
    });

    expect(
      getFormattedDefaultValue({
        type: new GraphQLNonNull(enumType),
        defaultValue: "A",
      }),
    ).toBe("A");
  });

  test("leaves Int and Boolean unchanged", () => {
    expect.hasAssertions();

    expect(
      getFormattedDefaultValue({
        type: new GraphQLNonNull(GraphQLInt),
        defaultValue: 3,
      }),
    ).toBe(3);
    expect(
      getFormattedDefaultValue({ type: GraphQLBoolean, defaultValue: false }),
    ).toBe(false);
  });
});

describe("getFormattedDefaultValue() custom scalar list and object defaults", () => {
  const json = new GraphQLScalarType({ name: "JSON" });

  test("prints a custom scalar array default as a single-line escaped list", () => {
    expect.hasAssertions();

    const result = getFormattedDefaultValue({
      type: json,
      defaultValue: ["a\n```\n<img src=x onerror=alert(1) />"],
    })!;

    expect(result).not.toContain("\n");
    expect(result).toBe(
      print({
        kind: Kind.LIST,
        values: [
          {
            kind: Kind.STRING,
            value: "a\n```\n<img src=x onerror=alert(1) />",
          },
        ],
      }),
    );
    expect(result).toBe('["a\\n```\\n<img src=x onerror=alert(1) />"]');
  });

  test("prints a custom scalar object default as a single-line escaped object", () => {
    expect.hasAssertions();

    const result = getFormattedDefaultValue({
      type: json,
      defaultValue: { k: "x\n```", n: 1, b: true, z: null, l: ["y"] },
    })!;

    expect(result).not.toContain("\n");
    expect(result).not.toContain("[object Object]");
    expect(result).toBe(
      printed('{ k: "x\\n```", n: 1, b: true, z: null, l: ["y"] }'),
    );
  });

  test("skips object keys that are not valid GraphQL names", () => {
    expect.hasAssertions();

    expect(
      getFormattedDefaultValue({
        type: json,
        defaultValue: {
          "bad-key": "x",
          ok: "y",
          fn: () => {
            return 1;
          },
        },
      }),
    ).toBe(printed('{ ok: "y" }'));
  });
});
