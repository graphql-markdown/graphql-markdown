const mock = require("mock-fs");
const path = require("path");
const dirTree = require("directory-tree");

const generateDocFromSchema = require("@/lib/generator");

describe("lib", () => {
  beforeEach(() => {
    mock({
      node_modules: mock.load(path.resolve(__dirname, "../../../node_modules")),
      __data__: mock.load(path.resolve(__dirname, "../../__data__")),
      output: {},
      assets: {
        "generated.md": "Dummy homepage for tweet.graphql",
        "sidebar.json": mock.load(require.resolve(`@assets/sidebar.json`)),
      },
      tmp: {},
    });
  });

  afterEach(() => {
    mock.restore();
  });

  describe("renderer", () => {
    describe("generateDocFromSchema()", () => {
      test("generates Markdown document structure from GraphQL schema", async () => {
        expect.assertions(2);

        await generateDocFromSchema(
          "graphql",
          "__data__/tweet.graphql",
          "output",
          "docs",
          "assets/generated.md",
          "SCHEMA-DIFF",
          "tmp",
        );

        expect(dirTree("output")).toMatchSnapshot();
        expect(dirTree("tmp")).toMatchSnapshot();
      });
    });
  });
});
