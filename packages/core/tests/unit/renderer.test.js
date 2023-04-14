const { vol } = require("memfs");
jest.mock("fs");

const path = require("path");
const fs = require("fs");

jest.mock("@graphql-markdown/printer-legacy", () => {
  return {
    printType: jest.fn(),
    init: jest.fn(),
  };
});
const Printer = require("@graphql-markdown/printer-legacy");

jest.mock("@graphql-markdown/utils", () => {
  return {
    ...jest.requireActual("@graphql-markdown/utils"),
    object: {
      hasProperty: jest.fn(),
    },
    graphql: {
      isDeprecated: jest.fn(),
    },
    string: {
      toSlug: (value) => value.toLowerCase(),
      startCase: (value) => value,
    },
  };
});
const Utils = require("@graphql-markdown/utils");

const Renderer = require("../../src/renderer");
const { GraphQLObjectType } = require("graphql");

describe("renderer", () => {
  describe("class Renderer", () => {
    let rendererInstance;
    let baseURL = "graphql";

    beforeEach(() => {
      vol.fromJSON({
        "/output": {},
        "/temp": {},
        "/assets/generated.md": "Test Homepage",
      });

      rendererInstance = new Renderer(Printer, "/output", baseURL);
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
        await rendererInstance.renderRootTypes("Object", {
          foo: new GraphQLObjectType({ name: "foo", astNode: {} }),
          bar: new GraphQLObjectType({ name: "bar", astNode: {} }),
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
          path.join(outputPath, "_category_.yml"),
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

        rendererInstance.options = { index: true };

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        const content = fs.readFileSync(
          path.join(outputPath, "_category_.yml"),
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

        await Utils.fs.ensureDir(outputPath);
        fs.writeFileSync(
          path.join(outputPath, "_category_.yml"),
          data,
          "utf-8",
        );

        await rendererInstance.generateCategoryMetafile(category, outputPath);

        const content = fs.readFileSync(
          path.join(outputPath, "_category_.yml"),
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
          path.join(outputPath, "_category_.yml"),
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
          "Baz",
        );

        expect(spy).toHaveBeenCalledTimes(1);
        expect(dirPath).toBe("/output/baz");
      });

      test("generate group _category_.yml file", async () => {
        expect.assertions(2);

        const [type, name, root, group] = [{}, "Foo", "Baz", "lorem"];

        const spy = jest.spyOn(rendererInstance, "generateCategoryMetafile");
        jest.replaceProperty(rendererInstance, "group", {
          [root]: { [name]: group },
        });
        jest
          .spyOn(Utils.object, "hasProperty")
          .mockImplementation((_, prop) => prop === root || prop === name);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root,
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
          .spyOn(Utils.object, "hasProperty")
          .mockImplementation((_, prop) => prop === "deprecated");
        jest.spyOn(Utils.graphql, "isDeprecated").mockReturnValue(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root,
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
          .spyOn(Utils.object, "hasProperty")
          .mockImplementation((_, prop) => prop === "deprecated");
        jest.spyOn(Utils.graphql, "isDeprecated").mockReturnValue(false);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root,
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
        jest.spyOn(Utils.object, "hasProperty").mockReturnValue(true);
        jest.spyOn(Utils.graphql, "isDeprecated").mockReturnValue(true);

        const dirPath = await rendererInstance.generateCategoryMetafileType(
          type,
          name,
          root,
        );

        expect(spy).toHaveBeenCalledTimes(3);
        expect(dirPath).toBe(
          `/output/deprecated/${group}/${root.toLowerCase()}`,
        );
      });
    });
  });
});
