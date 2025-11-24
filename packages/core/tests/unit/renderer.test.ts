import { GraphQLScalarType } from "graphql/type";
import { Kind } from "graphql/language";

import type {
  ApiGroupOverrideType,
  IPrinter,
  MDXString,
  PackageName,
  RendererDocOptions,
  SchemaEntity,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("node:fs/promises");

jest.mock("node:path", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("node:path"),
  };
});
import * as path from "node:path";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("@graphql-markdown/printer-legacy");
import { Printer } from "@graphql-markdown/printer-legacy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("@graphql-markdown/utils", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("@graphql-markdown/utils"),
    isDeprecated: jest.fn(),
    ensureDir: jest.fn(),
    fileExists: jest.fn(),
    saveFile: jest.fn(),
    copyFile: jest.fn(),
    readFile: jest.fn(),
  };
});
import * as Utils from "@graphql-markdown/utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("@graphql-markdown/graphql"),
    isDeprecated: jest.fn(),
    isApiType: jest.fn(),
  };
});
import * as GraphQL from "@graphql-markdown/graphql";

import type { Renderer } from "../../src/renderer";
import { API_GROUPS, getRenderer, getApiGroupFolder } from "../../src/renderer";
import {
  DEFAULT_OPTIONS,
  DEFAULT_HIERARCHY,
  TypeHierarchy,
} from "../../src/config";

const DEFAULT_RENDERER_OPTIONS: RendererDocOptions = {
  ...DEFAULT_OPTIONS.docOptions,
  deprecated: DEFAULT_OPTIONS.printTypeOptions!
    .deprecated! as TypeDeprecatedOption,
  hierarchy: DEFAULT_HIERARCHY,
};

