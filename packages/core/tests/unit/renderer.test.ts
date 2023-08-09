jest.mock("node:fs/promises");

import path from "node:path";
jest.mock("node:path", () => jest.requireActual("node:path"));

import { GraphQLScalarType, Kind } from "graphql";

import type {
  IPrinter,
  MDXString,
  SchemaEntity,
  TypeDeprecatedOption,
} from "@graphql-markdown/types";

jest.mock("@graphql-markdown/printer-legacy");
import { Printer } from "@graphql-markdown/printer-legacy";

jest.mock("@graphql-markdown/utils", () => {
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

import { Renderer } from "../../src/renderer";
import { DEFAULT_OPTIONS } from "../../src/config";

const DEFAULT_RENDERER_OPTIONS = {
  ...DEFAULT_OPTIONS.docOptions,
  deprecated: DEFAULT_OPTIONS.printTypeOptions
    .deprecated as TypeDeprecatedOption,
};

describe("renderer", () => {
  describe("class Renderer", () => {
    let rendererInstance: Renderer;
    const baseURL: string = "graphql";

    beforeEach(() => {
      rendererInstance = new Renderer(
        Printer as unknown as typeof IPrinter,
        "/output",
        baseURL,
        undefined,
        DEFAULT_OPTIONS.pretty,
        {
          ...DEFAULT_OPTIONS.docOptions,
          deprecated: DEFAULT_OPTIONS.printTypeOptions
            .deprecated as TypeDeprecatedOption,
        },
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe("renderTypeEntities()", () => {
      test("creates entity page into output folder", async () => {
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
        jest
          .spyOn(Utils.pathUrl, "relative")
          .mockImplementationOnce(() => "not-valid.md");
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
          `An error occurred while processing file test/foo-bar.mdx for type "TestType"`,
        );
      });
    });

    describe("renderSidebar()", () => {
      test("creates Docusaurus compatible sidebar.js into output folder", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(Utils, "saveFile");

        const filePath = await rendererInstance.renderSidebar();

        expect(spy.mock.calls).toMatchSnapshot();
        expect(filePath.endsWith("output/sidebar-schema.js")).toBeTruthy();
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

        jest
          .spyOn(Printer, "printType")
          .mockImplementation(() => "content" as MDXString);
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
              name: { kind: Kind.NAME, value: "foo" },
            },
          }),
        });

        expect(spy).toHaveBeenNthCalledWith(
          1,
          "/output/objects/foo.mdx",
          "content",
          undefined,
        );
        expect(spy).toHaveBeenNthCalledWith(
          2,
          "/output/objects/bar.mdx",
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
          `label: Foobar\nposition: 1\nlink: null\n`,
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
          `label: Foobar\nposition: 1\nlink: \n  type: generated-index\n  title: 'Foobar overview'\n`,
        );
      });

      test("do not generate _category_.yml file if it exists", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";

        jest.spyOn(Utils, "fileExists").mockResolvedValue(true);
        const spy = jest.spyOn(Utils, "saveFile");

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        expect(spy).not.toHaveBeenCalled();
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
          `label: Foobar\nposition: 42\nlink: null\n`,
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
          `label: Foobar\nposition: 42\nclassName: ${styleClass}\nlink: null\n`,
        );
      });
    });

    describe("generateCategoryMetafileType()", () => {
      test("generate type _category_.yml file", async () => {
        expect.assertions(2);

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          {},
          "Foo",
          "objects",
        );

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
        });
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(true);

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
        });
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(false);

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
        });
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(false);

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
        });
        jest.replaceProperty(rendererInstance, "group", {
          [root]: { [name]: group },
        });
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(true);

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
    });
  });
});
