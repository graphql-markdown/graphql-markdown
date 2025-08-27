import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from "graphql/type";

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
