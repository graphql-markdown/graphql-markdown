import { GraphQLScalarType } from "graphql/type";
import { Kind } from "graphql/language";

import type {
  ApiGroupOverrideType,
  IPrinter,
  MDXString,
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
  };
});
import * as Utils from "@graphql-markdown/utils";

jest.mock("@graphql-markdown/graphql", (): unknown => {
  return {
    __esModule: true,
    ...jest.requireActual("@graphql-markdown/graphql"),
    isDeprecated: jest.fn(),
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
          `${output}/foo-bar.md`,
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
          `${output}/foo-bar.md`,
          "Lorem ipsum",
          undefined,
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

        const spy = jest
          .spyOn(global.console, "warn")
          .mockImplementationOnce(() => {});

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
          `An error occurred while processing file test/foo-bar.md for type "TestType"`,
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
          "/output/types/objects/foo.md",
          "content",
          undefined,
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "/output/types/objects/bar.md",
          "content",
          undefined,
        );
      });
    });

    describe("generateCategoryMetafile()", () => {
      test("generate _category_.yml file", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";
        const filePath = path.join(outputPath, "_category_.yml");

        jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        expect(spy).toHaveBeenCalledWith(
          filePath,
          `label: Foobar\nposition: 1\nlink: null\ncollapsible: true\ncollapsed: true\n`,
        );
      });

      test("generate _category_.yml file with options override", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";
        const filePath = path.join(outputPath, "_category_.yml");

        jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(
          category,
          outputPath,
          undefined,
          undefined,
          { collapsed: false, collapsible: false },
        );

        expect(spy).toHaveBeenCalledWith(
          filePath,
          `label: Foobar\nposition: 1\nlink: null\ncollapsible: false\ncollapsed: false\n`,
        );
      });

      test("generate _category_.yml file with generated index", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";
        const filePath = path.join(outputPath, "_category_.yml");

        rendererInstance.options = {
          ...DEFAULT_RENDERER_OPTIONS,
          index: true,
        };

        jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        expect(spy).toHaveBeenCalledWith(
          filePath,
          `label: Foobar\nposition: 1\nlink: \n  type: generated-index\n  title: 'Foobar overview'\ncollapsible: true\ncollapsed: true\n`,
        );
      });

      test("do not generate _category_.yml file if it exists", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";
        const filePath = path.join(outputPath, "_category_.yml");

        jest.spyOn(Utils, "fileExists").mockResolvedValue(true);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        expect(spy).not.toHaveBeenCalledWith(
          filePath,
          `label: Foobar\nposition: 1\nlink: \n  type: generated-index\n  title: 'Foobar overview'\ncollapsible: true\ncollapsed: true\n`,
        );
      });

      test("generate _category_.yml file with sidebar position", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";
        const filePath = path.join(outputPath, "_category_.yml");

        jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(
          category,
          outputPath,
          42,
        );

        expect(spy).toHaveBeenCalledWith(
          filePath,
          `label: Foobar\nposition: 42\nlink: null\ncollapsible: true\ncollapsed: true\n`,
        );
      });

      test("generate _category_.yml file with classname", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";
        const filePath = path.join(outputPath, "_category_.yml");
        const styleClass = "foo-baz";

        jest.spyOn(Utils, "fileExists").mockResolvedValue(false);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(
          category,
          outputPath,
          42,
          styleClass,
        );

        expect(spy).toHaveBeenCalledWith(
          filePath,
          `label: Foobar\nposition: 42\nclassName: ${styleClass}\nlink: null\ncollapsible: true\ncollapsed: true\n`,
        );
      });
    });

    describe("generateCategoryMetafileType()", () => {
      test("generate type _category_.yml file", async () => {
        expect.assertions(3);

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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
        expect(spy).toHaveBeenCalledWith("objects", "/output/objects");
        expect(dirPath).toBe("/output/objects");
      });

      test("generate group _category_.yml file", async () => {
        expect.assertions(3);

        const [type, name, root, group] = [{}, "Foo", "objects", "lorem"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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

        expect(spy).toHaveBeenCalledWith("lorem", "/output/lorem");
        expect(spy).toHaveBeenCalledWith("objects", "/output/lorem/objects");
        expect(dirPath).toBe(`/output/${group}/${root.toLowerCase()}`);
      });

      test("generate deprecated _category_.yml file if type is deprecated", async () => {
        expect.assertions(3);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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

        expect(spy).toHaveBeenCalledWith(
          "deprecated",
          "/output/deprecated",
          999,
          "deprecated",
        );
        expect(spy).toHaveBeenCalledWith("Baz", "/output/deprecated/baz");
        expect(dirPath).toBe(`/output/deprecated/${root.toLowerCase()}`);
      });

      test("generate no deprecated _category_.yml file if type is not deprecated", async () => {
        expect.assertions(2);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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

        expect(spy).toHaveBeenCalledWith("Baz", "/output/baz");
        expect(dirPath).toBe(`/output/${root.toLowerCase()}`);
      });

      test("generate no deprecated _category_.yml file if deprecated is not group", async () => {
        expect.assertions(2);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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

        expect(spy).toHaveBeenCalledWith("Baz", "/output/baz");
        expect(dirPath).toBe(`/output/${root.toLowerCase()}`);
      });

      test("generate deprecated and group _category_.yml files", async () => {
        expect.assertions(2);

        const [type, name, root, group] = [{}, "Foo", "Baz", "lorem"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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
          "queries",
          `/output/${API_GROUPS.operations}/queries`,
        );
        expect(dirPath).toBe(`/output/${API_GROUPS.operations}/queries`);
      });

      test("generate system _category_.yml file", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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
          "objects",
          `/output/${API_GROUPS.types}/objects`,
        );
        expect(dirPath).toBe(`/output/${API_GROUPS.types}/objects`);
      });

      test("does not generate _category_.yml file if hierarchy is flat", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
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
      expect(getApiGroupFolder({}, apiGroupOption)).toBe(apiGroupOption.types);
    });
  });
});