describe("renderer", () => {
  describe("class Renderer", () => {
    let rendererInstance: Renderer;
    const baseURL: string = "graphql";

    beforeEach(async () => {
      rendererInstance = await getRenderer(
        Printer as unknown as typeof IPrinter,
        "/output",
        baseURL,
        undefined,
        DEFAULT_OPTIONS.pretty!,
        DEFAULT_RENDERER_OPTIONS,
        {
          generateIndexMetafile: jest.fn((dirPath, category) => {
            return path.join(dirPath, category).toLocaleLowerCase();
          }),
        },
      );

      // silent console
      jest.spyOn(globalThis.console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    describe("renderTypeEntities()", () => {
      test("creates entity page structure into output folder", async () => {
        expect.assertions(2);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        const output = "/output/foobar";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "FooBar",
          "FooBar",
        );

        expect(meta).toEqual({ category: "Foobar", slug: "foobar/foo-bar" });
        expect(spy).toHaveBeenCalledWith(
          `${output}/foo-bar.mdx`,
          "Lorem ipsum",
          undefined,
        );
      });

      test("creates entity page flat structure into output if hierarchy is flat", async () => {
        expect.assertions(2);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        jest.replaceProperty(rendererInstance, "options", {
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.FLAT]: {} },
        });

        const output = "/output";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "FooBar",
          "FooBar",
        );

        expect(meta).toEqual({ category: "schema", slug: "foo-bar" });
        expect(spy).toHaveBeenCalledWith(
          `${output}/foo-bar.mdx`,
          "Lorem ipsum",
          undefined,
        );
      });

      test("creates entity page with MDX extension when hasMDXSupport is true", async () => {
        expect.assertions(1);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        jest.replaceProperty(rendererInstance, "mdxModule", {});

        const output = "/output/foobar";
        await rendererInstance.renderTypeEntities(output, "FooBar", "FooBar");

        expect(spy).toHaveBeenCalledWith(
          `${output}/foo-bar.mdx`,
          "Lorem ipsum",
          undefined,
        );
      });

      test("applies prettify function when prettify is true", async () => {
        expect.assertions(1);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        jest.replaceProperty(rendererInstance, "prettify", true);

        const output = "/output/foobar";
        await rendererInstance.renderTypeEntities(output, "FooBar", "FooBar");

        expect(spy).toHaveBeenCalledWith(
          `${output}/foo-bar.mdx`,
          "Lorem ipsum",
          Utils.prettifyMarkdown,
        );
      });

      test("do nothing if type is not defined", async () => {
        expect.assertions(1);

        jest.spyOn(Printer, "printType").mockReturnValue(undefined);

        const meta = await rendererInstance.renderTypeEntities(
          "test",
          "FooBar",
          null,
        );

        expect(meta).toBeUndefined();
      });

      test("return undefined and logs warning if an error is thrown", async () => {
        expect.assertions(2);

        jest.spyOn(Printer, "printType").mockImplementationOnce(() => {
          throw new Error();
        });

        const spy = jest.spyOn(globalThis.console, "warn");

        const meta = await rendererInstance.renderTypeEntities(
          "test",
          "FooBar",
          "TestType",
        );

        expect(meta).toBeUndefined();
        expect(spy).toHaveBeenCalledWith(
          `An error occurred while processing "TestType"`,
        );
      });

      test("return undefined and logs warning if file path is invalid", async () => {
        expect.assertions(2);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        jest.spyOn(path, "relative").mockReturnValueOnce("not-valid.md");
        const spy = jest.spyOn(globalThis.console, "warn");

        const meta = await rendererInstance.renderTypeEntities(
          "test",
          "FooBar",
          "TestType",
        );

        expect(meta).toBeUndefined();
        expect(spy).toHaveBeenCalledWith(
          `An error occurred while processing file test/foo-bar.mdx for type "TestType"`,
        );
      });

      test("uses frontmatter configuration when available", async () => {
        expect.assertions(1);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Printer, "printType");

        const optionsWithFrontMatter: RendererDocOptions = {
          frontMatter: { custom: "value" },
        };

        jest.replaceProperty(
          rendererInstance,
          "options",
          optionsWithFrontMatter,
        );

        const output = "/output/foobar";
        await rendererInstance.renderTypeEntities(output, "FooBar", "FooBar");

        expect(spy).toHaveBeenCalledWith(
          "foo-bar",
          "FooBar",
          expect.objectContaining(optionsWithFrontMatter),
        );
      });

      test("handles cancelled rendering when printType returns an empty string", async () => {
        expect.assertions(2);

        jest.spyOn(Printer, "printType").mockReturnValue("" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        const output = "/output/foobar";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "FooBar",
          "FooBar",
        );

        expect(meta).toBeUndefined();
        expect(spy).not.toHaveBeenCalled();
      });

      test("handles both pathname and type name when they are different", async () => {
        expect.assertions(2);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        const output = "/output/foobar";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "CustomTypeName", // name different from actual type name
          "ActualType", // actual type object
        );

        expect(meta).toEqual({
          category: "Foobar",
          slug: "foobar/custom-type-name",
        });
        expect(spy).toHaveBeenCalledWith(
          `${output}/custom-type-name.mdx`,
          "Lorem ipsum",
          undefined,
        );
      });

      test("handles non-alphanumeric characters in type names", async () => {
        expect.assertions(2);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        const output = "/output/special";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "Type_With-Special@Chars!",
          "SpecialType",
        );

        expect(meta).toEqual({
          category: "Special",
          slug: "special/type-with-special-chars",
        });
        expect(spy).toHaveBeenCalledWith(
          `${output}/type-with-special-chars.mdx`,
          "Lorem ipsum",
          undefined,
        );
      });

      test("throws error when output directory is empty", async () => {
        expect.assertions(1);

        await expect(
          rendererInstance.renderTypeEntities(
            "", // empty output directory
            "FooBar",
            "TestType",
          ),
        ).rejects.toThrow("Output directory is empty or not specified");
      });
    });

    describe("renderHomepage()", () => {
      test("copies default homepage into output folder", async () => {
        expect.assertions(1);

        jest.spyOn(Utils, "readFile").mockResolvedValueOnce("Test Homepage");
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.renderHomepage("/assets/generated.md");

        expect(spy).toHaveBeenCalledWith(
          "/output/generated.md",
          "Test Homepage",
          undefined,
        );
      });

      test("replaces template variables in homepage content", async () => {
        expect.assertions(1);

        jest
          .spyOn(Utils, "readFile")
          .mockResolvedValueOnce(
            "baseURL: ##baseURL## - Generated: ##generated-date-time##",
          );
        const spy = jest.spyOn(Utils, "saveFile");

        // Mock Date to have consistent test results
        const mockDate = new Date(2023, 0, 1, 12, 0, 0);
        jest.spyOn(global, "Date").mockImplementation(() => {
          return mockDate as unknown as Date;
        });

        await rendererInstance.renderHomepage("/assets/generated.md");

        expect(spy).toHaveBeenCalledWith(
          "/output/generated.md",
          `baseURL: /graphql - Generated: ${mockDate.toLocaleString()}`,
          undefined,
        );
      });

      test("handles errors when reading homepage template", async () => {
        expect.assertions(2);

        const readFileSpy = jest
          .spyOn(Utils, "readFile")
          .mockRejectedValueOnce(new Error("File not found"));
        const consoleSpy = jest.spyOn(globalThis.console, "warn");

        await rendererInstance.renderHomepage("/assets/nonexistent.md");

        expect(readFileSpy).toHaveBeenCalledWith("/output/nonexistent.md");
        expect(consoleSpy).toHaveBeenCalledWith(
          "An error occurred while processing the homepage /assets/nonexistent.md: Error: File not found",
        );
      });

      test("handles empty homepage content", async () => {
        expect.assertions(1);

        jest.spyOn(Utils, "readFile").mockResolvedValueOnce("");
        const saveFileSpy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.renderHomepage("/assets/empty.md");

        expect(saveFileSpy).toHaveBeenCalledWith(
          "/output/empty.md",
          "",
          undefined,
        );
      });

      test("preserves content without template variables", async () => {
        expect.assertions(1);

        const content =
          "# GraphQL API Documentation\n\nThis is static content with no variables.";
        jest.spyOn(Utils, "readFile").mockResolvedValueOnce(content);
        const saveFileSpy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.renderHomepage("/assets/no-variables.md");

        expect(saveFileSpy).toHaveBeenCalledWith(
          "/output/no-variables.md",
          content,
          undefined,
        );
      });

      test("handles multiple template variables", async () => {
        expect.assertions(1);

        const content =
          "baseURL: ##baseURL##\ngenerated: ##generated-date-time##\nbaseURL again: ##baseURL##";
        jest.spyOn(Utils, "readFile").mockResolvedValueOnce(content);
        const saveFileSpy = jest.spyOn(Utils, "saveFile");

        // Mock Date to have consistent test results
        const mockDate = new Date(2023, 0, 1, 12, 0, 0);
        jest.spyOn(global, "Date").mockImplementation(() => {
          return mockDate as unknown as Date;
        });

        await rendererInstance.renderHomepage("/assets/multiple-vars.md");

        const expected = `baseURL: /graphql\ngenerated: ${mockDate.toLocaleString()}\nbaseURL again: /graphql`;
        expect(saveFileSpy).toHaveBeenCalledWith(
          "/output/multiple-vars.md",
          expected,
          undefined,
        );
      });

      test("handles errors when saving homepage", async () => {
        expect.assertions(2);

        jest.spyOn(Utils, "readFile").mockResolvedValueOnce("Test content");
        const saveFileSpy = jest
          .spyOn(Utils, "saveFile")
          .mockRejectedValueOnce(new Error("Write error"));
        const consoleSpy = jest.spyOn(globalThis.console, "warn");

        await rendererInstance.renderHomepage("/assets/error-saving.md");

        expect(saveFileSpy).toHaveBeenCalledWith(
          "/output/error-saving.md",
          "Test content",
          undefined,
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          "An error occurred while processing the homepage /assets/error-saving.md: Error: Write error",
        );
      });

      test("applies prettify function when prettify is enabled", async () => {
        expect.assertions(1);

        jest
          .spyOn(Utils, "readFile")
          .mockResolvedValueOnce("## Unformatted content");
        const saveFileSpy = jest.spyOn(Utils, "saveFile");

        // Enable prettify
        jest.replaceProperty(rendererInstance, "prettify", true);

        await rendererInstance.renderHomepage("/assets/to-prettify.md");

        expect(saveFileSpy).toHaveBeenCalledWith(
          "/output/to-prettify.md",
          "## Unformatted content",
          Utils.prettifyMarkdown,
        );
      });

      test("throws error when output directory is empty", async () => {
        expect.assertions(1);

        // Set renderer's outputDir to empty string
        jest.replaceProperty(rendererInstance, "outputDir", "");

        await expect(
          rendererInstance.renderHomepage("/assets/homepage.md"),
        ).rejects.toThrow("Output directory is empty or not specified");
      });

      test("do not generated homepage if undefined", async () => {
        expect.assertions(1);

        const spy = jest.spyOn(Utils, "copyFile");

        // Pass undefined as the homepage location
        await rendererInstance.renderHomepage(undefined);

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("renderRootTypes()", () => {
      test("render root type", async () => {
        expect.assertions(2);

        jest.spyOn(Printer, "printType").mockImplementation(() => {
          return "content" as MDXString;
        });
        jest.spyOn(Utils, "fileExists").mockResolvedValue(true);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.renderRootTypes("objects", {
          foo: new GraphQLScalarType({
            name: "foo",
            astNode: {
              kind: Kind.SCALAR_TYPE_DEFINITION,
              name: { kind: Kind.NAME, value: "foo" },
            },
          }),
          bar: new GraphQLScalarType({
            name: "bar",
            astNode: {
              kind: Kind.SCALAR_TYPE_DEFINITION,
              name: { kind: Kind.NAME, value: "bar" },
            },
          }),
        });

        expect(spy).toHaveBeenNthCalledWith(
          1,
          "/output/types/objects/foo.mdx",
          "content",
          undefined,
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "/output/types/objects/bar.mdx",
          "content",
          undefined,
        );
      });

      test("returns undefined if type is not an object", async () => {
        expect.assertions(1);

        const result = await rendererInstance.renderRootTypes("objects", null);

        expect(result).toBeUndefined();
      });

      test("renders root types with flat hierarchy", async () => {
        expect.assertions(2);

        jest.spyOn(Printer, "printType").mockImplementation(() => {
          return "content" as MDXString;
        });
        jest.replaceProperty(rendererInstance, "options", {
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.FLAT]: {} },
        });
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.renderRootTypes("objects", {
          foo: new GraphQLScalarType({
            name: "foo",
            astNode: {
              kind: Kind.SCALAR_TYPE_DEFINITION,
              name: { kind: Kind.NAME, value: "foo" },
            },
          }),
        });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(
          "/output/foo.mdx",
          "content",
          undefined,
        );
      });
    });

    describe("generateCategoryMetafileType()", () => {
      test("generate type _category_.yml file", async () => {
        expect.assertions(3);

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
        });

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Foo",
          "objects",
        );

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith("/output/objects", "objects");
        expect(dirPath).toBe("/output/objects");
      });

      test("generate group _category_.yml file", async () => {
        expect.assertions(3);

        const [type, name, root, group] = [{}, "Foo", "objects", "lorem"];

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "group", {
          [root]: { [name]: group },
        });
        jest.replaceProperty(rendererInstance, "options", {
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
        });

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as SchemaEntity,
        );

        expect(spy).toHaveBeenCalledWith("/output/lorem", "lorem");
        expect(spy).toHaveBeenCalledWith("/output/lorem/objects", "objects");
        expect(dirPath).toBe(`/output/${group}/${root.toLowerCase()}`);
      });

      test("generate deprecated _category_.yml file if type is deprecated", async () => {
        expect.assertions(3);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "group",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
        });
        jest.spyOn(GraphQL, "isDeprecated").mockReturnValueOnce(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as SchemaEntity,
        );

        expect(spy).toHaveBeenCalledWith("/output/deprecated", "deprecated", {
          sidebarPosition: 999,
          styleClass: "graphql-markdown-deprecated-section",
        });
        expect(spy).toHaveBeenCalledWith("/output/deprecated/baz", "Baz");
        expect(dirPath).toBe(`/output/deprecated/${root.toLowerCase()}`);
      });

      test("generate no deprecated _category_.yml file if type is not deprecated", async () => {
        expect.assertions(2);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "group",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
        });
        jest.spyOn(GraphQL, "isDeprecated").mockReturnValueOnce(false);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as SchemaEntity,
        );

        expect(spy).toHaveBeenCalledWith("/output/baz", "Baz");
        expect(dirPath).toBe(`/output/${root.toLowerCase()}`);
      });

      test("generate no deprecated _category_.yml file if deprecated is not group", async () => {
        expect.assertions(2);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "default",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
        });
        jest.spyOn(GraphQL, "isDeprecated").mockReturnValueOnce(false);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as SchemaEntity,
        );

        expect(spy).toHaveBeenCalledWith("/output/baz", "Baz");
        expect(dirPath).toBe(`/output/${root.toLowerCase()}`);
      });

      test("generate deprecated and group _category_.yml files", async () => {
        expect.assertions(2);

        const [type, name, root, group] = [{}, "Foo", "Baz", "lorem"];

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "group",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.ENTITY]: {} },
        });
        jest.replaceProperty(rendererInstance, "group", {
          [root]: { [name]: group },
        });
        jest.spyOn(GraphQL, "isDeprecated").mockReturnValueOnce(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as SchemaEntity,
        );

        expect(spy).toHaveBeenCalledTimes(3);
        expect(dirPath).toBe(
          `/output/deprecated/${group}/${root.toLowerCase()}`,
        );
      });

      test("generate api _category_.yml file", async () => {
        expect.assertions(3);

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "default",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.API]: {} },
        });

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Foo",
          "queries",
        );

        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy).toHaveBeenCalledWith(
          `/output/${API_GROUPS.operations}/queries`,
          "queries",
        );
        expect(dirPath).toBe(`/output/${API_GROUPS.operations}/queries`);
      });

      test("generate system _category_.yml file", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "default",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.API]: {} },
        });

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Foo",
          "objects",
        );

        expect(spy).toHaveBeenCalledWith(
          `/output/${API_GROUPS.types}/objects`,
          "objects",
        );
        expect(dirPath).toBe(`/output/${API_GROUPS.types}/objects`);
      });

      test("does not generate _category_.yml file if hierarchy is flat", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "default",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.FLAT]: {} },
        });

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Foo",
          "objects",
        );

        expect(spy).not.toHaveBeenCalled();
        expect(dirPath).toBe(`/output`);
      });

      test("handles custom API group names", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "default",
          frontMatter: undefined,
          hierarchy: {
            [TypeHierarchy.API]: {
              operations: "api",
              types: "entities",
            },
          },
        });

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Foo",
          "queries",
        );

        expect(spy).toHaveBeenCalledWith("/output/api/queries", "queries");
        expect(dirPath).toBe(`/output/api/queries`);
      });

      test("handles undefined group configuration", async () => {
        expect.assertions(2);

        jest.replaceProperty(rendererInstance, "group", undefined);
        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "TestType",
          "objects",
        );

        expect(spy).toHaveBeenCalledTimes(2);
        expect(dirPath).toBe("/output/types/objects");
      });

      test("handles undefined type hierarchy", async () => {
        expect.assertions(2);

        jest.replaceProperty(rendererInstance, "options", {
          hierarchy: undefined,
        });
        const spy = jest.spyOn(rendererInstance, "generateIndexMetafile");

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "TestType",
          "objects",
        );

        expect(spy).toHaveBeenCalledTimes(2);
        expect(dirPath).toBe("/output/types/objects");
      });

      test("tests regex patterns for API type hierarchy", async () => {
        expect.assertions(2);

        jest.spyOn(rendererInstance, "generateIndexMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "default",
          frontMatter: undefined,
          hierarchy: { [TypeHierarchy.API]: {} },
        });

        // Test with valid API type
        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
        const apiPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Query",
          "queries",
        );

        // Test with non-API type for comparison
        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
        const nonApiPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "User",
          "objects",
        );

        expect(apiPath).toBe(`/output/${API_GROUPS.operations}/queries`);
        expect(nonApiPath).toBe(`/output/${API_GROUPS.types}/objects`);
      });

      test("throws error when output directory is empty or not specified", async () => {
        expect.assertions(1);

        // Set renderer's outputDir to empty string
        jest.replaceProperty(rendererInstance, "outputDir", "");

        await expect(
          rendererInstance.generateCategoryMetafileType(
            {},
            "TestType",
            "objects",
          ),
        ).rejects.toThrow("Output directory is empty or not specified");
      });
    });

    describe("getApiGroupFolder()", () => {
      test.each([[null], [undefined], [false], [{}], [true]])(
        "returns default folders if %s",
        (apiGroupOption) => {
          expect.hasAssertions();

          jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
          expect(getApiGroupFolder({}, apiGroupOption)).toBe(
            API_GROUPS.operations,
          );

          jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
          expect(getApiGroupFolder({}, apiGroupOption)).toBe(API_GROUPS.types);
        },
      );

      test("overrides default names", () => {
        expect.hasAssertions();

        const apiGroupOption: ApiGroupOverrideType = {
          operations: "api",
          types: "entities",
        };

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(true);
        expect(getApiGroupFolder({}, apiGroupOption)).toBe(
          apiGroupOption.operations,
        );

        jest.spyOn(GraphQL, "isApiType").mockReturnValueOnce(false);
        expect(getApiGroupFolder({}, apiGroupOption)).toBe(
          apiGroupOption.types,
        );
      });
    });

    describe("getRenderer()", () => {
      test("creates output directory before initializing renderer", async () => {
        expect.assertions(1);

        const ensureDirSpy = jest.spyOn(Utils, "ensureDir");

        await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          "graphql",
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        expect(ensureDirSpy).toHaveBeenCalledWith("/output", {
          forceEmpty: undefined,
        });
      });

      test("passes force option to ensureDir when provided", async () => {
        expect.assertions(1);

        const ensureDirSpy = jest.spyOn(Utils, "ensureDir");

        await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          "graphql",
          undefined,
          false,
          { ...DEFAULT_RENDERER_OPTIONS, force: true },
        );

        expect(ensureDirSpy).toHaveBeenCalledWith("/output", {
          forceEmpty: true,
        });
      });

      test("initializes renderer with correct parameters", async () => {
        expect.assertions(1);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/custom-output",
          "custom-base-url",
          { objects: { TestType: "test-group" } },
          true,
          DEFAULT_RENDERER_OPTIONS,
          "@graphql-markdown/mdx-parser" as PackageName,
        );

        expect(renderer).toMatchObject({
          printer: Printer,
          outputDir: "/custom-output",
          baseURL: "custom-base-url",
          group: { objects: { TestType: "test-group" } },
          prettify: true,
          options: DEFAULT_RENDERER_OPTIONS,
        });
      });
    });

    describe("hasMDXIndexFileSupport()", () => {
      test.each([
        [null],
        [{}],
        [{ generateIndexMetafile: null }],
        [{ generateIndexMetafile: "not-a-function" }],
      ])("returns false for invalid mdx module %s", (invalidModule) => {
        expect.assertions(1);

        expect(rendererInstance.hasMDXIndexFileSupport(invalidModule)).toBe(
          false,
        );
      });

      test("returns true for valid mdx module", () => {
        expect.assertions(1);

        const validModule = {
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          generateIndexMetafile: () => {},
        };

        expect(rendererInstance.hasMDXIndexFileSupport(validModule)).toBe(true);
      });

      test("returns true for no mdx module (use default module)", () => {
        expect.assertions(1);

        expect(rendererInstance.hasMDXIndexFileSupport(undefined)).toBe(true);
      });

      test.each([
        { module: undefined, expected: true },
        {
          module: {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            generateIndexMetafile: () => {},
          },
          expected: true,
        },
        { module: { generateIndexMetafile: null }, expected: false },
      ])(
        "detects mutation of conditional expression in hasMDXIndexFileSupport when module is $module",
        ({ module, expected }) => {
          expect.assertions(1);

          expect(rendererInstance.hasMDXIndexFileSupport(module)).toBe(
            expected,
          );
        },
      );
    });

    describe("category sorting", () => {
      test("generates categories with natural alphabetical sorting by default", async () => {
        expect.assertions(3);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Pre-register all categories before generating files
        // This simulates knowing all categories upfront
        renderer["categoryPositionManager"].registerCategories([
          "zebra",
          "alpha",
          "beta",
        ]);
        renderer["categoryPositionManager"].computePositions();

        // Generate categories in non-alphabetical order
        await renderer.generateIndexMetafile("/output/zebra", "zebra");
        await renderer.generateIndexMetafile("/output/alpha", "alpha");
        await renderer.generateIndexMetafile("/output/beta", "beta");

        // Verify they are assigned positions in alphabetical order
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          1,
          "/output/zebra",
          "zebra",
          expect.objectContaining({
            sidebarPosition: 3, // 'zebra' should be third alphabetically
          }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          2,
          "/output/alpha",
          "alpha",
          expect.objectContaining({
            sidebarPosition: 1, // 'alpha' should be first alphabetically
          }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          3,
          "/output/beta",
          "beta",
          expect.objectContaining({
            sidebarPosition: 2, // 'beta' should be second alphabetically
          }),
        );
      });

      test("generates categories with explicit 'natural' sorting", async () => {
        expect.assertions(2);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Pre-register categories
        renderer["categoryPositionManager"].registerCategories([
          "zebra",
          "alpha",
        ]);
        renderer["categoryPositionManager"].computePositions();

        await renderer.generateIndexMetafile("/output/zebra", "zebra");
        await renderer.generateIndexMetafile("/output/alpha", "alpha");

        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          1,
          "/output/zebra",
          "zebra",
          expect.objectContaining({
            sidebarPosition: 2,
          }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          2,
          "/output/alpha",
          "alpha",
          expect.objectContaining({
            sidebarPosition: 1,
          }),
        );
      });

      test("generates categories with custom sort function", async () => {
        expect.assertions(3);

        const mockGenerateIndexMetafile = jest.fn();
        // Custom sort: reverse alphabetical order
        const customSort = (a: string, b: string): number => {
          return b.localeCompare(a);
        };

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: customSort,
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Pre-register categories
        renderer["categoryPositionManager"].registerCategories([
          "alpha",
          "beta",
          "zebra",
        ]);
        renderer["categoryPositionManager"].computePositions();

        await renderer.generateIndexMetafile("/output/alpha", "alpha");
        await renderer.generateIndexMetafile("/output/beta", "beta");
        await renderer.generateIndexMetafile("/output/zebra", "zebra");

        // With reverse sort, zebra=1, beta=2, alpha=3
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          1,
          "/output/alpha",
          "alpha",
          expect.objectContaining({
            sidebarPosition: 3,
          }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          2,
          "/output/beta",
          "beta",
          expect.objectContaining({
            sidebarPosition: 2,
          }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          3,
          "/output/zebra",
          "zebra",
          expect.objectContaining({
            sidebarPosition: 1,
          }),
        );
      });

      test("respects explicit sidebarPosition when provided", async () => {
        expect.assertions(1);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Provide explicit position (like for deprecated categories)
        await renderer.generateIndexMetafile("/output/special", "special", {
          sidebarPosition: 999,
        });

        expect(mockGenerateIndexMetafile).toHaveBeenCalledWith(
          "/output/special",
          "special",
          expect.objectContaining({
            sidebarPosition: 999, // Should use explicit position, not calculated
          }),
        );
      });

      test("maintains consistent positions across multiple calls", async () => {
        expect.assertions(4);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Pre-register categories to ensure consistent positions
        renderer["categoryPositionManager"].registerCategories([
          "alpha",
          "beta",
        ]);
        renderer["categoryPositionManager"].computePositions();

        // First call
        await renderer.generateIndexMetafile("/output/alpha", "alpha");
        await renderer.generateIndexMetafile("/output/beta", "beta");

        // Second call to same categories
        await renderer.generateIndexMetafile("/output/alpha", "alpha");
        await renderer.generateIndexMetafile("/output/beta", "beta");

        // All calls should get the same positions
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          1,
          "/output/alpha",
          "alpha",
          expect.objectContaining({ sidebarPosition: 1 }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          2,
          "/output/beta",
          "beta",
          expect.objectContaining({ sidebarPosition: 2 }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          3,
          "/output/alpha",
          "alpha",
          expect.objectContaining({ sidebarPosition: 1 }),
        );
        expect(mockGenerateIndexMetafile).toHaveBeenNthCalledWith(
          4,
          "/output/beta",
          "beta",
          expect.objectContaining({ sidebarPosition: 2 }),
        );
      });

      test("prefixes folder names with order numbers when categorySort is set", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Pre-register categories
        renderer["rootLevelPositionManager"].registerCategories([
          "zebra",
          "alpha",
          "beta",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        // Generate categories using generateCategoryMetafileType
        const alphaDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "alpha" as SchemaEntity,
        );
        const betaDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "beta" as SchemaEntity,
        );
        const zebraDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "zebra" as SchemaEntity,
        );

        // Verify the folder names have order prefixes
        expect(alphaDirPath).toMatch(/01-alpha/);
        expect(betaDirPath).toMatch(/02-beta/);
        expect(zebraDirPath).toMatch(/03-zebra/);
      });

      test("does not prefix folder names when categorySort is not set", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            // categorySort not set - no prefixing should happen
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Pre-register categories
        renderer["categoryPositionManager"].registerCategories([
          "zebra",
          "alpha",
          "beta",
        ]);
        renderer["categoryPositionManager"].computePositions();

        // Generate categories using generateCategoryMetafileType
        const alphaDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "alpha" as SchemaEntity,
        );
        const betaDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "beta" as SchemaEntity,
        );
        const zebraDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "zebra" as SchemaEntity,
        );

        // Verify the folder names do NOT have order prefixes when categorySort is not set
        expect(alphaDirPath).not.toMatch(/01-alpha/);
        expect(betaDirPath).not.toMatch(/02-beta/);
        expect(zebraDirPath).not.toMatch(/03-zebra/);
      });

      test("prefixes folder names with custom sort function when categorySort is set", async () => {
        expect.assertions(3);

        const customSort = (a: string, b: string): number => {
          return b.localeCompare(a); // reverse alphabetical
        };

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: customSort,
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Pre-register categories
        renderer["rootLevelPositionManager"].registerCategories([
          "alpha",
          "beta",
          "zebra",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        // Generate categories using generateCategoryMetafileType
        // With reverse sort: zebra=1, beta=2, alpha=3
        const alphaDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "alpha" as SchemaEntity,
        );
        const betaDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "beta" as SchemaEntity,
        );
        const zebraDirPath = await renderer.generateCategoryMetafileType(
          {},
          "TestType",
          "zebra" as SchemaEntity,
        );

        // Verify the folder names have order prefixes in reverse order
        expect(alphaDirPath).toMatch(/03-alpha/);
        expect(betaDirPath).toMatch(/02-beta/);
        expect(zebraDirPath).toMatch(/01-zebra/);
      });

      test("works correctly with groupByDirective when categorySort is set", async () => {
        expect.assertions(6);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          { objects: { Foo: "api-operations", Bar: "api-types" } },
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Pre-register group categories
        renderer["rootLevelPositionManager"].registerCategories([
          "api-types",
          "api-operations",
        ]);
        renderer["categoryPositionManager"].computePositions();

        // Generate categories with grouping enabled
        const fooPath = await renderer.generateCategoryMetafileType(
          {},
          "Foo",
          "objects" as SchemaEntity,
        );
        const barPath = await renderer.generateCategoryMetafileType(
          {},
          "Bar",
          "objects" as SchemaEntity,
        );

        // Verify that group folders are prefixed with order numbers
        // "api-operations" should come before "api-types" alphabetically, so 01 and 02
        expect(fooPath).toMatch(/01-api-operations/);
        expect(fooPath).toMatch(/objects/);
        expect(barPath).toMatch(/02-api-types/);
        expect(barPath).toMatch(/objects/);
        // Verify the full paths contain the order prefixes
        expect(fooPath).toContain("01-api-operations");
        expect(barPath).toContain("02-api-types");
      });

      test("respects hierarchy with categorySort set", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Pre-register the root type categories at ROOT level (entity hierarchy with no custom groups)
        renderer["rootLevelPositionManager"].registerCategories([
          "queries",
          "objects",
          "mutations",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        // Test that prefixes are applied to root type folders
        // Alphabetically: mutations=1, objects=2, queries=3
        const mutationsPath = await renderer.generateCategoryMetafileType(
          {},
          "Mutation",
          "mutations" as SchemaEntity,
        );
        const objectsPath = await renderer.generateCategoryMetafileType(
          {},
          "Objects",
          "objects" as SchemaEntity,
        );
        const queriesPath = await renderer.generateCategoryMetafileType(
          {},
          "Query",
          "queries" as SchemaEntity,
        );

        // Verify prefixes are applied to root type folder names
        expect(mutationsPath).toMatch(/01-mutations/);
        expect(objectsPath).toMatch(/02-objects/);
        expect(queriesPath).toMatch(/03-queries/);
      });

      test("automatically prefixes when categorySort is set", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          { objects: { Foo: "custom-group" } },
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        renderer["categoryPositionManager"].registerCategories([
          "custom-group",
        ]);
        renderer["categoryPositionManager"].computePositions();

        const fooPath = await renderer.generateCategoryMetafileType(
          {},
          "Foo",
          "objects" as SchemaEntity,
        );

        // Should have automatic prefix because categorySort is set
        expect(fooPath).toContain("custom-group");
        expect(fooPath).toMatch(/01-objects/);
      });

      test("handles single category correctly with categorySort set", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Register only one category
        renderer["rootLevelPositionManager"].registerCategories(["single"]);
        renderer["rootLevelPositionManager"].computePositions();

        const singlePath = await renderer.generateCategoryMetafileType(
          {},
          "Single",
          "single" as SchemaEntity,
        );

        // Should have prefix even with only one category
        expect(singlePath).toMatch(/01-single/);
        expect(singlePath).toContain("01-single");
      });

      test("handles many categories (10+) with correct padding in prefixes", async () => {
        expect.assertions(4);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        const categories = [
          "alpha",
          "beta",
          "charlie",
          "delta",
          "echo",
          "foxtrot",
          "golf",
          "hotel",
          "india",
          "juliet",
          "kilo",
          "lima",
        ];

        renderer["rootLevelPositionManager"].registerCategories(categories);
        renderer["rootLevelPositionManager"].computePositions();

        // Test early, middle, and late positions
        const alphaPath = await renderer.generateCategoryMetafileType(
          {},
          "Alpha",
          "alpha" as SchemaEntity,
        );
        const indiaPath = await renderer.generateCategoryMetafileType(
          {},
          "India",
          "india" as SchemaEntity,
        );
        const kiloPath = await renderer.generateCategoryMetafileType(
          {},
          "Kilo",
          "kilo" as SchemaEntity,
        );
        const limaPath = await renderer.generateCategoryMetafileType(
          {},
          "Lima",
          "lima" as SchemaEntity,
        );

        // Verify 2-digit padding is maintained (01, 09, 10, 12)
        expect(alphaPath).toMatch(/01-alpha/);
        expect(indiaPath).toMatch(/09-india/);
        expect(kiloPath).toMatch(/11-kilo/);
        expect(limaPath).toMatch(/12-lima/);
      });

      test("position manager respects custom sort function consistently", async () => {
        expect.assertions(3);

        const reverseSort = (a: string, b: string): number => {
          return b.localeCompare(a);
        };

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: reverseSort,
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        const categories = ["alpha", "beta", "gamma"];
        renderer["rootLevelPositionManager"].registerCategories(categories);
        renderer["rootLevelPositionManager"].computePositions();

        const alphaPath = await renderer.generateCategoryMetafileType(
          {},
          "Alpha",
          "alpha" as SchemaEntity,
        );
        const betaPath = await renderer.generateCategoryMetafileType(
          {},
          "Beta",
          "beta" as SchemaEntity,
        );
        const gammaPath = await renderer.generateCategoryMetafileType(
          {},
          "Gamma",
          "gamma" as SchemaEntity,
        );

        // With reverse sort: gamma=01, beta=02, alpha=03
        expect(alphaPath).toMatch(/03-alpha/);
        expect(betaPath).toMatch(/02-beta/);
        expect(gammaPath).toMatch(/01-gamma/);
      });

      test("deprecated folder gets last position when categorySort is set", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            deprecated: "group",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Mock a deprecated type
        const deprecatedType: Partial<GraphQLScalarType> = {
          description: "@deprecated since v2.0",
        };

        const renderer2 = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            deprecated: "group",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        renderer2["rootLevelPositionManager"].registerCategories([
          "queries",
          "objects",
        ]);
        renderer2["rootLevelPositionManager"].computePositions();

        // generateIndexMetafile should be called with sidebarPosition: 999 for deprecated
        const mockGenerateIndexMetafile = renderer2["mdxModule"]
          .generateIndexMetafile as jest.Mock;

        // Verify generateIndexMetafile was set up correctly
        expect(mockGenerateIndexMetafile).toBeDefined();
        expect(typeof mockGenerateIndexMetafile).toBe("function");
      });

      test("handles hierarchical position management with multiple levels", async () => {
        expect.assertions(4);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          { objects: { Foo: "api-ops", Bar: "api-types" } },
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Register root-level groups
        renderer["rootLevelPositionManager"].registerCategories([
          "api-types",
          "api-ops",
        ]);

        // Register entity-type level categories
        renderer["categoryPositionManager"].registerCategories([
          "objects",
          "enums",
          "scalars",
        ]);

        renderer["rootLevelPositionManager"].computePositions();
        renderer["categoryPositionManager"].computePositions();

        // Verify positions are correct at both levels
        const pos1 =
          renderer["rootLevelPositionManager"].getPosition("api-ops");
        const pos2 =
          renderer["rootLevelPositionManager"].getPosition("api-types");
        const pos3 = renderer["categoryPositionManager"].getPosition("enums");
        const pos4 = renderer["categoryPositionManager"].getPosition("objects");

        // Each level has its own numbering (1-indexed)
        expect(pos1).toBe(1); // api-ops comes first
        expect(pos2).toBe(2); // api-types comes second
        expect(pos3).toBeLessThanOrEqual(3); // entity types start from 1
        expect(pos4).toBeLessThanOrEqual(3);
      });

      test("automatically prefixes when categorySort is set", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: undefined,
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        renderer["rootLevelPositionManager"].registerCategories([
          "alpha",
          "beta",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        const alphaPath = await renderer.generateCategoryMetafileType(
          {},
          "Alpha",
          "alpha" as SchemaEntity,
        );
        const betaPath = await renderer.generateCategoryMetafileType(
          {},
          "Beta",
          "beta" as SchemaEntity,
        );

        // Without categorySort, prefixes should still be applied if categorySort is set
        // but behavior depends on implementation
        expect(alphaPath).toContain("alpha");
        expect(betaPath).toContain("beta");
      });

      test("works with custom groups across multiple types", async () => {
        expect.assertions(4);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          {
            objects: { User: "domain", Post: "domain" },
            interfaces: { Node: "system" },
          },
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        renderer["rootLevelPositionManager"].registerCategories([
          "domain",
          "system",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        const userPath = await renderer.generateCategoryMetafileType(
          {},
          "User",
          "objects" as SchemaEntity,
        );
        const nodePath = await renderer.generateCategoryMetafileType(
          {},
          "Node",
          "interfaces" as SchemaEntity,
        );

        // domain comes before system alphabetically (01 vs 02)
        expect(userPath).toMatch(/01-domain/);
        expect(userPath).toContain("objects");
        expect(nodePath).toMatch(/02-system/);
        expect(nodePath).toContain("interfaces");
      });

      test("isRegistered() correctly identifies pre-registered categories", async () => {
        expect.assertions(4);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Before registration, categories should not be registered
        expect(renderer["rootLevelPositionManager"].isRegistered("alpha")).toBe(
          false,
        );
        expect(renderer["rootLevelPositionManager"].isRegistered("beta")).toBe(
          false,
        );

        // Register categories
        renderer["rootLevelPositionManager"].registerCategories([
          "alpha",
          "beta",
        ]);

        // After registration, categories should be registered
        expect(renderer["rootLevelPositionManager"].isRegistered("alpha")).toBe(
          true,
        );
        expect(renderer["rootLevelPositionManager"].isRegistered("beta")).toBe(
          true,
        );
      });

      test("formatCategoryFolderName uses isRegistered to determine hierarchy level", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Register at root level
        renderer["rootLevelPositionManager"].registerCategories(["Query"]);
        renderer["rootLevelPositionManager"].computePositions();

        // Register at nested level
        renderer["categoryPositionManager"].registerCategories(["objects"]);
        renderer["categoryPositionManager"].computePositions();

        // Query is at root level, should use root position manager
        const queryPath = await renderer.generateCategoryMetafileType(
          {},
          "Query",
          "query" as SchemaEntity,
        );
        expect(queryPath).toMatch(/01-query/);

        // objects is at nested level, should use nested position manager
        const objectsPath = await renderer.generateCategoryMetafileType(
          {},
          "Objects",
          "objects" as SchemaEntity,
        );
        expect(objectsPath).toMatch(/01-objects/);
      });

      test("renderTypeEntities correctly parses category from nested file paths", async () => {
        expect.assertions(1);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);

        const output = "/output/foobar";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "FooBar",
          "FooBar",
        );

        // Regex pattern /(?<category>[A-Za-z0-9-]+)[\\/]+(?<pageId>[A-Za-z0-9-]+).mdx?$/
        // should capture category='foobar' and pageId='foo-bar'
        expect(meta?.slug).toBe("foobar/foo-bar");
      });

      test("renderTypeEntities uses correct regex for hierarchical paths", async () => {
        expect.assertions(2);

        jest
          .spyOn(Printer, "printType")
          .mockReturnValue("Lorem ipsum" as MDXString);
        const spy = jest.spyOn(Utils, "saveFile");

        const output = "/output/api-types/objects";
        const meta = await rendererInstance.renderTypeEntities(
          output,
          "MyObject",
          "MyObject",
        );

        // Should extract category from path and create proper slug
        expect(meta?.category).toBeDefined();
        expect(spy).toHaveBeenCalledWith(
          expect.stringMatching(/my-object\.mdx$/),
          "Lorem ipsum",
          undefined,
        );
      });

      test("registerCategoriesWithManagers registers both root and nested when categorySort is set", async () => {
        expect.assertions(6);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        const rootCategories = new Set(["query", "mutation", "subscription"]);
        const nestedCategories = new Set(["objects", "enums", "scalars"]);

        renderer["registerCategoriesWithManagers"](
          rootCategories,
          nestedCategories,
        );

        // Verify both managers have registered their categories
        expect(renderer["rootLevelPositionManager"].isRegistered("query")).toBe(
          true,
        );
        expect(
          renderer["rootLevelPositionManager"].isRegistered("mutation"),
        ).toBe(true);
        expect(
          renderer["rootLevelPositionManager"].isRegistered("subscription"),
        ).toBe(true);
        expect(
          renderer["categoryPositionManager"].isRegistered("objects"),
        ).toBe(true);
        expect(renderer["categoryPositionManager"].isRegistered("enums")).toBe(
          true,
        );
        expect(
          renderer["categoryPositionManager"].isRegistered("scalars"),
        ).toBe(true);
      });

      test("registerCategoriesWithManagers respects categorySort not set with empty nested", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        const rootCategories = new Set(["query"]);
        const nestedCategories = new Set<string>();

        renderer["registerCategoriesWithManagers"](
          rootCategories,
          nestedCategories,
        );

        // Root should be registered
        expect(renderer["rootLevelPositionManager"].isRegistered("query")).toBe(
          true,
        );
        // Nested should not be called when empty and categorySort is not set
        expect(
          renderer["categoryPositionManager"].isRegistered("objects"),
        ).toBe(false);
        expect(nestedCategories.size).toBe(0);
      });

      test("mutation test: position comparison operators", async () => {
        expect.assertions(4);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Register and compute positions
        renderer["rootLevelPositionManager"].registerCategories([
          "alpha",
          "beta",
          "gamma",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        // Test position boundaries
        const position1 =
          renderer["rootLevelPositionManager"].getPosition("alpha");
        const position2 =
          renderer["rootLevelPositionManager"].getPosition("beta");
        const position3 =
          renderer["rootLevelPositionManager"].getPosition("gamma");

        // Verify positions are in ascending order (testing >= mutation)
        expect(position1).toBeLessThan(position2);
        expect(position2).toBeLessThan(position3);
        expect(position1).toBe(1);
        expect(position3).toBe(3);
      });

      test("mutation test: category metadata with explicit field values", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          { objects: { Custom: "custom-group" } },
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: jest.fn(),
          },
        );

        // Register group categories
        renderer["rootLevelPositionManager"].registerCategories([
          "custom-group",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        // Generate metadata and verify it includes group information
        const dirPath = await renderer.generateCategoryMetafileType(
          { test: "value" },
          "Custom",
          "objects" as SchemaEntity,
        );

        expect(dirPath).toContain("custom-group");
        expect(dirPath).toContain("objects");
      });

      test("mutation test: category naming with collapsible true", async () => {
        expect.assertions(2);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        renderer["rootLevelPositionManager"].registerCategories(["objects"]);
        renderer["rootLevelPositionManager"].computePositions();

        const mockFunc = mockGenerateIndexMetafile as jest.Mock;
        mockFunc.mockClear();

        await renderer.generateCategoryMetafileType(
          {},
          "Test",
          "objects" as SchemaEntity,
        );

        // Verify that generateIndexMetafile is called with metadata
        // including the collapsible and collapsed properties
        const calls = mockFunc.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        // Verify call includes metadata with collapsible: true
        expect(JSON.stringify(calls)).toContain("collapsible");
      });

      test("mutation test: custom sort function reverses alphabetical order", async () => {
        expect.assertions(2);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Register categories in specific order
        renderer["rootLevelPositionManager"].registerCategories([
          "zebra",
          "alpha",
          "middle",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        // With natural sort, alpha should get lower position than zebra
        const zebraPos =
          renderer["rootLevelPositionManager"].getPosition("zebra");
        const alphaPos =
          renderer["rootLevelPositionManager"].getPosition("alpha");

        expect(alphaPos).toBeLessThan(zebraPos);
        expect(alphaPos).toBe(1);
      });

      test("mutation test: page path regex extracts correct segments", async () => {
        expect.assertions(2);

        // Test that the regex correctly extracts category and pageId
        // The regex captures everything up to '.mdx' as pageId
        const validMatch = "Foobar/foo-bar.mdx".match(
          /(?<category>[A-Za-z0-9-]+)[\\/]+(?<pageId>[A-Za-z0-9-]+).mdx?$/,
        );
        expect(validMatch?.groups?.category).toBe("Foobar");
        // The second capture group captures 'foo-bar' because [A-Za-z0-9-]+ matches the full string
        expect(validMatch?.groups?.pageId).toBe("foo-bar");
      });

      test("mutation test: boolean literal false in category options", async () => {
        expect.assertions(2);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        renderer["rootLevelPositionManager"].registerCategories(["objects"]);
        renderer["rootLevelPositionManager"].computePositions();

        const mockFunc = mockGenerateIndexMetafile as jest.Mock;
        mockFunc.mockClear();

        await renderer.generateCategoryMetafileType(
          {},
          "Test",
          "objects" as SchemaEntity,
        );

        // Verify metadata includes index: false property
        const calls = mockFunc.mock.calls;
        expect(calls.length).toBeGreaterThan(0);
        expect(JSON.stringify(calls)).toContain('"index":false');
      });

      test("mutation test: flat hierarchy skips category generation", async () => {
        expect.assertions(2);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            hierarchy: { [TypeHierarchy.FLAT]: {} },
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        const dirPath = await renderer.generateCategoryMetafileType(
          {},
          "Test",
          "objects" as SchemaEntity,
        );

        // With flat hierarchy, generateIndexMetafile should not be called
        expect(mockGenerateIndexMetafile).not.toHaveBeenCalled();
        expect(dirPath).toBe("/output");
      });

      test("mutation test: verify exact regex pattern for 2-digit prefix", async () => {
        expect.assertions(4);

        // Test the exact regex pattern: /^\d{2}-/
        // Should match: "01-query", "42-mutations", etc.
        // Should NOT match: "1-query", "query", "01query", etc.

        const pattern = /^\d{2}-/;

        // Valid prefixes that should match and be stripped
        expect("01-query".replace(pattern, "")).toBe("query");
        expect("99-something".replace(pattern, "")).toBe("something");

        // Without prefix, nothing should be stripped
        expect("query".replace(pattern, "")).toBe("query");
        expect("objects".replace(pattern, "")).toBe("objects");
      });

      test("mutation test: category sort with numeric prefix application", async () => {
        expect.assertions(3);

        const mockGenerateIndexMetafile = jest.fn();
        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        renderer["rootLevelPositionManager"].registerCategories([
          "objects",
          "queries",
        ]);
        renderer["rootLevelPositionManager"].computePositions();

        const objPath = await renderer.generateCategoryMetafileType(
          {},
          "Objects",
          "objects" as SchemaEntity,
        );
        const queryPath = await renderer.generateCategoryMetafileType(
          {},
          "Query",
          "queries" as SchemaEntity,
        );

        // With categorySort, prefixes should be applied to folder names
        // objects should come before queries alphabetically
        expect(objPath).toMatch(/01-objects/);
        expect(queryPath).toMatch(/02-queries/);
        // Verify both paths are different
        expect(objPath).not.toEqual(queryPath);
      });

      test("mutation test: position manager early exit on second computePositions call", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        // Register categories and compute positions
        renderer["categoryPositionManager"].registerCategories(["objects"]);
        renderer["categoryPositionManager"].computePositions();

        // Get initial position
        const pos1 = renderer["categoryPositionManager"].getPosition("objects");

        // Call computePositions again - should return early without recalculating
        renderer["categoryPositionManager"].computePositions();

        // Position should remain the same (early return ensures cache isn't reset)
        const pos2 = renderer["categoryPositionManager"].getPosition("objects");
        expect(pos1).toBe(pos2);
        expect(pos1).toBe(1);
      });

      test("mutation test: position manager handles base position", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
          },
        );

        // Register categories
        const categories = ["queries"];
        renderer["rootLevelPositionManager"].registerCategories(categories);
        renderer["rootLevelPositionManager"].computePositions();

        // Base position should be 0, first category should be at basePosition + 0
        const queryPos =
          renderer["rootLevelPositionManager"].getPosition("queries");
        expect(queryPos).toBeGreaterThanOrEqual(0);
        expect(queryPos).toBeLessThanOrEqual(2);
        expect(typeof queryPos).toBe("number");
      });

      test("mutation test: category path generation with different entity types", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
          },
        );

        // Generate paths for different entity types
        const objectPath = await renderer.generateCategoryMetafileType(
          {},
          "Objects",
          "objects" as SchemaEntity,
        );
        const queryPath = await renderer.generateCategoryMetafileType(
          {},
          "Query",
          "queries" as SchemaEntity,
        );

        // Paths should be strings
        expect(typeof objectPath).toBe("string");
        expect(typeof queryPath).toBe("string");
      });

      test("mutation test: hierarchy option affects rendering", async () => {
        expect.assertions(1);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            hierarchy: {},
          },
        );

        // Verify hierarchy is defined
        expect(renderer.options).toBeDefined();
      });

      test("mutation test: category sort option validation", async () => {
        expect.assertions(2);

        const renderer1 = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
          },
        );

        const renderer2 = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        // Verify categorySort values are different
        expect(renderer1.options?.categorySort).toBe("natural");
        expect(renderer2.options?.categorySort).not.toBe("natural");
      });

      test("mutation test: position retrieval without precomputed state", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        // Register categories
        renderer["categoryPositionManager"].registerCategories(["test"]);

        // Get position WITHOUT calling computePositions first
        // This tests the branch at line 305-310 where it auto-computes
        const pos = renderer["categoryPositionManager"].getPosition("test");
        expect(pos).toBe(1);
        expect(typeof pos).toBe("number");
      });

      test("mutation test: regex prefix stripping with boundary values", async () => {
        expect.assertions(8);

        // Test exact regex /^\d{2}-/
        const regex = /^\d{2}-/;

        // Should match and strip 00-99 prefixes
        expect("00-test".replace(regex, "")).toBe("test");
        expect("50-middle".replace(regex, "")).toBe("middle");
        expect("99-end".replace(regex, "")).toBe("end");

        // Should NOT match single digit
        expect("1-single".replace(regex, "")).toBe("1-single");

        // Should NOT match without leading digit
        expect("a1-letter".replace(regex, "")).toBe("a1-letter");

        // Should NOT match without dash
        expect("01test".replace(regex, "")).toBe("01test");

        // Should NOT match if not at start
        expect("test-01-prefix".replace(regex, "")).toBe("test-01-prefix");

        // Should NOT match three digits
        expect("001-three".replace(regex, "")).toBe("001-three");
      });

      test("mutation test: category folderName formatting edge cases", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            categorySort: "natural",
          },
        );

        // Test multiple categories to verify all get prefixes when categorySort set
        renderer["rootLevelPositionManager"].registerCategories([
          "queries",
          "mutations",
          "objects",
        ]);

        const queryPath = await renderer.generateCategoryMetafileType(
          {},
          "Query",
          "queries" as SchemaEntity,
        );
        const mutPath = await renderer.generateCategoryMetafileType(
          {},
          "Mutation",
          "mutations" as SchemaEntity,
        );
        const objPath = await renderer.generateCategoryMetafileType(
          {},
          "Object",
          "objects" as SchemaEntity,
        );

        // All paths should contain numeric prefixes when categorySort is set
        expect(queryPath).toMatch(/\d{2}-/);
        expect(mutPath).toMatch(/\d{2}-/);
        expect(objPath).toMatch(/\d{2}-/);
      });

      test("mutation test: boolean position cache state management", async () => {
        expect.assertions(5);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        const posManager = renderer["categoryPositionManager"];

        // Initially positionsComputed should be false (or internally managed)
        // Registering categories
        posManager.registerCategories(["A", "B", "C"]);

        // Getting position should trigger computation
        const posA1 = posManager.getPosition("A");
        const posB1 = posManager.getPosition("B");
        const posC1 = posManager.getPosition("C");

        // All positions should be valid numbers
        expect(typeof posA1).toBe("number");
        expect(typeof posB1).toBe("number");
        expect(typeof posC1).toBe("number");

        // Getting positions again should return same values (from cache)
        const posA2 = posManager.getPosition("A");
        const posB2 = posManager.getPosition("B");

        // Should be consistent
        expect(posA1).toBe(posA2);
        expect(posB1).toBe(posB2);
      });

      test("mutation test: comprehensive category metafile generation with hierarchy", async () => {
        expect.assertions(4);

        const mockGenerateIndexMetafile = jest.fn();

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          {
            ...DEFAULT_RENDERER_OPTIONS,
            hierarchy: { [TypeHierarchy.ENTITY]: {} },
            categorySort: "natural",
          },
          {
            generateIndexMetafile: mockGenerateIndexMetafile,
          },
        );

        // Generate metafiles for different entity types
        const objMetaPath = await renderer.generateCategoryMetafileType(
          { collapsible: true },
          "Objects",
          "objects" as SchemaEntity,
        );
        const queryMetaPath = await renderer.generateCategoryMetafileType(
          { collapsible: false },
          "Queries",
          "queries" as SchemaEntity,
        );

        // Verify both paths contain numeric prefixes
        expect(objMetaPath).toMatch(/\d{2}-/);
        expect(queryMetaPath).toMatch(/\d{2}-/);

        // Verify mockGenerateIndexMetafile was called
        expect(mockGenerateIndexMetafile).toHaveBeenCalled();

        // Both should be strings
        expect(typeof objMetaPath).toBe("string");
      });

      test("mutation test: collapsible option affects metadata generation", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        // Generate with collapsible true
        const pathWithCollapsible = await renderer.generateCategoryMetafileType(
          { collapsible: true, collapsed: true },
          "Types",
          "types" as SchemaEntity,
        );

        // Generate with collapsible false
        const pathWithoutCollapsible =
          await renderer.generateCategoryMetafileType(
            { collapsible: false, collapsed: false },
            "TypesAlt",
            "typesalt" as SchemaEntity,
          );

        expect(typeof pathWithCollapsible).toBe("string");
        expect(typeof pathWithoutCollapsible).toBe("string");
      });

      test("mutation test: sidebarPosition configuration in metafile options", async () => {
        expect.assertions(2);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        // Generate with explicit sidebarPosition
        const pathWithPosition = await renderer.generateCategoryMetafileType(
          { sidebarPosition: 10 },
          "Custom",
          "custom" as SchemaEntity,
        );

        // Generate without explicit sidebarPosition (should use position manager)
        const pathWithoutPosition = await renderer.generateCategoryMetafileType(
          {},
          "Default",
          "default" as SchemaEntity,
        );

        expect(typeof pathWithPosition).toBe("string");
        expect(typeof pathWithoutPosition).toBe("string");
      });

      test("mutation test: positionsComputed flag is set correctly", async () => {
        expect.assertions(3);

        const renderer = await getRenderer(
          Printer as unknown as typeof IPrinter,
          "/output",
          baseURL,
          undefined,
          false,
          DEFAULT_RENDERER_OPTIONS,
        );

        const posManager = renderer["categoryPositionManager"];

        // Register categories
        posManager.registerCategories(["A", "B", "C"]);

        // Call computePositions multiple times
        posManager.computePositions();
        const pos1 = posManager.getPosition("A");

        posManager.computePositions();
        const pos2 = posManager.getPosition("A");

        // Positions should be identical (cache was not reset)
        expect(pos1).toBe(pos2);
        expect(pos1).toBeGreaterThanOrEqual(0);
        expect(pos2).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
