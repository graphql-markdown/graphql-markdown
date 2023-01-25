const {
  GraphQLInt,
  GraphQLEnumType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLID,
  GraphQLDirective,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  DirectiveLocation,
} = require("graphql");

const graphqlLib = require("@graphql-markdown/utils").graphql;

const { Printer, DEFAULT_OPTION } = require("../../src/index");

const { printCodeEnum } = require("../../src/enum");
const { printCodeUnion } = require("../../src/union");
const { printCodeScalar } = require("../../src/scalar");
const { printCodeArguments, printCodeField } = require("../../src/code");
const { printCodeDirective } = require("../../src/directive");
const { printCodeType } = require("../../src/object");

describe("lib", () => {
  describe("printer", () => {
    describe("class Printer", () => {
      let printerInstance;

      const baseURL = "graphql";
      const root = "docs";
      const schema = {
        toString: () => "SCHEMA",
        getType: (type) => type,
        getTypeMap: () => {},
        getDirectives: () => {},
        getImplementations: () => {},
        getRootType: () => undefined,
        getQueryType: () => undefined,
        getMutationType: () => undefined,
        getSubscriptionType: () => undefined,
      };

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
          name: "Query",
          type: {
            name: "TestQuery",
            type: GraphQLID,
            args: [],
          },
        },
      ];

      const typesWithInterface = [
        {
          name: "InterfaceType",
          spyOn: "printCodeType",
          type: new GraphQLInterfaceType({
            name: "TestInterfaceType",
            fields: {},
            interfaces: [{ name: "TestInterface" }],
          }),
        },
        {
          name: "Object",
          spyOn: "printCodeType",
          type: new GraphQLObjectType({
            name: "TestObject",
            fields: {},
            interfaces: [{ name: "TestInterface" }],
          }),
        },
      ];

      beforeEach(() => {
        printerInstance = new Printer(schema, baseURL, root);
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      describe("printCodeEnum()", () => {
        test("returns enum code structure", () => {
          expect.hasAssertions();

          const type = new GraphQLEnumType({
            name: "EnumTypeName",
            values: {
              one: { value: "one" },
              two: { value: "two" },
            },
          });

          const code = printCodeEnum(type);

          expect(code).toMatchSnapshot();
        });

        test("returns empty string if not enum type", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "ScalarTypeName",
            type: GraphQLInt,
          });

          const code = printCodeEnum(type);

          expect(code).toBe("");
        });
      });

      describe("printCodeUnion()", () => {
        test("returns union code structure", () => {
          expect.hasAssertions();

          const type = new GraphQLUnionType({
            name: "UnionTypeName",
            types: [{ name: "one" }, { name: "two" }],
          });

          const code = printCodeUnion(type);

          expect(code).toMatchSnapshot();
        });

        test("returns empty string if not union type", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "ScalarTypeName",
            type: GraphQLInt,
          });

          const code = printCodeUnion(type);

          expect(code).toBe("");
        });
      });

      describe("printCodeScalar()", () => {
        const type = new GraphQLScalarType({
          name: "ScalarTypeName",
          type: GraphQLInt,
        });

        test("returns scalar code structure", () => {
          expect.hasAssertions();

          const code = printCodeScalar(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe("printCodeArguments()", () => {
        test("returns a Markdown one line per formatted argument with default value surrounded by ()", () => {
          expect.hasAssertions();

          const type = new GraphQLDirective({
            name: "OperationName",
            locations: [],
            args: {
              ParamWithDefault: {
                type: "string",
                defaultValue: "defaultValue",
              },
              ParamNoDefault: { type: "any" },
              ParamIntZero: { type: "int", defaultValue: 0 },
              ParamIntNoDefault: { type: "int" },
            },
          });

          const code = printCodeArguments(type);

          expect(code).toMatchSnapshot();
        });

        test("returns an empty string if args list empty", () => {
          expect.hasAssertions();

          const type = {
            name: "OperationName",
            args: [],
          };

          const code = printCodeArguments(type);

          expect(code).toBe("");
        });

        test("returns an empty string if no args", () => {
          expect.hasAssertions();

          const type = {
            name: "OperationName",
          };

          const code = printCodeArguments(type);

          expect(code).toBe("");
        });
      });

      describe("printCodeField()", () => {
        test("returns a field with its type", () => {
          expect.hasAssertions();

          const type = { name: "FooBar", type: "string" };

          const code = printCodeField(type);

          expect(code).toMatchSnapshot();
        });

        test("returns a field with its type and arguments", () => {
          expect.hasAssertions();

          const type = {
            name: "TypeFooBar",
            type: GraphQLString,
            args: [
              {
                name: "ArgFooBar",
                type: GraphQLString,
              },
            ],
          };

          const code = printCodeField(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe("printCodeDirective()", () => {
        test("returns a directive", () => {
          expect.hasAssertions();

          const type = new GraphQLDirective({
            name: "FooBar",
            type: GraphQLString,
            locations: [],
          });

          const code = printCodeDirective(type);

          expect(code).toMatchSnapshot();
        });

        test("returns a directive with its arguments", () => {
          expect.hasAssertions();

          const type = new GraphQLDirective({
            name: "FooBar",
            type: GraphQLString,
            locations: [],
            args: {
              ArgFooBar: {
                type: GraphQLBoolean,
              },
            },
          });

          const code = printCodeDirective(type);

          expect(code).toMatchSnapshot();
        });

        test.each([
          {
            case: "multiple locations",
            locations: [DirectiveLocation.QUERY, DirectiveLocation.FIELD],
          },
          { case: "single location", locations: [DirectiveLocation.QUERY] },
        ])("returns a directive with $case", ({ locations }) => {
          expect.hasAssertions();

          const type = new GraphQLDirective({
            name: "FooBar",
            type: GraphQLString,
            locations: locations,
            args: {
              ArgFooBar: {
                type: GraphQLBoolean,
              },
            },
          });

          const code = printCodeDirective(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe("printCodeType()", () => {
        test("returns an interface with its fields", () => {
          expect.hasAssertions();

          const type = new GraphQLInterfaceType({
            name: "TestInterfaceName",
            fields: {
              one: { type: GraphQLString },
              two: { type: GraphQLBoolean },
            },
          });

          const code = printCodeType(type);

          expect(code).toMatchSnapshot();
        });

        test("returns an object with its fields and interfaces", () => {
          expect.hasAssertions();

          const type = new GraphQLObjectType({
            name: "TestName",
            fields: {
              one: { type: GraphQLString },
              two: { type: GraphQLBoolean },
            },
            interfaces: () => [
              new GraphQLInterfaceType({ name: "TestInterfaceName" }),
            ],
          });

          const code = printCodeType(type);

          expect(code).toMatchSnapshot();
        });

        test("returns an input with its fields", () => {
          expect.hasAssertions();

          const type = new GraphQLInputObjectType({
            name: "TestName",
            fields: {
              one: { type: GraphQLString },
              two: { type: GraphQLBoolean },
            },
          });

          const code = printCodeType(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe("printHeader()", () => {
        test("returns a Docusaurus document header", () => {
          expect.hasAssertions();

          const header = Printer.printHeader(
            "an-object-type-name",
            "An Object Type Name",
          );

          expect(header).toMatchSnapshot();
        });

        test("returns a Docusaurus document header with ToC disabled", () => {
          expect.hasAssertions();

          const header = printHeader(
            "an-object-type-name",
            "An Object Type Name",
            {
              toc: false,
            },
          );

          expect(header).toMatchSnapshot();
        });

        test("returns a Docusaurus document header with pagination disabled", () => {
          expect.hasAssertions();

          const header = Printer.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            {
              pagination: false,
            },
          );

          expect(header).toMatchSnapshot();
        });
      });

      describe("printCode()", () => {
        test.each(types)(
          "returns a Markdown graphql codeblock with type $name",
          ({ type }) => {
            expect.hasAssertions();

            const code = Printer.printCode(type);

            expect(code).toMatchSnapshot();
          },
        );

        test("returns a Markdown codeblock with non supported message for unsupported type", () => {
          expect.hasAssertions();

          const type = "TestFooBarType";

          const code = printCode(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe.skip("printType()", () => {
        test.each(types)(
          "returns a Markdown formatted Docusaurus content for type $name",
          ({ name, type }) => {
            expect.hasAssertions();

            jest
              .spyOn(printerInstance, "printHeader")
              .mockImplementation((header) => `header-${header.toLowerCase()}`);
            jest
              .spyOn(printerInstance, "printDescription")
              .mockImplementation(() => `Test ${name}`);
            jest
              .spyOn(printerInstance, "printRelations")
              .mockImplementation(() => "");

            const printedType = printType(name, type);

            expect(printedType).toMatchSnapshot();
          },
        );

        test.each(typesWithInterface)(
          "returns a Markdown formatted Docusaurus content for $name implementing interface",
          ({ name, type }) => {
            expect.hasAssertions();

            jest
              .spyOn(printerInstance, "printHeader")
              .mockImplementation((header) => `header-${header.toLowerCase()}`);
            jest
              .spyOn(printerInstance, "printDescription")
              .mockImplementation((t) => `Test ${t.name}`);
            jest
              .spyOn(printerInstance, "printRelations")
              .mockImplementation(() => "");

            const printedType = printType(name, type);

            expect(printedType).toMatchSnapshot();
          },
        );

        test("returns an empty string if no type", () => {
          expect.hasAssertions();

          const printedType = printType("any", null);

          expect(printedType).toBe("");
        });

        test("prints a specification section if scalar as directive @specifiedBy", () => {
          expect.hasAssertions();

          const scalarType = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
            specifiedByURL: "https://lorem.ipsum",
          });

          jest
            .spyOn(printerInstance, "printHeader")
            .mockImplementation((header) => `header-${header.toLowerCase()}`);
          jest
            .spyOn(printerInstance, "printRelations")
            .mockImplementation(() => "");

          const printedType = printType("scalar", scalarType);

          expect(printedType).toMatchSnapshot();
        });
      });

      describe.skip("printSpecification()", () => {
        test("prints specification link if directive specified by is present", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
            specifiedByURL: "https://lorem.ipsum",
          });

          const deprecation = printSpecification(type);

          expect(deprecation).toMatchInlineSnapshot(`
            "### <SpecifiedBy url="https://lorem.ipsum"/>

            "
          `);
        });

        test("does not print specification link if directive specified by is not present", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
          });

          const deprecation = printSpecification(type);

          expect(deprecation).toBe("");
        });
      });

      describe.skip("printRelationOf()", () => {
        beforeEach(() => {
          jest.mock("graphql");
        });

        afterEach(() => {
          jest.resetAllMocks();
        });

        test("prints type relations", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "String",
            description: "Lorem Ipsum",
          });

          jest
            .spyOn(graphqlLib, "getRelationOfReturn")
            .mockImplementation(() => ({
              queries: [{ name: "Foo" }],
              interfaces: [{ name: "Bar" }],
              subscriptions: [{ name: "Baz" }],
            }));

          const deprecation = printRelationOf(
            type,
            "RelationOf",
            graphqlLib.getRelationOfReturn,
          );

          expect(deprecation).toMatchInlineSnapshot(`
            "### RelationOf

            [\`Bar\`](#)  <Badge class="secondary" text="interface"/><Bullet />[\`Baz\`](#)  <Badge class="secondary" text="subscription"/><Bullet />[\`Foo\`](#)  <Badge class="secondary" text="query"/>

            "
          `);
        });
      });

      describe.skip("getRootTypeLocaleFromString()", () => {
        test("returns object of local strings from root type string", () => {
          expect.hasAssertions();

          const deprecation = getRootTypeLocaleFromString("queries");

          expect(deprecation).toMatchInlineSnapshot(`
            {
              "plural": "queries",
              "singular": "query",
            }
          `);
        });
      });
    });
  });
});
