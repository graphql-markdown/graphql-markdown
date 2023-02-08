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

const { Printer, DEFAULT_OPTIONS } = require("../../src/printer");

const GraphQLPrinter = require("../../src/graphql");

describe("Printer", () => {
  const types = [
    {
      name: "Directive",
      type: new GraphQLDirective({
        name: "TestDirective",
        locations: [],
      }),
    },
    {
      name: "Enum",
      type: new GraphQLEnumType({
        name: "TestEnum",
        values: {},
      }),
    },
    {
      name: "Input",
      type: new GraphQLInputObjectType({
        name: "TestInput",
        fields: {},
      }),
    },
    {
      name: "Interface",
      type: new GraphQLInterfaceType({
        name: "TestInterface",
        fields: {},
      }),
    },
    {
      name: "Object",
      type: new GraphQLObjectType({
        name: "TestObject",
        fields: {},
      }),
    },
    {
      name: "Scalar",
      type: new GraphQLScalarType({
        name: "TestScalar",
      }),
    },
    {
      name: "Union",
      type: new GraphQLUnionType({
        name: "TestUnion",
        types: [],
      }),
    },
    {
      name: "Operation",
      type: {
        name: "TestQuery",
        type: GraphQLID,
        args: [],
      },
    },
  ];

  afterEach(() => {
    jest.resetAllMocks();
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
      ({ type, name }) => {
        expect.hasAssertions();

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

  describe("printType()", () => {
    test.each(types)(
      "returns a Markdown formatted Docusaurus content for type $name",
      ({ name, type }) => {
        expect.hasAssertions();

        const spies = [
          "printHeader",
          "printCode",
          "printTypeMetadata",
          "printDescription",
          "printRelations",
        ].map((method) => jest.spyOn(Printer, method).mockReturnValue(""));

        Printer.printType(name, type, DEFAULT_OPTIONS);

        spies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
      },
    );

    test("returns an empty string if no type", () => {
      expect.hasAssertions();

      const printedType = Printer.printType("any", null);

      expect(printedType).toBe("");
    });
  });
});
