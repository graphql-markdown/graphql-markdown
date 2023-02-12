const {
  GraphQLNonNull,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
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

const Printer = require("../../src/index");

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
          spyOn: "printCodeDirective",
          type: new GraphQLDirective({
            name: "TestDirective",
            locations: [],
          }),
        },
        {
          name: "Enum",
          spyOn: "printCodeEnum",
          type: new GraphQLEnumType({
            name: "TestEnum",
            values: {},
          }),
        },
        {
          name: "Input",
          spyOn: "printCodeType",
          type: new GraphQLInputObjectType({
            name: "TestInput",
            fields: {},
          }),
        },
        {
          name: "Interface",
          spyOn: "printCodeType",
          type: new GraphQLInterfaceType({
            name: "TestInterface",
            fields: {},
          }),
        },
        {
          name: "Object",
          spyOn: "printCodeType",
          type: new GraphQLObjectType({
            name: "TestObject",
            fields: {},
          }),
        },
        {
          name: "Scalar",
          spyOn: "printCodeScalar",
          type: new GraphQLScalarType({
            name: "TestScalar",
          }),
        },
        {
          name: "Union",
          spyOn: "printCodeUnion",
          type: new GraphQLUnionType({
            name: "TestUnion",
            types: [],
          }),
        },
        {
          name: "Query",
          spyOn: "printCodeField",
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

      describe("toLink()", () => {
        test("returns markdown link for GraphQL directive", () => {
          expect.hasAssertions();

          const entityName = "TestDirective";
          const type = new GraphQLDirective({
            name: entityName,
            locations: [],
          });

          const link = printerInstance.toLink(type, entityName);

          expect(JSON.stringify(link)).toMatchSnapshot();
        });

        test("returns markdown link surrounded by [] for GraphQL list/array", () => {
          expect.hasAssertions();

          const entityName = "TestObjectList";
          const type = new GraphQLList(
            new GraphQLObjectType({
              name: entityName,
            }),
          );

          const link = printerInstance.toLink(type, entityName);

          expect(JSON.stringify(link)).toMatchSnapshot();
        });

        test("returns plain text for unknown entities", () => {
          expect.hasAssertions();

          const type = "any";
          const entityName = "fooBar";

          const link = printerInstance.toLink(type, entityName);

          expect(JSON.stringify(link)).toMatchSnapshot();
        });
      });

      describe("printSection()", () => {
        test("returns Markdown ### section by default", () => {
          expect.hasAssertions();

          const title = "section title";
          const content = "section content";

          const printSectionItems = jest
            .spyOn(printerInstance, "printSectionItems")
            .mockImplementation((sectionItems) => sectionItems);

          const section = printerInstance.printSection(content, title);

          expect(printSectionItems).toHaveBeenCalledWith(content, {
            parentType: undefined,
          });

          expect(section).toMatchSnapshot();
        });

        test("returns Markdown custom section level", () => {
          expect.hasAssertions();

          const title = "section title";
          const content = "section content";

          jest
            .spyOn(printerInstance, "printSectionItems")
            .mockImplementation((sectionItems) => sectionItems);

          const section = printerInstance.printSection(content, title, {
            level: "#",
          });

          expect(section).toMatchSnapshot();
        });

        test("returns empty string if content is empty", () => {
          expect.hasAssertions();

          const title = "section title";
          const content = "";

          const section = printerInstance.printSection(content, title);

          expect(section).toBe("");
        });
      });

      describe("printSectionItems()", () => {
        test("returns Markdown one line per item", () => {
          expect.hasAssertions();

          const printSectionItem = jest
            .spyOn(printerInstance, "printSectionItem")
            .mockImplementation((sectionItems) => sectionItems);

          const itemList = ["one", "two", "three"];

          const section = printerInstance.printSectionItems(itemList);

          expect(printSectionItem).toHaveBeenCalledTimes(3);
          expect(printSectionItem).toHaveBeenLastCalledWith(itemList.pop(), {
            level: "####",
          });
          expect(section).toMatchSnapshot();
        });

        test("returns empty text if not a list", () => {
          expect.hasAssertions();

          const itemList = "list";

          const section = printerInstance.printSectionItems(itemList);

          expect(section).toMatch("");
        });
      });

      describe("printSectionItem()", () => {
        test("returns Markdown #### link section with description", () => {
          expect.hasAssertions();

          const type = new GraphQLObjectType({
            name: "EntityTypeName",
            description: "Lorem ipsum",
          });

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with sub type is non-nullable", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeName",
            type: new GraphQLNonNull(
              new GraphQLObjectType({
                name: "NonNullableObjectType",
              }),
            ),
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with sub type list and non-nullable", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeName",
            type: new GraphQLNonNull(
              new GraphQLList(
                new GraphQLObjectType({
                  name: "NonNullableObjectType",
                }),
              ),
            ),
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with field parameters", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeName",
            args: [
              {
                name: "ParameterTypeName",
                type: GraphQLString,
              },
            ],
          };

          const printSectionItems = jest.spyOn(
            printerInstance,
            "printSectionItems",
          );

          const section = printerInstance.printSectionItem(type);

          expect(printSectionItems).toHaveBeenCalledWith(type.args, {
            level: "#####",
            parentType: undefined,
          });
          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with non empty nullable list [!]", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeNameList",
            type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with non empty no nullable list [!]!", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeNameList",
            type: new GraphQLNonNull(
              new GraphQLList(new GraphQLNonNull(GraphQLInt)),
            ),
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchSnapshot();
        });

        test("returns no section if item matches skipDocDirective", () => {
          expect.hasAssertions();

          printerInstance.skipDocDirective = "@noDoc";

          const type = {
            name: "EntityTypeNameList",
            astNode: {
              directives: [{ name: { value: "@noDoc" } }],
            },
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toBe("");
        });

        test("returns Markdown #### link section without field parameters matching skipDocDirective", () => {
          expect.hasAssertions();

          printerInstance.skipDocDirective = "@noDoc";

          const type = {
            name: "EntityTypeName",
            args: [
              {
                name: "ParameterTypeName",
                type: GraphQLString,
              },
              {
                name: "ParameterSkipDoc",
                type: GraphQLString,
                astNode: {
                  directives: [{ name: { value: "@noDoc" } }],
                },
              },
            ],
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchInlineSnapshot(`
            "#### [\`EntityTypeName\`](#) 
            > 
            > ##### [\`ParameterTypeName\`](#)<Bullet />[\`String\`](docs/graphql/scalars/string) <Badge class="secondary" text="scalar"/>
            > 
            > 

            "
          `);
        });
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

          const code = printerInstance.printCodeEnum(type);

          expect(code).toMatchSnapshot();
        });

        test("returns empty string if not enum type", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "ScalarTypeName",
            type: GraphQLInt,
          });

          const code = printerInstance.printCodeEnum(type);

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

          const code = printerInstance.printCodeUnion(type);

          expect(code).toMatchSnapshot();
        });

        test("returns empty string if not union type", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "ScalarTypeName",
            type: GraphQLInt,
          });

          const code = printerInstance.printCodeUnion(type);

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

          const code = printerInstance.printCodeScalar(type);

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

          const code = printerInstance.printCodeArguments(type);

          expect(code).toMatchSnapshot();
        });

        test("returns an empty string if args list empty", () => {
          expect.hasAssertions();

          const type = {
            name: "OperationName",
            args: [],
          };

          const code = printerInstance.printCodeArguments(type);

          expect(code).toBe("");
        });

        test("returns an empty string if no args", () => {
          expect.hasAssertions();

          const type = {
            name: "OperationName",
          };

          const code = printerInstance.printCodeArguments(type);

          expect(code).toBe("");
        });
      });

      describe("printCodeField()", () => {
        test("returns a field with its type", () => {
          expect.hasAssertions();

          const type = { name: "FooBar", type: "string" };

          const code = printerInstance.printCodeField(type);

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

          const code = printerInstance.printCodeField(type);

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

          const code = printerInstance.printCodeDirective(type);

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

          const code = printerInstance.printCodeDirective(type);

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

          const code = printerInstance.printCodeDirective(type);

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

          const code = printerInstance.printCodeType(type);

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

          const code = printerInstance.printCodeType(type);

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

          const code = printerInstance.printCodeType(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe("printHeader()", () => {
        test("returns a Docusaurus document header", () => {
          expect.hasAssertions();

          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
          );

          expect(header).toMatchSnapshot();
        });

        test("returns a Docusaurus document header with ToC disabled", () => {
          expect.hasAssertions();

          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            { toc: false },
          );

          expect(header).toMatchSnapshot();
        });

        test("returns a Docusaurus document header with pagination disabled", () => {
          expect.hasAssertions();

          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            { pagination: false },
          );

          expect(header).toMatchSnapshot();
        });
      });

      describe("printDescription()", () => {
        test("returns the type description text", () => {
          expect.hasAssertions();

          const type = { description: "Lorem ipsum" };
          const description = printerInstance.printDescription(type);

          expect(description).toMatchSnapshot();
        });

        test("returns the default text if no description", () => {
          expect.hasAssertions();

          const type = {};
          const description = printerInstance.printDescription(type);

          expect(description).toMatchSnapshot();
        });

        test("return DEPRECATED tag if deprecated", () => {
          const type = {
            description: "Lorem ipsum",
            isDeprecated: true,
            deprecationReason: "Foobar",
          };
          const description = printerInstance.printDescription(type);

          expect(description).toMatchSnapshot();
        });
      });

      describe("printCode()", () => {
        test.each(types)(
          "returns a Markdown graphql codeblock with type $name",
          ({ type, spyOn }) => {
            expect.hasAssertions();

            const printCode = jest.spyOn(printerInstance, spyOn);

            const code = printerInstance.printCode(type);

            expect(printCode).toHaveBeenCalledWith(type);

            expect(code).toMatchSnapshot();
          },
        );

        test("returns a Markdown codeblock with non supported message for unsupported type", () => {
          expect.hasAssertions();

          const type = "TestFooBarType";

          const code = printerInstance.printCode(type);

          expect(code).toMatchSnapshot();
        });
      });

      describe("printType()", () => {
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

            const printedType = printerInstance.printType(name, type);

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

            const printedType = printerInstance.printType(name, type);

            expect(printedType).toMatchSnapshot();
          },
        );

        test("returns an empty string if no type", () => {
          expect.hasAssertions();

          const printedType = printerInstance.printType("any", null);

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

          const printedType = printerInstance.printType("scalar", scalarType);

          expect(printedType).toMatchSnapshot();
        });
      });

      describe("printDeprecation()", () => {
        test("prints deprecated badge if type is deprecated", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeName",
            isDeprecated: true,
          };
          const deprecation = printerInstance.printDeprecation(type);

          expect(deprecation).toMatchInlineSnapshot(`
            "<Badge class="warning" text="DEPRECATED"/>

            "
          `);
        });

        test("prints deprecation reason if type is deprecated with reason", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeName",
            isDeprecated: true,
            deprecationReason: "foobar",
          };
          const deprecation = printerInstance.printDeprecation(type);

          expect(deprecation).toMatchInlineSnapshot(`
            "<Badge class="warning" text="DEPRECATED: foobar"/>

            "
          `);
        });

        test("does not print deprecated badge if type is not deprecated", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
            specifiedByURL: "https://lorem.ipsum",
          });

          const deprecation = printerInstance.printDeprecation(type);

          expect(deprecation).toBe("");
        });
      });

      describe("printSpecification()", () => {
        test("prints specification link if directive specified by is present", () => {
          expect.hasAssertions();

          const type = new GraphQLScalarType({
            name: "LoremScalar",
            description: "Lorem Ipsum",
            specifiedByURL: "https://lorem.ipsum",
          });

          const deprecation = printerInstance.printSpecification(type);

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

          const deprecation = printerInstance.printSpecification(type);

          expect(deprecation).toBe("");
        });
      });

      describe("printRelationOf()", () => {
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

          const deprecation = printerInstance.printRelationOf(
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

      describe("getRootTypeLocaleFromString()", () => {
        test("returns object of local strings from root type string", () => {
          expect.hasAssertions();

          const deprecation =
            printerInstance.getRootTypeLocaleFromString("queries");

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
