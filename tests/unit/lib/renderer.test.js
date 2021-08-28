const mock = require("mock-fs");
const path = require("path");
const dirTree = require("directory-tree");

const Renderer = require("@/lib/renderer");

jest.mock("@/lib/printer");
const Printer = require("@/lib/printer");

const OUTPUT = "output";
const HOMEPAGE = "generated.md";
const SIDEBAR = "sidebar.json";

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
            [HOMEPAGE]: mock.load(require.resolve(`@assets/${HOMEPAGE}`)),
            [SIDEBAR]: mock.load(require.resolve(`@assets/${SIDEBAR}`)),
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
          expect(meta).toEqual({ category: "Foobar", slug: "foobar/foo-bar" });

          const outputFolder = dirTree(OUTPUT);

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(outputFolder).toMatchSnapshot();
        });
      });

      describe("renderSidebar()", () => {
        test("creates Docusaurus compatible sidebar.js into output folder", async () => {
          expect.assertions(1);

          await rendererInstance.renderSidebar();

          const outputFolder = dirTree(OUTPUT);

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats
          
          expect(outputFolder).toMatchSnapshot();
        });
      });

      describe("renderHomepage()", () => {
        test("copies default homepage into output folder", async () => {
          expect.assertions(1);
          await rendererInstance.renderHomepage(`assets/${HOMEPAGE}`);

          const outputFolder = dirTree(OUTPUT);

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(outputFolder).toMatchSnapshot({
            children: [{ size: expect.any(Number) }],
            size: expect.any(Number),
          });
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

          const outputFolder = dirTree(OUTPUT);

          mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

          expect(outputFolder).toMatchSnapshot();
        });
      });
    });
  });
});
