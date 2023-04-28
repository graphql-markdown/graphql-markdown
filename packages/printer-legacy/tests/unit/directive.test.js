const { buildSchema } = require("graphql");

jest.mock("@graphql-markdown/utils", () => {
  return {
    graphql: { getConstDirectiveMap: jest.fn() },
  };
});
const Utils = require("@graphql-markdown/utils");

jest.mock("../../src/link", () => {
  return {
    printLink: jest.fn(),
  };
});
const Link = require("../../src/link");

const {
  printCustomDirectives,
  printCustomDirective,
  getCustomDirectiveDescription,
} = require("../../src/directive");

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

    type Test @testA {
      id: ID!
      fieldA: [String!] 
        @testA(arg: ARGC) 
        @testB(argA: 10, argB: ["testArgB"])
    }
  `);
  const type = schema.getType("Test");
  const descriptor = (directiveType, constDirectiveType) =>
    `Test${constDirectiveType.name.value}`;
  const options = {
    customDirectives: {
      testA: {
        type: schema.getDirective("testA"),
        descriptor,
      },
      nonExist: {
        type: undefined,
        descriptor,
      },
    },
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getCustomDirectiveDescription()", () => {
    test("returns description", () => {
      expect.assertions(1);

      const constDirectiveOption = {
        ...options.customDirectives.testA,
        constDirective: type.astNode.directives[0],
      };

      expect(
        getCustomDirectiveDescription(constDirectiveOption),
      ).toMatchInlineSnapshot(`"TesttestA"`);
    });
  });

  describe("printCustomDirective()", () => {
    test("returns a MDX string of Directive component", () => {
      expect.assertions(1);

      const constDirectiveOption = {
        ...options.customDirectives.testA,
        constDirective: type.astNode.directives[0],
      };

      jest.spyOn(Link, "printLink").mockReturnValue("[`foo`](/bar)");

      expect(printCustomDirective(type, constDirectiveOption, options))
        .toMatchInlineSnapshot(`
        "#### [\`foo\`](/bar)
        > TesttestA
        > "
      `);
    });
  });

  describe("printCustomDirectives()", () => {
    test("returns empty string when config is not set", () => {
      expect.assertions(1);

      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(undefined);

      expect(printCustomDirectives(type, {})).toBe("");
    });

    test("returns a MDX string of Directive components", () => {
      expect.assertions(1);

      const mockConstDirectiveMap = {
        testA: {
          ...options.customDirectives.testA,
          constDirective: type.astNode.directives[0],
        },
      };
      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest.spyOn(Link, "printLink").mockReturnValue("[`foo`](/bar)");

      expect(printCustomDirectives(type, options)).toMatchInlineSnapshot(`
        "### Directives

        #### [\`foo\`](/bar)
        > TesttestA
        > 

        "
      `);
    });
  });
});
