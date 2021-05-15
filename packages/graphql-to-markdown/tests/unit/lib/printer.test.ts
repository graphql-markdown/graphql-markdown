import { capitalize } from "lodash";
import type {
  GraphQLEnumType,
  GraphQLField,
  GraphQLNamedType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLType,
  GraphQLUnionType,
} from "graphql";

import { Printer } from "../../../src/lib/printer";

jest.mock("../../../src/lib/graphql");
import * as graphql from "../../../src/lib/graphql";

const graphQLEntityType = [
  "enum",
  "union",
  "interface",
  "object",
  "input",
  "scalar",
  "directive",
];

describe("lib", () => {
  describe("printer", () => {
    describe("class Printer", () => {
      let printerInstance: Printer;
      const baseURL = "graphql";
      const root = "docs";
      const schema = { toString: () => "SCHEMA", getType: (type) => type };

      beforeEach(() => {
        printerInstance = new Printer(<GraphQLSchema>schema, baseURL, root);
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      describe("toLink()", () => {
        test.each(graphQLEntityType)(
          "returns markdown link for GraphQL %s",
          (type) => {
            const entityName = `Test${capitalize(type)}`;
            const typeGuardName = `is${capitalize(type)}Type`;
            jest.spyOn(graphql, typeGuardName as any).mockReturnValueOnce(true);
            jest
              .spyOn(graphql, "getNamedType")
              .mockReturnValue(entityName as unknown as GraphQLNamedType);
            const link = printerInstance.toLink(type, entityName);
            expect(link).toMatchSnapshot();
          },
        );

        test("returns markdown link surrounded by [] for GraphQL list/array", () => {
          const type = "list";
          const subtype = "object";
          const entityName = "TestObjectList";
          const typeGuardName = `is${capitalize(subtype)}Type`;
          jest.spyOn(graphql, "isListType").mockReturnValue(true);
          jest.spyOn(graphql, typeGuardName as any).mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getNamedType")
            .mockReturnValue(entityName as unknown as GraphQLNamedType);
          const link = printerInstance.toLink(type, entityName);
          expect(link).toMatchSnapshot();
        });

        test("returns plain text for unknown entities", () => {
          const type = "any";
          const entityName = "fooBar";
          const link = printerInstance.toLink(type, entityName);
          expect(link).toMatchSnapshot();
        });
      });

      describe("printSection()", () => {
        test("returns Markdown ### section by default", () => {
          const printSectionItems = jest
            .spyOn(printerInstance, "printSectionItems")
            .mockImplementation((content) => content);
          const title = "section title";
          const content = ["section content"];
          const section = printerInstance.printSection(<any>content, title);
          expect(printSectionItems).toHaveBeenCalledWith(content);
          expect(section).toMatchSnapshot();
        });

        test("returns Markdown custom section level", () => {
          jest
            .spyOn(printerInstance, "printSectionItems")
            .mockImplementation((content) => content);
          const title = "section title";
          const content = ["section content"];
          const section = printerInstance.printSection(
            <any>content,
            title,
            "#",
          );
          expect(section).toMatchSnapshot();
        });

        test("returns empty string if content is empty", () => {
          const title = "section title";
          const content = [];
          const section = printerInstance.printSection(content, title);
          expect(section).toBe("");
        });
      });

      describe("printSectionItems()", () => {
        test("returns Markdown one line per item", () => {
          const printSectionItem = jest
            .spyOn(printerInstance, "printSectionItem")
            .mockImplementation((content) => content);

          const itemList = ["one", "two", "three"];
          const section = printerInstance.printSectionItems(<any>itemList);
          expect(printSectionItem).toHaveBeenCalledTimes(3);
          expect(printSectionItem).toHaveBeenLastCalledWith(
            itemList.pop(),
            "####",
          );
          expect(section).toMatchSnapshot();
        });

        test("returns empty text if not a list", () => {
          const itemList = ["list"];
          const section = printerInstance.printSectionItems(<any>itemList);
          expect(section).toMatch("");
        });
      });

      describe("printSectionItem()", () => {
        test("returns Markdown #### link section with description", () => {
          const type = { name: "EntityTypeName", description: "Lorem ipsum" };
          jest.spyOn(graphql, "getTypeName").mockReturnValue(type.name);
          jest.spyOn(graphql, "getNamedType").mockReturnValue(<any>type.name);
          jest.spyOn(graphql, "isObjectType").mockReturnValueOnce(true);

          const section = printerInstance.printSectionItem(<GraphQLType>type);
          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with sub type", () => {
          const type = {
            name: "EntityTypeName",
            type: { name: "AnObjectType" },
          };
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((type) => type.name);
          jest
            .spyOn(graphql, "getNamedType")
            .mockImplementation((type: any) => type.name);
          jest
            .spyOn(graphql, "isObjectType")
            .mockReturnValueOnce(false)
            .mockReturnValueOnce(true);

          const section = printerInstance.printSectionItem(
            <GraphQLType>(<unknown>type),
          );
          expect(section).toMatchSnapshot();
        });

        test("returns Markdown #### link section with field parameters", () => {
          const type: any = {
            name: "EntityTypeName",
            args: [{ name: "ParameterTypeName" }],
          };
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((type) => type.name);
          jest
            .spyOn(graphql, "getNamedType")
            .mockImplementation((type: any) => type.name);
          jest.spyOn(graphql, "isObjectType").mockReturnValueOnce(true);
          jest.spyOn(graphql, "isParametrized").mockReturnValueOnce(true);
          const printSectionItems = jest.spyOn(
            printerInstance,
            "printSectionItems",
          );

          const section = printerInstance.printSectionItem(type);
          expect(printSectionItems).toHaveBeenCalledWith(type.args, "- #####");
          expect(section).toMatchSnapshot();
        });
      });

      describe("printCodeEnum()", () => {
        const type = {
          name: "EnumTypeName",
          getValues: () => [{ name: "one" }, { name: "two" }],
        };

        test("returns enum code structure", () => {
          jest.spyOn(graphql, "isEnumType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((type) => type.name);
          const code = printerInstance.printCodeEnum(<GraphQLEnumType>type);
          expect(code).toMatchSnapshot();
        });

        test("returns empty string if not enum type", () => {
          jest.spyOn(graphql, "isEnumType").mockReturnValueOnce(false);
          const code = printerInstance.printCodeEnum(<GraphQLEnumType>type);
          expect(code).toBe("");
        });
      });

      describe("printCodeUnion()", () => {
        const type = {
          name: "UnionTypeName",
          getTypes: () => [{ name: "one" }, { name: "two" }],
        };

        test("returns union code structure", () => {
          jest.spyOn(graphql, "isUnionType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((type) => type.name);
          const code = printerInstance.printCodeUnion(<GraphQLUnionType>type);
          expect(code).toMatchSnapshot();
        });

        test("returns empty string if not union type", () => {
          jest.spyOn(graphql, "isUnionType").mockReturnValueOnce(false);
          const code = printerInstance.printCodeUnion(
            <GraphQLScalarType>(<unknown>type),
          );
          expect(code).toBe("");
        });
      });

      describe("printCodeScalar()", () => {
        const type = {
          name: "ScalarTypeName",
        };

        test("returns scalar code structure", () => {
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((type) => type.name);
          const code = printerInstance.printCodeScalar(<GraphQLType>type);
          expect(code).toMatchSnapshot();
        });
      });

      describe("printCodeArguments()", () => {
        test("returns a Markdown one line per formatted argument with default value surrounded by ()", () => {
          const type = {
            name: "OperationName",
            args: [
              {
                name: "ParamWithDefault",
                type: "string",
                default: "defaultValue",
              },
              { name: "ParamNoDefault", type: "any" },
            ],
          };
          jest
            .spyOn(graphql, "getDefaultValue")
            .mockImplementation((type: any) => type.default || null);
          const code = printerInstance.printCodeArguments(type);
          expect(code).toMatchSnapshot();
        });

        test("returns an empty string if args list empty", () => {
          const type = {
            name: "OperationName",
            args: [],
          };
          const code = printerInstance.printCodeArguments(type);
          expect(code).toBe("");
        });

        test("returns an empty string if no args", () => {
          const type = {
            name: "OperationName",
          };
          const code = printerInstance.printCodeArguments(type);
          expect(code).toBe("");
        });
      });

      describe("printCodeField()", () => {
        test("returns a field with its type", () => {
          const entityType = { name: "FooBar", type: "string" };
          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(entityType.name)
            .mockReturnValueOnce(entityType.type);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("");
          const code = printerInstance.printCodeField(
            <GraphQLField<unknown, unknown, unknown>>(<unknown>entityType),
          );
          expect(code).toMatchSnapshot();
        });

        test("returns a field with its type and arguments", () => {
          const entityType = { name: "FooBar", type: "string" };
          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(entityType.name)
            .mockReturnValueOnce(entityType.type);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("(\narg: boolean\n)");
          const code = printerInstance.printCodeField(
            <GraphQLField<unknown, unknown, unknown>>(<unknown>entityType),
          );
          expect(code).toMatchSnapshot();
        });
      });

      describe("printCodeDirective()", () => {
        test("returns a directive", () => {
          const type = { name: "FooBar", type: "string" };
          jest.spyOn(graphql, "getTypeName").mockReturnValueOnce(type.name);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("");
          const code = printerInstance.printCodeDirective(type);
          expect(code).toMatchSnapshot();
        });

        test("returns a directive with its arguments", () => {
          const entityType = { name: "FooBar", type: "string" };
          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(entityType.name);
          jest
            .spyOn(printerInstance, "printCodeArguments")
            .mockReturnValueOnce("(\narg: boolean\n)");
          const code = printerInstance.printCodeDirective(
            <GraphQLType>(<unknown>entityType),
          );
          expect(code).toMatchSnapshot();
        });
      });

      describe("printCodeType()", () => {
        test("returns an interface with its fields", () => {
          const entityType = {
            name: "TestInterfaceName",
            fields: ["one", "two"],
          };
          jest.spyOn(graphql, "isInterfaceType").mockReturnValueOnce(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(entityType.name);
          jest
            .spyOn(graphql, "getFields")
            .mockReturnValueOnce(entityType.fields);
          jest
            .spyOn(printerInstance, "printCodeField")
            .mockImplementation((name) => `${name}\n`);
          const code = printerInstance.printCodeType(
            <GraphQLType>(<unknown>entityType),
          );
          expect(code).toMatchSnapshot();
        });

        test("returns an object with its fields and interfaces", () => {
          const entityType = {
            name: "TestName",
            fields: ["one", "two"],
            getInterfaces: () => [{ name: "TestInterfaceName" }],
          };
          jest.spyOn(graphql, "isInterfaceType").mockReturnValueOnce(false);
          jest
            .spyOn(graphql, "getTypeName")
            .mockImplementation((type) => type.name);
          jest
            .spyOn(graphql, "getFields")
            .mockReturnValueOnce(entityType.fields);
          jest
            .spyOn(printerInstance, "printCodeField")
            .mockImplementation((name) => `${name}\n`);
          const code = printerInstance.printCodeType(
            <GraphQLType>(<unknown>entityType),
          );
          expect(code).toMatchSnapshot();
        });
      });

      describe("printHeader()", () => {
        test("returns a Docusaurus document header", () => {
          const header = printerInstance.printHeader(
            "an-object-type-name",
            "An Object Type Name",
          );
          expect(header).toMatchSnapshot();
        });
      });

      describe("printDescription()", () => {
        test("returns the type description text", () => {
          const entityType = { description: "Lorem ipsum" };
          const description = printerInstance.printDescription(
            <GraphQLType>(<unknown>entityType),
          );
          expect(description).toMatchSnapshot();
        });

        test("returns the default text if no description", () => {
          const entityType = {};
          const description = printerInstance.printDescription(
            <GraphQLType>(<unknown>entityType),
          );
          expect(description).toMatchSnapshot();
        });

        test("return DEPRECATED tag is deprecated", () => {
          const entityType = {
            description: "Lorem ipsum",
            isDeprecated: true,
            deprecationReason: "Foobar",
          };
          const description = printerInstance.printDescription(
            <GraphQLType>(<unknown>entityType),
          );
          expect(description).toMatchSnapshot();
        });
      });

      describe("printCode()", () => {
        test.each(graphQLEntityType)(
          "returns a Markdown graphql codeblock with type %s",
          (type) => {
            const entityType = { name: `Test${capitalize(type)}` };
            const typeGuardName = `is${capitalize(type)}Type`;
            jest.spyOn(graphql, typeGuardName as any).mockReturnValueOnce(true);
            let printCode;
            if (["interface", "object", "input"].includes(type)) {
              printCode = jest
                .spyOn(printerInstance, "printCodeType")
                .mockReturnValueOnce(entityType.name);
            } else {
              printCode = jest
                .spyOn(printerInstance, `printCode${capitalize(type)}`)
                .mockReturnValueOnce(<any>entityType.name);
            }
            const code = printerInstance.printCode(
              <GraphQLType>(<unknown>entityType),
            );
            expect(printCode).toHaveBeenCalledWith(entityType);
            expect(code).toMatchSnapshot();
          },
        );

        test("returns a Markdown graphql codeblock with type query", () => {
          const entityType = { name: "TestQuery" };
          jest.spyOn(graphql, "isOperation").mockReturnValueOnce(true);
          const printCode = jest
            .spyOn(printerInstance, "printCodeField")
            .mockReturnValueOnce(entityType.name);
          const code = printerInstance.printCode(
            <GraphQLType>(<unknown>entityType),
          );
          expect(printCode).toHaveBeenCalledWith(entityType);
          expect(code).toMatchSnapshot();
        });

        test("returns a Markdown codeblock with non supported message for unsupported type", () => {
          const entityType = { name: "TestFooBarType" };
          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValueOnce(entityType.name);
          const code = printerInstance.printCode(
            <GraphQLType>(<unknown>entityType),
          );
          expect(code).toMatchSnapshot();
        });
      });

      describe("printType()", () => {
        test.each(graphQLEntityType)(
          "returns a Markdown formatted Docusaurus content for type %s",
          (type) => {
            const entityType = {
              name: type,
              getValues: () => {
                return;
              },
              getTypes: () => {
                return;
              },
            };
            const typeGuardName = `is${capitalize(type)}Type`;
            jest.spyOn(graphql, typeGuardName as any).mockReturnValueOnce(true);
            jest
              .spyOn(printerInstance, "printHeader")
              .mockImplementation((name) => `header-${name}`);
            jest
              .spyOn(printerInstance, "printDescription")
              .mockImplementation(
                (type: any) => `Test ${capitalize(type.name)}`,
              );
            jest
              .spyOn(printerInstance, "printCode")
              .mockImplementation((type: any) => `\`\`\`${type.name}\`\`\``);
            jest
              .spyOn(printerInstance, "printSection")
              .mockImplementation((_, section) => section);
            const printedType = printerInstance.printType(
              entityType.name,
              <GraphQLType>(<unknown>entityType),
            );
            expect(printedType).toMatchSnapshot();
          },
        );

        test.each(["object", "input"])(
          "returns a Markdown formatted Docusaurus content for %s implementing interface",
          (type) => {
            const entityType = {
              name: type,
              getValues: () => {
                return;
              },
              getTypes: () => {
                return;
              },
              getInterfaces: () => {
                return;
              },
            };
            const typeGuardName = `is${capitalize(type)}Type`;
            jest.spyOn(graphql, typeGuardName as any).mockReturnValueOnce(true);
            jest
              .spyOn(printerInstance, "printHeader")
              .mockImplementation((name) => `header-${name}\n\n`);
            jest
              .spyOn(printerInstance, "printDescription")
              .mockImplementation(
                (type: any) => `Test ${capitalize(type.name)}\n\n`,
              );
            jest
              .spyOn(printerInstance, "printCode")
              .mockImplementation(
                (type: any) => `\`\`\`${type.name}\`\`\`\n\n`,
              );
            jest
              .spyOn(printerInstance, "printSection")
              .mockImplementation((_, section) => `${section}\n\n`);
            const printedType = printerInstance.printType(
              entityType.name,
              <GraphQLType>(<unknown>entityType),
            );
            expect(printedType).toMatchSnapshot();
          },
        );

        test("returns a Markdown formatted Docusaurus content for query", () => {
          const entityType = {
            name: "query",
          };
          jest.spyOn(graphql, "isOperation").mockReturnValue(true);
          jest
            .spyOn(graphql, "getTypeName")
            .mockReturnValue(<any>entityType.name);
          jest
            .spyOn(printerInstance, "printHeader")
            .mockImplementation((name) => `header-${name}\n\n`);
          jest
            .spyOn(printerInstance, "printDescription")
            .mockImplementation(
              (type: any) => `Test ${capitalize(type.name)}\n\n`,
            );
          jest
            .spyOn(printerInstance, "printCode")
            .mockImplementation((type: any) => `\`\`\`${type.name}\`\`\`\n\n`);
          jest
            .spyOn(printerInstance, "printSection")
            .mockImplementation((_, section) => `${section}\n\n`);
          const printedType = printerInstance.printType(
            entityType.name,
            <GraphQLType>(<unknown>entityType),
          );
          expect(printedType).toMatchSnapshot();
        });
      });
    });
  });
});
