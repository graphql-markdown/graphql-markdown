const mock = require("mock-fs");
const path = require("path"); // to be loaded after mock-fs
const dirTree = require("directory-tree");
const fs = require('fs');

const generateDocFromSchema = require("../../../src/lib/generator");

const EXPECT_PATH = path.join(
  __dirname,
  "__expect__",
  __OS__,
  path.basename(__filename),
);

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
        "sidebar.json": mock.load(
          require.resolve("../../../assets/sidebar.json"),
          {
            lazy: false,
          },
        ),
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

        await generateDocFromSchema({
          baseURL: "graphql",
          schemaLocation: "__data__/tweet.graphql",
          outputDir: "output",
          linkRoot: "docs",
          homepageLocation: "assets/generated.md",
          diffMethod: "SCHEMA-DIFF",
          tmpDir: "tmp",
          loaders: {},
        });

        const outputFolder = dirTree("output", {
          attributes: ["size", "type", "extension"],
        });
        const tmpFolder = dirTree("tmp", {
          attributes: ["size", "type", "extension"],
        });

        mock.restore(); // see https://github.com/tschaub/mock-fs#caveats
        expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `generateDocFromSchemaOutputFolder.hash`),
        );
        expect(JSON.stringify(tmpFolder, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, `generateDocFromSchemaTmpFolder.hash`),
        );
      });
    });
    test("Markdown document structure from GraphQL schema is correct when using grouping", async () => {
      await generateDocFromSchema({
        baseURL: "graphql",
        schemaLocation: "__data__/schema_with_grouping.graphql",
        outputDir: "output",
        linkRoot: "docs",
        homepageLocation: "assets/generated.md",
        diffMethod: "SCHEMA-DIFF",
        tmpDir: "tmp",
        loaders: {},
        directiveToGroupBy: "doc",
        directiveFieldForGrouping: "category",
      });

      const outputFolder = dirTree("output", {
        attributes: ["size", "type", "extension"],
      });

      mock.restore();
      expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
        path.join(EXPECT_PATH, `generateDocFromSchemaWithGroupingOutputFolder.hash`,
        ),
      );
    });
    test("No generated.md file is generated when homepageLocation is set to false", async () => {
      await generateDocFromSchema({
        baseURL: "graphql",
        schemaLocation: "__data__/tweet.graphql",
        outputDir: "output",
        linkRoot: "docs",
        homepageLocation: false,
        diffMethod: "SCHEMA-DIFF",
        tmpDir: "tmp",
        loaders: {},
        directiveToGroupBy: "doc",
        directiveFieldForGrouping: "category",
      });

      const outputFolder = dirTree("output", {
        attributes: ["size", "type", "extension"],
      });
      mock.restore();
      expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
        path.join(EXPECT_PATH, `generateDocFromSchemaWithHomePageFalse.hash`,
        ),
      );
    });
  });
});
