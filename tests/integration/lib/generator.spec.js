const mock = require("mock-fs");
const path = require("path");
const dirTree = require("directory-tree");

const generateDocFromSchema = require("@/lib/generator");

describe("lib", () => {
  beforeEach(() => {
    mock({
      node_modules: mock.load(path.resolve(__dirname, "../../../node_modules")),
      __data__: mock.load(path.resolve(__dirname, "../../__data__"), {
        lazy: false,
      }),
      output: {},
      assets: {
        "generated.md": "Dummy homepage for tweet.graphql",
        "sidebar.json": mock.load(require.resolve("@assets/sidebar.json"), {
          lazy: false,
        }),
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

        const outputFolder = dirTree("output");
        const tmpFolder = dirTree("tmp");

        mock.restore(); // see https://github.com/tschaub/mock-fs#caveats

        expect(outputFolder).toMatchSnapshot(__OS__);
        expect(tmpFolder).toMatchSnapshot(__OS__);
      });
    });
  });
});
