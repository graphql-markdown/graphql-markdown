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

jest.mock("node:fs/promises");

jest.mock("node:path", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("node:path"),
  };
});
import * as path from "node:path";

jest.mock("@graphql-markdown/printer-legacy");
import { Printer } from "@graphql-markdown/printer-legacy";

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
import { DEFAULT_OPTIONS, TypeHierarchy } from "../../src/config";

const DEFAULT_RENDERER_OPTIONS: RendererDocOptions = {
  ...DEFAULT_OPTIONS.docOptions,
  deprecated: DEFAULT_OPTIONS.printTypeOptions!
    .deprecated! as TypeDeprecatedOption,
  hierarchy: DEFAULT_OPTIONS.printTypeOptions!.hierarchy!,
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
      jest.spyOn(global.console, "warn").mockImplementation(() => {});
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

        const spy = jest.spyOn(global.console, "warn");

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
        const spy = jest.spyOn(global.console, "warn");

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
        );
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
  });
});
