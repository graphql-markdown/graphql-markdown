const mockfs = require("mock-fs");

const path = require("path");
const dirTree = require("directory-tree");

const generateDocFromSchema = require("../../../src/lib/generator");

const EXPECT_PATH = path.join(
  __dirname,
  "__expect__",
  __OS__,
  path.basename(__filename),
);

describe("lib", () => {
  beforeEach(() => {
    mockfs({
      node_modules: mockfs.load(
        path.resolve(__dirname, "../../../node_modules"),
      ),
      __data__: mockfs.load(path.resolve(__dirname, "../../__data__"), {
        lazy: false,
      }),
      output: {},
      assets: {
        "generated.md": "Dummy homepage for tweet.graphql",
        "sidebar.json": mockfs.load(
          path.resolve(__dirname, "../../../assets/sidebar.json"),
          {
            lazy: false,
          },
        ),
      },
      tmp: {},
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  afterAll(() => {
    mockfs.restore();
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

        mockfs.restore(); // see https://github.com/tschaub/mock-fs#caveats

        expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, "generateDocFromSchemaOutputFolder.hash"),
        );
        expect(JSON.stringify(tmpFolder, null, 2)).toMatchFile(
          path.join(EXPECT_PATH, "generateDocFromSchemaTmpFolder.hash"),
        );
      });
    });
    
    test("Markdown document structure from GraphQL schema is correct when using grouping", async () => {
      expect.assertions(1);
      
      await generateDocFromSchema({
        baseURL: "graphql",
        schemaLocation: "__data__/schema_with_grouping.graphql",
        outputDir: "output",
        linkRoot: "docs",
        homepageLocation: "assets/generated.md",
        diffMethod: "SCHEMA-DIFF",
        tmpDir: "tmp",
        loaders: {},
        groupByDirective: {
          directive: "doc",
          field: "category",
          fallback: "Miscellaneous",
        },
      });

      const outputFolder = dirTree("output", {
        attributes: ["size", "type", "extension"],
      });

      mockfs.restore();
      expect(JSON.stringify(outputFolder, null, 2)).toMatchFile(
        path.join(EXPECT_PATH, `generateDocFromSchemaWithGroupingOutputFolder`),
      );
    });
  });
});
