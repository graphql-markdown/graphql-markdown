const path = require("path");

const { capitalize } = require("../../../src/utils/scalars/string");

const Printer = require("../../../src/lib/printer");

jest.mock("../../../src/lib/graphql");
const graphql = require("../../../src/lib/graphql");

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
        test.each(graphQLEntityType)(
          "returns markdown link for GraphQL %s",
          (type) => {
            expect.hasAssertions();

            const entityName = `Test${capitalize(type)}`;

            jest
              .spyOn(graphql, `is${capitalize(type)}Type`)
              .mockReturnValueOnce(true);
            jest.spyOn(graphql, "getNamedType").mockReturnValue(entityName);

            const link = printerInstance.toLink(type, entityName);

            expect(JSON.stringify(link)).toMatchFile(
              path.join(EXPECT_PATH, `toLinkWith${capitalize(type)}.json`),
            );
          },
        );

        test("returns markdown link surrounded by [] for GraphQL list/array", () => {
          expect.hasAssertions();

          const type = "list";
          const subtype = "object";
          const entityName = "TestObjectList";

          jest.spyOn(graphql, "isListType").mockReturnValue(true);
          jest
            .spyOn(graphql, `is${capitalize(subtype)}Type`)
            .mockReturnValueOnce(true);
          jest.spyOn(graphql, "getNamedType").mockReturnValue(entityName);
          jest.spyOn(graphql, "isNullableType").mockReturnValue(true);

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
        test("returns Markdown #### link section with description", () => {
          expect.hasAssertions();

          const type = { name: "EntityTypeName", description: "Lorem ipsum" };

          jest.spyOn(graphql, "getTypeName").mockReturnValue(type.name);
          jest.spyOn(graphql, "getNamedType").mockReturnValue(type.name);
          jest.spyOn(graphql, "isObjectType").mockReturnValueOnce(true);

          const section = printerInstance.printSectionItem(type);

          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionItem.md"),
          );
        });

        test.each([
          { nullable: true, is_list: true },
          { nullable: true, is_list: false },
          { nullable: false, is_list: true },
          { nullable: false, is_list: false },
        ])(
          "returns Markdown #### link section with sub type list is $is_list and nullable is $nullable",
          ({ nullable, is_list }) => {
            expect.hasAssertions();

            let label = nullable ? "Nullable" : "NonNullable";
            label += is_list ? "List" : "";

            const type = {
              name: "EntityTypeName",
              type: { name: `${label}ObjectType` },
            };

            jest.spyOn(graphql, "isNullableType").mockReturnValue(nullable);
            jest.spyOn(graphql, "isListType").mockReturnValue(is_list);
            jest
              .spyOn(graphql, "getTypeName")
              .mockImplementation((paramType) => paramType.name);
            jest
              .spyOn(graphql, "getNamedType")
              .mockImplementation((paramType) =>
                paramType ? paramType.name : null,
              );
            jest
              .spyOn(graphql, "isObjectType")
              .mockReturnValueOnce(false)
              .mockReturnValueOnce(true);

            const section = printerInstance.printSectionItem(type);

            expect(section).toMatchFile(
              path.join(EXPECT_PATH, `printSectionItemWithSubType${label}.md`),
            );
          },
        );

        test("returns Markdown #### link section with field parameters", () => {
          expect.hasAssertions();

          const type = {
            name: "EntityTypeName",
            args: [{ name: "ParameterTypeName" }],
          };

          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((paramType) => paramType.name);
          jest
            .spyOn(graphql, "getNamedType")
            .mockImplementation((paramType) => paramType.name);
          jest.spyOn(graphql, "isNullableType").mockReturnValue(true);
          jest.spyOn(graphql, "isObjectType").mockReturnValueOnce(true);
          jest.spyOn(graphql, "isParametrizedField").mockReturnValueOnce(true);
          const printSectionItems = jest.spyOn(
            printerInstance,
            "printSectionItems",
          );

          const section = printerInstance.printSectionItem(type);

          expect(printSectionItems).toHaveBeenCalledWith(type.args, "- #####");
          expect(section).toMatchFile(
            path.join(EXPECT_PATH, "printSectionWithFieldParameters.md"),
          );
        });
      });

      describe("printCodeEnum()", () => {
        const type = {
          name: "EnumTypeName",
          getValues: () => [{ name: "one" }, { name: "two" }],
        };

        test("returns enum code structure", () => {
          expect.hasAssertions();

          jest.spyOn(graphql, "isEnumType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((paramType) => paramType.name);

          const code = printerInstance.printCodeEnum(type);

          expect(code).toMatchFile(path.join(EXPECT_PATH, "printCodeEnum.md"));
        });

        test("returns empty string if not enum type", () => {
          expect.hasAssertions();

          jest.spyOn(graphql, "isEnumType").mockReturnValueOnce(false);

          const code = printerInstance.printCodeEnum(type);

          expect(code).toBe("");
        });
      });

      describe("printCodeUnion()", () => {
        const type = {
          name: "UnionTypeName",
          getTypes: () => [{ name: "one" }, { name: "two" }],
        };

        test("returns union code structure", () => {
          expect.hasAssertions();

          jest.spyOn(graphql, "isUnionType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((paramType) => paramType.name);

          const code = printerInstance.printCodeUnion(type);

          expect(code).toMatchFile(path.join(EXPECT_PATH, "printCodeUnion.md"));
        });

        test("returns empty string if not union type", () => {
          expect.hasAssertions();

          jest.spyOn(graphql, "isUnionType").mockReturnValueOnce(false);

          const code = printerInstance.printCodeUnion(type);

          expect(code).toBe("");
        });
      });

      describe("printCodeScalar()", () => {
        const type = {
          name: "ScalarTypeName",
        };

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

          const type = {
            name: "OperationName",
            args: [
              {
                name: "ParamWithDefault",
                type: "string",
                default: "defaultValue",
              },
              { name: "ParamNoDefault", type: "any" },
              { name: "ParamIntZero", type: "int", default: 0 },
              { name: "ParamIntNoDefault", type: "int" },
            ],
          };

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

          const type = { name: "TestInterfaceName", fields: ["one", "two"] };

          jest.spyOn(graphql, "isInterfaceType").mockReturnValueOnce(true);
          jest.spyOn(graphql, "getTypeName").mockReturnValueOnce()(type.name);
          jest.spyOn(graphql, "getFields").mockReturnValueOnce(type.fields);
          jest
            .spyOn(printerInstance, "printCodeField")
            .mockImplementation((name) => `${name}\n`);

          const code = printerInstance.printCodeType(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeTypeWithInterface.md"),
          );
        });

        test("returns an object with its fields and interfaces", () => {
          expect.hasAssertions();

          const type = {
            name: "TestName",
            fields: ["one", "two"],
            getInterfaces: () => [{ name: "TestInterfaceName" }],
          };
          jest.spyOn(graphql, "isInterfaceType").mockReturnValueOnce(false);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((entityType) => entityType.name);
          jest.spyOn(graphql, "getFields").mockReturnValueOnce(type.fields);
          jest
            .spyOn(printerInstance, "printCodeField")
            .mockImplementation((codeField) => `${codeField}\n`);

          const code = printerInstance.printCodeType(type);

          expect(code).toMatchFile(
            path.join(EXPECT_PATH, "printCodeTypeWithObject.md"),
          );
        });
        test("returns an input with its fields", () => {
          expect.hasAssertions();

          const type = {
            name: "TestName",
            fields: ["one", "two"],
          };
          jest.spyOn(graphql, "isInputType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((entityType) => entityType.name);
          jest.spyOn(graphql, "getFields").mockReturnValueOnce(type.fields);
          jest
            .spyOn(printerInstance, "printCodeField")
            .mockImplementation((codeField) => `${codeField}\n`);
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

            const entityName = `Test${capitalize(type)}`;

            jest
              .spyOn(graphql, `is${capitalize(type)}Type`)
              .mockReturnValueOnce(true);
            let printCode;
            if (["interface", "object", "input"].includes(type)) {
              printCode = jest
                .spyOn(printerInstance, "printCodeType")
                .mockReturnValueOnce(entityName);
            } else {
              printCode = jest
                .spyOn(printerInstance, `printCode${capitalize(type)}`)
                .mockReturnValueOnce(entityName);
            }

            const code = printerInstance.printCode(entityName);

            expect(printCode).toHaveBeenCalledWith(entityName);

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
