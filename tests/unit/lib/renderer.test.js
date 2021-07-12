const mock = require("mock-fs");
const path = require("path");
const dirTree = require("directory-tree");

const Renderer = require("@/lib/renderer");

jest.mock("@/lib/printer");
const Printer = require("@/lib/printer");

const FOLDER = "output";
const HOMEPAGE = "generated.md";
const SIDEBAR = "sidebar.json";

describe("lib", () => {
  describe("renderer", () => {
    describe("class Renderer", () => {
      let rendererInstance,
        baseURL = "graphql",
        printerInstance = new Printer("SCHEMA", baseURL, "root");

      beforeEach(() => {
        mock({
          node_modules: mock.load(
            path.resolve(__dirname, "../../../node_modules")
          ),
          output: {},
          assets: {
            [HOMEPAGE]: mock.load(require.resolve(`@assets/${HOMEPAGE}`)),
            [SIDEBAR]: mock.load(require.resolve(`@assets/${SIDEBAR}`)),
          },
        });
        rendererInstance = new Renderer(printerInstance, FOLDER, baseURL);
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
          const output = `${FOLDER}/foobar`;

          const meta = await rendererInstance.renderTypeEntities(
            output,
            "FooBar",
            "FooBar"
          );
          expect(meta).toEqual({ category: "Foobar", slug: "foobar/foo-bar" });

          expect(dirTree(FOLDER)).toMatchSnapshot();
        });
      });

      describe("renderSidebar()", () => {
        test("creates Docusaurus compatible sidebar.js into output folder", async () => {
          expect.assertions(1);

          await rendererInstance.renderSidebar();
          expect(dirTree(FOLDER)).toMatchSnapshot();
        });
      });

      describe("renderHomepage()", () => {
        test("copies default homepage into output folder", async () => {
          expect.assertions(1);
          await rendererInstance.renderHomepage(`assets/${HOMEPAGE}`);

          expect(dirTree(FOLDER)).toMatchSnapshot({
            children: [{ size: expect.any(Number) }],
            size: expect.any(Number),
          });
        });
      });

      describe("renderRootTypes()", () => {
        test("render root type", async () => {
          expect.assertions(1);
          await rendererInstance.renderRootTypes("Object", [
            { name: "foo" },
            { name: "bar" },
          ]);
          expect(dirTree(FOLDER)).toMatchSnapshot();
        });
      });
    });
  });
});
