const path = require("path");

const { capitalize } = require("../../../src/utils/scalars/string");

const Printer = require("../../../src/lib/printer");

const graphql = require("../../../src/lib/graphql");

const { getNamedType, isNullableType, isListType } = graphql;

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
} = require("graphql");

const graphQLEntityType = [
  "enum",
  "union",
  "interface",
  "object",
  "input",
  "scalar",
  "directive",
];

const EXPECT_PATH = path.join(
  __dirname,
  "__expect__",
  __OS__,
  path.basename(__filename),
);

describe("lib", () => {
  describe("printer", () => {
    describe("class Printer", () => {
      let printerInstance,
        baseURL = "graphql",
        root = "docs",
        schema = { toString: () => "SCHEMA", getType: (type) => type };

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

          expect(JSON.stringify(link)).toMatchFile(
            path.join(EXPECT_PATH, `toLinkWithTestDirective.json`),
          );
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

          expect(JSON.stringify(link)).toMatchFile(
            path.join(EXPECT_PATH, "toLinkWithList.json"),
          );
        });

        test("returns plain text for unknown entities", () => {
          expect.hasAssertions();

          const type = "any";
          const entityName = "fooBar";

          const link = printerInstance.toLink(type, entityName);

          expect(JSON.stringify(link)).toMatchFile(
            path.join(EXPECT_PATH, "toLinkWithUnknown.json"),
          );
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

          expect(printSectionItems).toHaveBeenCalledWith(content);

          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSection.md"),
          );
        });

        test("returns Markdown custom section level", () => {
          expect.hasAssertions();

          const title = "section title";
          const content = "section content";

          jest
            .spyOn(printerInstance, "printSectionItems")
            .mockImplementation((sectionItems) => sectionItems);

          const section = printerInstance.printSection(content, title, "#");

          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionCustomLevel.md"),
          );
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
          expect(printSectionItem).toHaveBeenLastCalledWith(
            itemList.pop(),
            "####",
          );
          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionItems.md"),
          );
        });

        test("returns empty text if not a list", () => {
          expect.hasAssertions();

          const itemList = "list";

          const section = printerInstance.printSectionItems(itemList);

          expect(section).toMatch("");
        });
      });

      describe("printSectionItem()", () => {
        beforeEach(() => {
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((paramType) =>
              paramType ? paramType.name : null,
            );
          jest
            .spyOn(graphql, "getNamedType")
            .mockImplementation((paramType) =>
              paramType ? paramType.name : null,
            );
        });

        afterEach(() => {
          jest.resetAllMocks();
        });

        test("returns Markdown #### link section with description", () => {
          expect.hasAssertions();

          const type = new GraphQLObjectType({
            name: "EntityTypeName",
            description: "Lorem ipsum",
          });

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionItem.md"),
          );
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

          expect(section).toMatchFile(
            path.join(EXPECT_PATH, `printSectionItemWithSubTypeNonNullable.md`),
          );
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

          expect(section).toMatchFile(
            path.join(
              EXPECT_PATH,
              `printSectionItemWithSubTypeListNonNullable.md`,
            ),
          );
        });

        test("returns Markdown #### link section with field parameters", () => {
          expect.hasAssertions();

          const type = new GraphQLInputObjectType({
            name: "EntityTypeName",
            fields: {
              ParameterTypeName: { type: GraphQLString },
            },
          });

          // const printSectionItems = jest.spyOn(
          //   printerInstance,
          //   "printSectionItems",
          // );

          const section = printerInstance.printSectionItem(type);

          // expect(printSectionItems).toHaveBeenCalledWith(type.args, "- #####");
          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionWithFieldParameters.md"),
          );
        });

        test("returns Markdown #### link section with non empty nullable list [!]", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeNameList",
            type: new GraphQLList(new GraphQLNonNull(GraphQLInt)),
          };

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionItemListNonEmpty.md"),
          );
        });

        test("returns Markdown #### link section with non empty no nullable list [!]!", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeNameList",
            type: new GraphQLNonNull(
              new GraphQLList(
                new GraphQLNonNull(
                  new GraphQLList(new GraphQLNonNull(GraphQLInt)),
                ),
              ),
            ),
          };

          jest
            .spyOn(graphql, "getNamedType")
            .mockImplementation((paramType) => getNamedType(paramType));
          jest
            .spyOn(graphql, "isNullableType")
            .mockImplementation((paramType) => isNullableType(paramType));
          jest
            .spyOn(graphql, "isScalarType")
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "isListType")
            .mockImplementation((paramType) => isListType(paramType));

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchFile(
            path.join(
              EXPECT_PATH,
              "printSectionItemNonNullableListNonEmpty.md",
            ),
          );
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

          jest.spyOn(graphql, "isEnumType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((paramType) => paramType.name);

          const code = printerInstance.printCodeEnum(type);

          expect(code).toMatchFile(path.join(EXPECT_PATH, "printCodeEnum.md"));
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

          expect(code).toMatchFile(path.join(EXPECT_PATH, "printCodeUnion.md"));
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

          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((paramType) => paramType.name);

          const code = printerInstance.printCodeScalar(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeScalar.md"),
          );
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

          jest
            .spyOn(graphql, "getDefaultValue")
            .mockImplementation((paramType) => paramType.default);

          const code = printerInstance.printCodeArguments(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeArguments.md"),
          );
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

          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(type.name)
            .mockReturnValueOnce(type.type);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("");

          const code = printerInstance.printCodeField(type);

          expect(code).toMatchFile(path.join(EXPECT_PATH, "printCodeField.md"));
        });

        test("returns a field with its type and arguments", () => {
          expect.hasAssertions();

          const type = { name: "FooBar", type: "string" };

          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(type.name)
            .mockReturnValueOnce(type.type);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("(\narg: boolean\n)");

          const code = printerInstance.printCodeField(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeFieldWithArguments.md"),
          );
        });
      });

      describe("printCodeDirective()", () => {
        test("returns a directive", () => {
          expect.hasAssertions();

          const type = { name: "FooBar", type: "string" };

          jest.spyOn(graphql, "getTypeName").mockReturnValueOnce(type.name);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("");

          const code = printerInstance.printCodeDirective(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeDirective.md"),
          );
        });

        test("returns a directive with its arguments", () => {
          expect.hasAssertions();

          const type = { name: "FooBar", type: "string" };

          jest.spyOn(graphql, "getTypeName").mockReturnValueOnce(type.name);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("(\narg: boolean\n)");

          const code = printerInstance.printCodeDirective(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeDirectiveWithArguments.md"),
          );
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

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeTypeWithInterface.md"),
          );
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

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeTypeWithObject.md"),
          );
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
          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeTypeWithInput.md"),
          );
        });
      });

      describe("printHeader()", () => {
        test("returns a Docusaurus document header", () => {
          expect.hasAssertions();

          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
          );

          expect(header).toMatchFile(path.join(EXPECT_PATH, "printHeader.md"));
        });

        test("returns a Docusaurus document header with ToC disabled", () => {
          expect.hasAssertions();

          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            { toc: false },
          );

          expect(header).toMatchFile(
            path.join(EXPECT_PATH, "printHeaderNoToC.md"),
          );
        });

        test("returns a Docusaurus document header with pagination disabled", () => {
          expect.hasAssertions();

          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
            { pagination: false },
          );

          expect(header).toMatchFile(
            path.join(EXPECT_PATH, "printHeaderNoPagination.md"),
          );
        });
      });

      describe("printDescription()", () => {
        test("returns the type description text", () => {
          expect.hasAssertions();

          const type = { description: "Lorem ipsum" };
          const description = printerInstance.printDescription(type);

          expect(description).toMatchFile(
            path.join(EXPECT_PATH, "printDescription.md"),
          );
        });

        test("returns the default text if no description", () => {
          expect.hasAssertions();

          const type = {};
          const description = printerInstance.printDescription(type);

          expect(description).toMatchFile(
            path.join(EXPECT_PATH, "printDescriptionWithDefault.md"),
          );
        });

        test("return DEPRECATED tag if deprecated", () => {
          const type = {
            description: "Lorem ipsum",
            isDeprecated: true,
            deprecationReason: "Foobar",
          };
          const description = printerInstance.printDescription(type);

          expect(description).toMatchFile(
            path.join(EXPECT_PATH, "printDescriptionWithDeprecated.md"),
          );
        });
      });

      describe("printCode()", () => {
        test.each(graphQLEntityType)(
          "returns a Markdown graphql codeblock with type %s",
          (type) => {
            expect.hasAssertions();

            const entityType = `Test${capitalize(type)}`;

            let printCode;
            if (["interface", "object", "input"].includes(type)) {
              printCode = jest.spyOn(printerInstance, "printCodeType");
            } else {
              printCode = jest.spyOn(
                printerInstance,
                `printCode${capitalize(type)}`,
              );
            }

            const code = printerInstance.printCode(entityType);

            // expect(printCode).toHaveBeenCalledWith(entityType);

            expect(code).toMatchFile(
              path.join(EXPECT_PATH, `printCodeWith${capitalize(type)}.md`),
            );
          },
        );

        test("returns a Markdown graphql codeblock with type query", () => {
          expect.hasAssertions();

          const entityName = "TestQuery";

          jest.spyOn(graphql, "isOperation").mockReturnValueOnce(true);
          const printCode = jest
            .spyOn(printerInstance, "printCodeField")
            .mockReturnValueOnce(entityName);

          const code = printerInstance.printCode(entityName);

          expect(printCode).toHaveBeenCalledWith(entityName);
          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeWithQuery.md"),
          );
        });

        test("returns a Markdown codeblock with non supported message for unsupported type", () => {
          expect.hasAssertions();

          const entityName = "TestFooBarType";

          jest.spyOn(graphql, "getTypeName").mockReturnValueOnce(entityName);

          const code = printerInstance.printCode(entityName);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeWithUnsupported.md"),
          );
        });
      });

      describe("printType()", () => {
        test.each(graphQLEntityType)(
          "returns a Markdown formatted Docusaurus content for type %s",
          (type) => {
            expect.hasAssertions();

            const entityType = {
              name: type,
              getValues: () => ({}),
              getTypes: () => ({}),
            };

            jest
              .spyOn(graphql, `is${capitalize(type)}Type`)
              .mockReturnValueOnce(true);
            jest
              .spyOn(printerInstance, "printHeader")
              .mockImplementation((header) => `header-${header}`);
            jest
              .spyOn(printerInstance, "printDescription")
              .mockImplementation(
                (paramType) => `Test ${capitalize(paramType.name)}`,
              );
            jest
              .spyOn(printerInstance, "printCode")
              .mockImplementation(
                (paramType) => `\`\`\`${paramType.name}\`\`\``,
              );
            jest
              .spyOn(printerInstance, "printSection")
              .mockImplementation((_, section) => section);
            const printedType = printerInstance.printType(
              entityType.name,
              entityType,
            );

            expect(printedType).toMatchFile(
              path.join(EXPECT_PATH, `printTypeWith${capitalize(type)}.md`),
            );
          },
        );

        test.each(["object", "input"])(
          "returns a Markdown formatted Docusaurus content for %s implementing interface",
          (type) => {
            expect.hasAssertions();
            const entityType = {
              name: type,
              getValues: () => ({}),
              getTypes: () => ({}),
              getInterfaces: () => ({}),
            };

            jest
              .spyOn(graphql, `is${capitalize(type)}Type`)
              .mockReturnValueOnce(true);
            jest
              .spyOn(printerInstance, "printHeader")
              .mockImplementation((n) => `header-${n}\n\n`);
            jest
              .spyOn(printerInstance, "printDescription")
              .mockImplementation((t) => `Test ${capitalize(t.name)}\n\n`);
            jest
              .spyOn(printerInstance, "printCode")
              .mockImplementation((t) => `\`\`\`${t.name}\`\`\`\n\n`);
            jest
              .spyOn(printerInstance, "printSection")
              .mockImplementation((_, s) => `${s}\n\n`);

            const printedType = printerInstance.printType(
              entityType.name,
              entityType,
            );

            expect(printedType).toMatchFile(
              path.join(
                EXPECT_PATH,
                `printTypeWith${capitalize(type)}Interface.md`,
              ),
            );
          },
        );

        test("returns a Markdown formatted Docusaurus content for query", () => {
          expect.hasAssertions();

          const entityType = {
            name: "query",
          };

          jest.spyOn(graphql, "isOperation").mockReturnValue(true);
          jest.spyOn(graphql, "getTypeName").mockReturnValue(entityType.name);
          jest
            .spyOn(printerInstance, "printHeader")
            .mockImplementation((n) => `header-${n}\n\n`);
          jest
            .spyOn(printerInstance, "printDescription")
            .mockImplementation((t) => `Test ${capitalize(t.name)}\n\n`);
          jest
            .spyOn(printerInstance, "printCode")
            .mockImplementation((t) => `\`\`\`${t.name}\`\`\`\n\n`);
          jest
            .spyOn(printerInstance, "printSection")
            .mockImplementation((_, s) => `${s}\n\n`);

          const printedType = printerInstance.printType(
            entityType.name,
            entityType,
          );

          expect(printedType).toMatchFile(
            path.join(EXPECT_PATH, `printTypeWithQuery.md`),
          );
        });

        test("returns an empty string if no type", () => {
          expect.hasAssertions();

          const printedType = printerInstance.printType("any", null);

          expect(printedType).toBe("");
        });

        test("prints a specification section if scalar as directive @specifiedBy", () => {
          expect.hasAssertions();

          const scalarType = {
            name: "Lorem Scalar",
            description: "Lorem Ipsum",
            specifiedByUrl: "http://lorem.ipsum",
            toString: () => "Lorem Scalar To String",
          };

          jest.spyOn(graphql, "isScalarType").mockReturnValue(true);

          const printedType = printerInstance.printType("scalar", scalarType);

          expect(printedType).toMatchFile(
            path.join(EXPECT_PATH, `printTypeWithScalarWithSpecifiedBy.md`),
          );
        });
      });
    });
  });
});
