const mock = require("mock-fs");

const path = require("path");
const fs = require("fs");

const dirTree = require("directory-tree");

const Renderer = require("../../../src/lib/renderer");

jest.mock("../../../src/lib/printer");
const Printer = require("../../../src/lib/printer");

const OUTPUT = "output";
const HOMEPAGE = "generated.md";
const SIDEBAR = "sidebar.json";

const EXPECT_PATH = path.join(
  __dirname,
  "__expect__",
  __OS__,
  path.basename(__filename),
);

describe("lib", () => {
  describe("renderer", () => {
    describe("class Renderer", () => {
      let rendererInstance;
      let baseURL = "graphql";
      let printerInstance;

      beforeEach(() => {
        mock({
          node_modules: mock.load(
            path.resolve(__dirname, "../../../node_modules"),
          ),
          [OUTPUT]: {},
          assets: {
            [HOMEPAGE]: "Test Homepage",
            [SIDEBAR]: mock.load(
              path.resolve(__dirname, `../../../assets/${SIDEBAR}`),
            ),
          },
        });
        printerInstance = new Printer("SCHEMA", baseURL, "root");
        rendererInstance = new Renderer(printerInstance, OUTPUT, baseURL);
      });

      afterEach(() => {
        mock.restore();
      });

      describe("renderTypeEntities()", () => {
        test("creates entity page into output folder", async () => {
          expect.assertions(2);

          jest
            .spyOn(printerInstance, "printType")
            .mockReturnValue("Lorem ipsum");
          const output = `${OUTPUT}/foobar`;

          const meta = await rendererInstance.renderTypeEntities(
            output,
            "FooBar",
            "FooBar",
          );
          const outputFolder = dirTree(OUTPUT, {
            attributes: ["size", "type", "extension"],
          });

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(meta).toEqual({ category: "Foobar", slug: "foobar/foo-bar" });
          expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
            path.join(EXPECT_PATH, "renderTypeEntities.json"),
          );
        });
      });

      describe("renderSidebar()", () => {
        test("creates Docusaurus compatible sidebar.js into output folder", async () => {
          expect.assertions(1);

          await rendererInstance.renderSidebar();

          const outputFolder = dirTree(OUTPUT, {
            attributes: ["size", "type", "extension"],
          });

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
            path.join(EXPECT_PATH, "renderSidebar.json"),
          );
        });
      });

      describe("renderHomepage()", () => {
        test("copies default homepage into output folder", async () => {
          expect.assertions(1);

          await rendererInstance.renderHomepage(`assets/${HOMEPAGE}`);
          const outputFolder = dirTree(OUTPUT, {
            attributes: ["size", "type", "extension"],
          });

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
            path.join(EXPECT_PATH, "renderHomepage.json"),
          );
        });
      });

      describe("renderRootTypes()", () => {
        test("render root type", async () => {
          expect.assertions(1);

          jest
            .spyOn(printerInstance, "printType")
            .mockImplementation(() => "content");
          await rendererInstance.renderRootTypes("Object", [
            { name: "foo" },
            { name: "bar" },
          ]);

          const outputFolder = dirTree(OUTPUT, {
            attributes: ["size", "type", "extension"],
          });

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
            path.join(EXPECT_PATH, "renderRootTypes.json"),
          );
        });
      });

      describe("generateCategoryMetafile()", () => {
        test("generate _category_.yml file", async () => {
          expect.assertions(2);

          const category = "foobar";
          const outputPath = "output/docs";

          await rendererInstance.generateCategoryMetafile(category, outputPath);

          const outputFolder = dirTree(OUTPUT, {
            attributes: ["size", "type", "extension"],
          });

          const content = fs.readFileSync(
            path.join(outputPath, "_category_.yml"),
            "utf-8",
          );

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
            path.join(EXPECT_PATH, "generateCategoryMetafile.json"),
          );

          expect(content).toMatchInlineSnapshot(`
            "label: Foobar
            link: null
            "
          `);
        });

        test("generate _category_.yml file with generated index", async () => {
          expect.assertions(2);

          const category = "foobar";
          const outputPath = "output/docs";

          rendererInstance.options = { index: true };

          await rendererInstance.generateCategoryMetafile(category, outputPath);

          const outputFolder = dirTree(OUTPUT, {
            attributes: ["size", "type", "extension"],
          });

          const content = fs.readFileSync(
            path.join(outputPath, "_category_.yml"),
            "utf-8",
          );

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
            path.join(
              EXPECT_PATH,
              "generateCategoryMetafileGeneratedIndex.json",
            ),
          );

          expect(content).toMatchInlineSnapshot(`
            "label: Foobar
            link: 
              type: generated-index
              title: 'Foobar overview'

            "
          `);
        });
      });
    });
  });
});
