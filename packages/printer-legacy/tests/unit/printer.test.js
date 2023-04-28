const {
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
} = require("graphql");

jest.mock("@graphql-markdown/utils", () => {
  return {
    string: { toSlug: jest.fn() },
    url: { pathUrl: { join: jest.fn() } },
    object: { hasProperty: jest.fn() },
    graphql: {
      hasDirective: jest.fn(),
      getTypeName: jest.fn(),
      isOperation: jest.fn(),
      isEnumType: jest.fn(),
      isUnionType: jest.fn(),
      isInterfaceType: jest.fn(),
      isObjectType: jest.fn(),
      isInputType: jest.fn(),
      isScalarType: jest.fn(),
      isDirectiveType: jest.fn(),
    },
  };
});
const Utils = require("@graphql-markdown/utils");

jest.mock("../../src/graphql");
const GraphQLPrinter = require("../../src/graphql");

const { Printer, DEFAULT_OPTIONS } = require("../../src/printer");

describe("Printer", () => {
  const types = [
    {
      name: "Directive",
      type: new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      }),
      guard: "isDirectiveType",
    },
    {
      name: "Enum",
      type: new GraphQLEnumType({
        name: "TestEnum",
        values: {},
      }),
      guard: "isEnumType",
    },
    {
      name: "Input",
      type: new GraphQLInputObjectType({
        name: "TestInput",
        fields: {},
      }),
      guard: "isInputType",
    },
    {
      name: "Interface",
      type: new GraphQLInterfaceType({
        name: "TestInterface",
        fields: {},
      }),
      guard: "isInterfaceType",
    },
    {
      name: "Object",
      type: new GraphQLObjectType({
        name: "TestObject",
        fields: {},
      }),
      guard: "isObjectType",
    },
    {
      name: "Scalar",
      type: new GraphQLScalarType({
        name: "TestScalar",
      }),
      guard: "isScalarType",
    },
    {
      name: "Union",
      type: new GraphQLUnionType({
        name: "TestUnion",
        types: [],
      }),
      guard: "isUnionType",
    },
    {
      name: "Operation",
      type: {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      },
      guard: "isOperation",
    },
  ];

  beforeEach(() => {
    jest
      .spyOn(Utils.graphql, "getTypeName")
      .mockImplementation((value) => value);
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
          "basePath": undefined,
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

      Printer.options = {};

      Printer.init();

      expect(Printer.options).toMatchInlineSnapshot(`{}`);
    });

    test("override values on init when options is undefined", () => {
      expect.hasAssertions();

      Printer.options = undefined;

      Printer.init({}, "test", "/", {
        groups: {},
        printTypeOptions: {
          parentTypePrefix: false,
          relatedTypeSection: false,
          typeBadges: false,
        },
        skipDocDirective: ["test"],
      });

      expect(Printer.options).toMatchInlineSnapshot(`
        {
          "basePath": undefined,
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
      ({ type, name, guard }) => {
        expect.hasAssertions();

        jest.spyOn(Utils.graphql, guard).mockReturnValue(true);
        jest.spyOn(GraphQLPrinter, `printCode${name}`).mockReturnValue(name);

        [
          "printHeader",
          "printTypeMetadata",
          "printDescription",
          "printRelations",
        ].forEach((method) => jest.spyOn(Printer, method).mockReturnValue(""));

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
  });

  describe("printTypeMetadata()", () => {
    test.each(types)(
      "returns a Markdown graphql codeblock with type $name",
      ({ type, name, guard }) => {
        expect.hasAssertions();

        jest.spyOn(Utils.graphql, guard).mockReturnValue(true);
        const spy = jest
          .spyOn(GraphQLPrinter, `print${name}Metadata`)
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
    test.each(types)(
      "returns a Markdown formatted Docusaurus content for type $name",
      ({ name, type }) => {
        expect.hasAssertions();

        const spies = [
          "printHeader",
          "printCode",
          "printCustomDirectives",
          "printTypeMetadata",
          "printDescription",
          "printRelations",
        ].map((method) => jest.spyOn(Printer, method).mockReturnValue(""));

        Printer.printType(name, type, DEFAULT_OPTIONS);

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
      jest.spyOn(Utils.graphql, "hasDirective").mockReturnValue(true);
      const printedType = Printer.printType("any", null);

      expect(printedType).toBeUndefined();
    });
  });
});
