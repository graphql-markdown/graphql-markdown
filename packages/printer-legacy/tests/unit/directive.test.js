const { buildSchema } = require("graphql");

jest.mock("@graphql-markdown/utils", () => {
  return {
    hasProperty: jest.fn(),
    isEmpty: jest.fn(),
    getConstDirectiveMap: jest.fn(),
    escapeMDX: jest.fn(),
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
  getCustomTags,
  printCustomDirectives,
  printCustomDirective,
  printCustomTags,
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
  const descriptor = (directive) => `Test ${directive.name}`;
  const tag = (directive) => ({
    text: directive.toString(),
    classname: "warning",
  });
  const options = {
    customDirectives: {
      testA: {
        type: schema.getDirective("testA"),
        descriptor,
        tag,
      },
      nonExist: {
        type: undefined,
        descriptor,
      },
      noDescriptor: {
        type: undefined,
      },
    },
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("printCustomDirective()", () => {
    test("returns a MDX string of Directive component", () => {
      expect.assertions(1);

      const constDirectiveOption = options.customDirectives.testA;

      jest.spyOn(Link, "printLink").mockReturnValue("[`foo`](/bar)");
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);

      expect(printCustomDirective(type, constDirectiveOption, options))
        .toMatchInlineSnapshot(`
        "#### [\`foo\`](/bar)
        > Test testA
        > "
      `);
    });

    test("returns undefined if no descriptor exists", () => {
      expect.assertions(1);

      const constDirectiveOption = options.customDirectives.noDescriptor;

      jest.spyOn(Link, "printLink").mockReturnValue("[`foo`](/bar)");
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);

      expect(
        printCustomDirective(type, constDirectiveOption, options),
      ).toBeUndefined();
    });
  });

  describe("printCustomDirectives()", () => {
    test("returns empty string when config is not set", () => {
      expect.assertions(1);

      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(undefined);
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);

      expect(printCustomDirectives(type, {})).toBe("");
    });

    test("returns a MDX string of Directive components", () => {
      expect.assertions(1);

      const mockConstDirectiveMap = {
        testA: options.customDirectives.testA,
      };
      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest.spyOn(Link, "printLink").mockReturnValue("[`foo`](/bar)");
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);

      expect(printCustomDirectives(type, options)).toMatchInlineSnapshot(`
        "### Directives

        #### [\`foo\`](/bar)
        > Test testA
        > 

        "
      `);
    });

    test("exclude undefined description", () => {
      expect.assertions(1);

      const mockConstDirectiveMap = {
        testA: options.customDirectives.noDescriptor,
      };
      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);
      jest.spyOn(Link, "printLink").mockReturnValue("[`foo`](/bar)");
      jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);

      expect(printCustomDirectives(type, options)).toBe("");
    });
  });

  describe("getCustomTags()", () => {
    test("does not return tags if type has no matching directive", () => {
      expect.hasAssertions();

      jest.spyOn(Utils.object, "isEmpty").mockReturnValue(true);

      const tags = getCustomTags(type, options);

      expect(tags).toStrictEqual([]);
    });

    test("return tags matching directives", () => {
      expect.hasAssertions();

      const mockConstDirectiveMap = {
        testA: options.customDirectives.testA,
      };
      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);

      jest.spyOn(Utils.object, "isEmpty").mockReturnValue(false);

      const tags = getCustomTags(type, options);

      expect(tags).toStrictEqual([{ text: "@testA", classname: "warning" }]);
    });
  });

  describe("printCustomTags()", () => {
    test("prints empty string if type has no matching directive", () => {
      expect.hasAssertions();

      jest.spyOn(Utils.object, "isEmpty").mockReturnValue(true);

      const tags = printCustomTags(type, options);

      expect(tags).toBe("");
    });
    test("prints MDX badge for tags matching directives", () => {
      expect.hasAssertions();

      const mockConstDirectiveMap = {
        testA: options.customDirectives.testA,
      };
      jest
        .spyOn(Utils.graphql, "getConstDirectiveMap")
        .mockReturnValue(mockConstDirectiveMap);

      jest.spyOn(Utils.object, "isEmpty").mockReturnValue(false);
      jest.spyOn(Utils.string, "escapeMDX").mockImplementation((text) => text);

      const tags = printCustomTags(type, options);

      expect(tags).toBe(`<Badge class="badge warning" text="@testA"/>`);
    });
  });
});
