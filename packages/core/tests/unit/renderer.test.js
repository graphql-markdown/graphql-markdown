const { vol } = require("memfs");
jest.mock("fs");

const path = require("path");
const fs = require("fs");

const { ensureDir } = require("@graphql-markdown/utils").fs;

jest.mock("@graphql-markdown/printer-legacy", () => {
  return {
    printType: jest.fn(),
    init: jest.fn(),
  };
});
const Printer = require("@graphql-markdown/printer-legacy");

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

        expect(meta).toEqual({ category: "Foobar", slug: "foobar/foo-bar" });
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
          "label: Foobar
          link: null
          position: 1
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
          "label: Foobar
          link: 
            type: generated-index
            title: 'Foobar overview'

          position: 1
          "
        `);
      });

      test("do not generate _category_.yml file if it exists", async () => {
        expect.assertions(1);

        const category = "foobar";
        const outputPath = "/output/docs";

        const data = "The quick brown fox jumps over the lazy dog";

        await ensureDir(outputPath);
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
    });
  });
});
