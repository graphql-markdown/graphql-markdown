import { vol } from "memfs";
jest.mock("node:fs");

import { join } from "node:path";
import fs from "node:fs";

import { Kind } from "graphql/language/kinds";

jest.mock("@graphql-markdown/printer-legacy");
import Printer from "@graphql-markdown/printer-legacy";

jest.mock("@graphql-markdown/utils", () => {
  return {
    ...jest.requireActual("@graphql-markdown/utils"),
    hasProperty: jest.fn(),
    isDeprecated: jest.fn(),
    toSlug: (value: string) => value.toLowerCase(),
    startCase: (value: string) => value,
  };
});
import * as Utils from "@graphql-markdown/utils";

import { Renderer } from "../../src/renderer";
import { GraphQLScalarType } from "graphql/type/definition";
import { DEFAULT_OPTIONS, TypeDeprecatedOption } from "../../src/config";

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
      vol.fromJSON({
        "/output": null,
        "/temp": null,
        "/assets/generated.md": "Test Homepage",
      });

      rendererInstance = new Renderer(
        new Printer(),
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
      vol.reset();
      jest.restoreAllMocks();
    });

    describe("renderTypeEntities()", () => {
      test("creates entity page into output folder", async () => {
        expect.assertions(2);

        jest.spyOn(Printer, "printType").mockReturnValue("Lorem ipsum");
        const output = "/output/foobar";

        const meta = await rendererInstance.renderTypeEntities(
          output,
          "FooBar",
          "FooBar",
        );

        expect(meta).toEqual({ category: "foobar", slug: "foobar/foobar" });
        expect(vol.toJSON("/output", undefined, true)).toMatchSnapshot();
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
    });

    describe("renderSidebar()", () => {
      test("creates Docusaurus compatible sidebar.js into output folder", async () => {
        expect.assertions(1);

        await rendererInstance.renderSidebar();

        expect(
          vol.toJSON("/output/sidebar-schema.js", undefined, true),
        ).toMatchSnapshot();
      });
    });

    describe("renderHomepage()", () => {
      test("copies default homepage into output folder", async () => {
        expect.assertions(1);

        await rendererInstance.renderHomepage("/assets/generated.md");

        expect(vol.toJSON("/output", undefined, true)).toMatchSnapshot();
      });
    });

    describe("renderRootTypes()", () => {
      test("render root type", async () => {
        expect.assertions(1);

        jest.spyOn(Printer, "printType").mockImplementation(() => "content");
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

        expect(vol.toJSON("/output", undefined, true)).toMatchSnapshot();
      });
    });

    describe("generateCategoryMetafile()", () => {
      test("generate _category_.yml file", async () => {
        expect.assertions(2);

        const category = "foobar";
        const outputPath = "/output/docs";

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        const content = fs.readFileSync(
          join(outputPath, "_category_.yml"),
          "utf-8",
        );

        expect(vol.toJSON("/output", undefined, true)).toMatchSnapshot();
        expect(content).toMatchInlineSnapshot(`
          "label: foobar
          position: 1
          link: null
          "
        `);
      });

      test("generate _category_.yml file with generated index", async () => {
        expect.assertions(2);

        const category = "foobar";
        const outputPath = "/output/docs";

        rendererInstance.options = { index: true, ...DEFAULT_RENDERER_OPTIONS };

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        const content = fs.readFileSync(
          join(outputPath, "_category_.yml"),
          "utf-8",
        );

        expect(vol.toJSON("/output", undefined, true)).toMatchSnapshot();
        expect(content).toMatchInlineSnapshot(`
          "label: foobar
          position: 1
          link: 
            type: generated-index
            title: 'foobar overview'
          "
        `);
      });

      test("do not generate _category_.yml file if it exists", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";

        const data = "The quick brown fox jumps over the lazy dog";

        await Utils.ensureDir(outputPath);
        fs.writeFileSync(join(outputPath, "_category_.yml"), data, "utf-8");

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        const content = fs.readFileSync(
          join(outputPath, "_category_.yml"),
          "utf-8",
        );

        expect(content).toEqual(data);
      });

      test("generate _category_.yml file with sidebar position", async () => {
        expect.assertions(2);

        const category = "foobar";
        const outputPath = "/output/docs";

        await rendererInstance.generateCategoryMetafile(
          category,
          outputPath,
          42,
        );

        const content = fs.readFileSync(
          join(outputPath, "_category_.yml"),
          "utf-8",
        );

        expect(vol.toJSON("/output", undefined, true)).toMatchSnapshot();
        expect(content).toMatchInlineSnapshot(`
          "label: foobar
          position: 42
          link: null
          "
        `);
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

        expect(spy).toHaveBeenCalledTimes(1);
        expect(dirPath).toBe("/output/baz");
      });

      test("generate group _category_.yml file", async () => {
        expect.assertions(2);

        const [type, name, root, group] = [{}, "Foo", "objects", "lorem"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
        jest.replaceProperty(rendererInstance, "group", {
          [root]: { [name]: group },
        });
        jest
          .spyOn(Utils, "hasProperty")
          .mockImplementation((_, prop) => prop === root || prop === name);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as Utils.SchemaEntity,
        );

        expect(spy).toHaveBeenCalledTimes(2);
        expect(dirPath).toBe(`/output/${group}/${root.toLowerCase()}`);
      });

      test("generate deprecated _category_.yml file if type is deprecated", async () => {
        expect.assertions(2);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "group",
        });
        jest
          .spyOn(Utils, "hasProperty")
          .mockImplementation((_, prop) => prop === "deprecated");
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as Utils.SchemaEntity,
        );

        expect(spy).toHaveBeenCalledTimes(2);
        expect(dirPath).toBe(`/output/deprecated/${root.toLowerCase()}`);
      });

      test("generate no deprecated _category_.yml file if type is not deprecated", async () => {
        expect.assertions(2);

        const [type, name, root] = [{}, "Foo", "Baz"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
        jest.replaceProperty(rendererInstance, "options", {
          deprecated: "group",
        });
        jest
          .spyOn(Utils, "hasProperty")
          .mockImplementation((_, prop) => prop === "deprecated");
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(false);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as Utils.SchemaEntity,
        );

        expect(spy).toHaveBeenCalledTimes(1);
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
        jest.spyOn(Utils, "hasProperty").mockReturnValue(true);
        jest.spyOn(Utils, "isDeprecated").mockReturnValue(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root as Utils.SchemaEntity,
        );

        expect(spy).toHaveBeenCalledTimes(3);
        expect(dirPath).toBe(
          `/output/deprecated/${group}/${root.toLowerCase()}`,
        );
      });
    });
  });
});
