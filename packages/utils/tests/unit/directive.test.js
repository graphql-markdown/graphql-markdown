const { getCustomDirectives } = require("../../src/directive");

const { buildSchema } = require("graphql");

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

  const descriptor = (directiveType, constDirectiveType) =>
    `Test${constDirectiveType.name.value}`;
  const customDirectiveOptions = {
    testA: {
      descriptor,
    },
    nonExist: {
      descriptor,
    },
  };

  describe("getCustomDirectives()", () => {
    const schemaMap = {
      directives: {
        testA: schema.getDirective("testA"),
        testB: schema.getDirective("testB"),
      },
    };

    test("returns undefined if customDirectiveOptions not defined", () => {
      expect.assertions(1);

      expect(getCustomDirectives(schemaMap, undefined)).toBeUndefined();
    });

    test("returns undefined if schema map contains no directive definitions", () => {
      expect.assertions(1);

      expect(getCustomDirectives({}, customDirectiveOptions)).toBeUndefined();
    });

    test("returns matching custom directives in schema", () => {
      expect.assertions(1);

      expect(
        getCustomDirectives(schemaMap, customDirectiveOptions),
      ).toMatchSnapshot();
    });

    test("returns undefined if no match", () => {
      expect.assertions(1);

      expect(getCustomDirectives(schemaMap, {})).toBeUndefined();
    });
  });
});
