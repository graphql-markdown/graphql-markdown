import {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLSchema
} from "graphql";

jest.mock("@graphql-markdown/utils", () => {
  return {
    toSlug: jest.fn(),
    escapeMDX: jest.fn(),
    pathUrl: { join: jest.fn() },
    hasProperty: jest.fn(),
    isEmpty: jest.fn(),
    getConstDirectiveMap: jest.fn(),
    getTypeName: jest.fn(),
    hasDirective: jest.fn(),
    isDirectiveType: jest.fn(),
    isEnumType: jest.fn(),
    isInputType: jest.fn(),
    isInterfaceType: jest.fn(),
    isObjectType: jest.fn(),
    isOperation: jest.fn(),
    isScalarType: jest.fn(),
    isUnionType: jest.fn(),
  };
});
import * as Utils from "@graphql-markdown/utils";

jest.mock("../../src/graphql");
import * as GraphQLPrinter from "../../src/graphql";

import { Printer } from "../../src/printer";
import {DEFAULT_OPTIONS, Options} from "../../src/const/options";

describe("Printer", () => {
  enum TypeGuard {
    DIRECTIVE = "isDirectiveType",
    ENUM = "isEnumType",
    INPUT = "isInputType",
    INTERFACE = "isInterfaceType",
    OBJECT = "isObjectType",
    SCALAR = "isScalarType",
    UNION = "isUnionType",
    OPERATION = "isOperation"
  }

  const types = [
    {
      name: "Directive",
      type: new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      }),
      guard: TypeGuard.DIRECTIVE,
      printCode: "printCodeDirective",
      printMeta: "printDirectiveMetadata"
    },
    {
      name: "Enum",
      type: new GraphQLEnumType({
        name: "TestEnum",
        values: {},
      }),
      guard: TypeGuard.ENUM,
      printCode: "printCodeEnum",
      printMeta: "printEnumMetadata"
    },
    {
      name: "Input",
      type: new GraphQLInputObjectType({
        name: "TestInput",
        fields: {},
      }),
      guard: TypeGuard.INPUT,
      printCode: "printCodeInput",
      printMeta: "printInputMetadata"
    },
    {
      name: "Interface",
      type: new GraphQLInterfaceType({
        name: "TestInterface",
        fields: {},
      }),
      guard: TypeGuard.INTERFACE,
      printCode: "printCodeInterface",
      printMeta: "printInterfaceMetadata"
    },
    {
      name: "Object",
      type: new GraphQLObjectType({
        name: "TestObject",
        fields: {},
      }),
      guard: TypeGuard.OBJECT,
      printCode: "printCodeObject",
      printMeta: "printObjectMetadata"
    },
    {
      name: "Scalar",
      type: new GraphQLScalarType({
        name: "TestScalar",
      }),
      guard: TypeGuard.SCALAR,
      printCode: "printCodeScalar",
      printMeta: "printScalarMetadata"
    },
    {
      name: "Union",
      type: new GraphQLUnionType({
        name: "TestUnion",
        types: [],
      }),
      guard: TypeGuard.UNION,
      printCode: "printCodeUnion",
      printMeta: "printUnionMetadata"
    },
    {
      name: "Operation",
      type: {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      },
      guard: TypeGuard.OPERATION,
      printCode: "printCodeOperation",
      printMeta: "printOperationMetadata"
    },
  ] as const;

  beforeEach(() => {
    jest
      .spyOn(Utils, "getTypeName")
      .mockImplementation((value) => value as string);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("init()", () => {
    test("sets Printer instance with default options", () => {
      expect.hasAssertions();

      expect(Printer.options).toMatchInlineSnapshot(`undefined`);

      Printer.init();

      expect(Printer.options).toMatchInlineSnapshot(`
        {
          "basePath": "/schema",
          "codeSection": true,
          "customDirectives": undefined,
          "groups": undefined,
          "parentTypePrefix": true,
          "printDeprecated": "default",
          "relatedTypeSection": true,
          "schema": undefined,
          "skipDocDirective": undefined,
          "typeBadges": true,
        }
      `);
    });

    test("does nothing is options is defined", () => {
      expect.hasAssertions();

      Printer.options = {} as Options;

      Printer.init();

      expect(Printer.options).toMatchInlineSnapshot(`{}`);
    });

    test("override values on init when options is undefined", () => {
      expect.hasAssertions();

      Printer.options = undefined;

      Printer.init(new GraphQLSchema({}), "test", "/", {
        groups: {},
        printTypeOptions: {
          codeSection: false,
          parentTypePrefix: false,
          relatedTypeSection: false,
          typeBadges: false,
        },
        skipDocDirective: ["test" as Utils.DirectiveName],
      });

      expect(Printer.options).toMatchInlineSnapshot(`
        {
          "basePath": "/test",
          "codeSection": false,
          "customDirectives": undefined,
          "groups": {},
          "parentTypePrefix": false,
          "printDeprecated": "default",
          "relatedTypeSection": false,
          "schema": {},
          "skipDocDirective": [
            "test",
          ],
          "typeBadges": false,
        }
      `);
    });
  });

  describe("printHeader()", () => {
    test("returns a Docusaurus document header", () => {
      expect.hasAssertions();

      const header = Printer.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        DEFAULT_OPTIONS,
      );

      expect(header).toMatchInlineSnapshot(`
            "---
            id: an-object-type-name
            title: An Object Type Name
            hide_table_of_contents: false
            ---"
          `);
    });

    test("returns a Docusaurus document header with ToC disabled", () => {
      expect.hasAssertions();

      const header = Printer.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        {
          ...DEFAULT_OPTIONS,
          header: { toc: false },
        },
      );

      expect(header).toMatchInlineSnapshot(`
            "---
            id: an-object-type-name
            title: An Object Type Name
            hide_table_of_contents: true
            ---"
          `);
    });

    test("returns a Docusaurus document header with pagination disabled", () => {
      expect.hasAssertions();

      const header = Printer.printHeader(
        "an-object-type-name",
        "An Object Type Name",
        {
          ...DEFAULT_OPTIONS,
          header: { pagination: false },
        },
      );

      expect(header).toMatchInlineSnapshot(`
            "---
            id: an-object-type-name
            title: An Object Type Name
            hide_table_of_contents: false
            pagination_next: null
            pagination_prev: null
            ---"
          `);
    });
  });

  describe("printCode()", () => {
    test.each(types)(
      "returns a Markdown graphql codeblock with type $name",
      ({ type, printCode, name, guard }) => {
        expect.hasAssertions();

        

        jest.spyOn(Utils, guard).mockReturnValue(true);
        jest.spyOn(GraphQLPrinter, printCode).mockReturnValue(name);

        const code = Printer.printCode(type, DEFAULT_OPTIONS);

        expect(code).toMatchSnapshot();
      },
    );

    test("returns a Markdown codeblock with non supported message for unsupported type", () => {
      expect.hasAssertions();

      const type = "TestFooBarType";

      const code = Printer.printCode(type, DEFAULT_OPTIONS);

      expect(code).toMatchSnapshot();
    });

    test("returns an empty string if printTypeOptions.code is false", () => {
      expect.hasAssertions();

      const type = "TestFooBarType";

      const code = Printer.printCode(type, {
        ...DEFAULT_OPTIONS,
        codeSection: false,
      });

      expect(code).toBe("");
    });
  });

  describe("printTypeMetadata()", () => {
    test.each(types)(
      "returns a Markdown graphql codeblock with type $name",
      ({ type, printMeta, name, guard }) => {
        expect.hasAssertions();

        jest.spyOn(Utils, guard).mockReturnValue(true);
        const spy = jest
          .spyOn(GraphQLPrinter, printMeta)
          .mockReturnValue(name);

        Printer.printTypeMetadata(type, DEFAULT_OPTIONS);

        expect(spy).toHaveBeenCalledWith(type, DEFAULT_OPTIONS);
      },
    );

    test("returns undefined with non supported message for unsupported type", () => {
      expect.hasAssertions();

      const type = "TestFooBarType";

      const code = Printer.printTypeMetadata(type, DEFAULT_OPTIONS);

      expect(code).toBeUndefined();
    });
  });

  describe("printType()", () => {
    const spies = [
      "printCode",
      "printCustomDirectives",
      "printCustomTags",
      "printDescription",
      "printHeader",
      "printRelations",
      "printTypeMetadata",
    ] as const;

    test.each(types)(
      "returns a Markdown formatted Docusaurus content for type $name",
      ({ name, type }) => {
        expect.hasAssertions();

        spies.map((method) => jest.spyOn(Printer, method).mockReturnValue(""));

        Printer.printType(name, type);

        spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
      },
    );

    test("returns undefined if no type", () => {
      expect.hasAssertions();

      const printedType = Printer.printType("any", null);

      expect(printedType).toBeUndefined();
    });

    test("returns undefined if no name", () => {
      expect.hasAssertions();

      const printedType = Printer.printType(undefined, "any");

      expect(printedType).toBeUndefined();
    });

    test("returns undefined if matches skipDocDirective", () => {
      expect.hasAssertions();
      jest.spyOn(Utils, "hasDirective").mockReturnValue(true);
      const printedType = Printer.printType("any", null);

      expect(printedType).toBeUndefined();
    });
  });
});
