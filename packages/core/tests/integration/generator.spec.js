const { vol } = require("memfs");
jest.mock("fs");

jest.mock("@graphql-markdown/printer-legacy", () => {
  return {
    printType: jest.fn(),
    init: jest.fn(),
  };
});
jest.mock("@graphql-markdown/diff");
const diff = require("@graphql-markdown/diff");

const { generateDocFromSchema } = require("../../src/generator");

describe("renderer", () => {
  beforeEach(() => {
    jest.resetModules();

    vol.fromJSON({
      "/output": {},
      "/temp_test": {},
      "/assets/generated.md": "Dummy homepage for tweet.graphql",
    });
  });

  afterEach(() => {
    vol.reset();
  });

  describe("generateDocFromSchema()", () => {
    test("generates Markdown document structure from GraphQL schema", async () => {
      expect.assertions(1);

      const config = {
        baseURL: "graphql",
        schemaLocation: "tests/__data__/tweet.graphql",
        outputDir: "/output",
        linkRoot: "docs",
        homepageLocation: "/assets/generated.md",
        diffMethod: "NONE",
        tmpDir: "/temp",
        loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
        printer: "@graphql-markdown/printer-legacy",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
    });

    test('outputs "no schema changed" message when called twice', async () => {
      expect.assertions(1);

      const logSpy = jest.spyOn(console, "info");

      const config = {
        baseURL: "graphql",
        schemaLocation: "tests/__data__/tweet.graphql",
        outputDir: "/output",
        linkRoot: "docs",
        homepageLocation: "/assets/generated.md",
        diffMethod: "SCHEMA-HASH",
        tmpDir: "/temp",
        loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
        printer: "@graphql-markdown/printer-legacy",
      };

      jest.spyOn(diff, "checkSchemaChanges").mockReturnValue(false);
      await generateDocFromSchema(config);

      expect(logSpy).toHaveBeenCalledWith(
        `No changes detected in schema "${config.schemaLocation}".`,
      );
    });

    test("Markdown document structure from GraphQL schema is correct when using grouping", async () => {
      expect.assertions(2);

      const config = {
        baseURL: "graphql",
        schemaLocation: "tests/__data__/schema_with_grouping.graphql",
        outputDir: "/output",
        linkRoot: "docs",
        homepageLocation: "/assets/generated.md",
        diffMethod: "NONE",
        tmpDir: "/temp",
        loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
        groupByDirective: {
          directive: "doc",
          field: "category",
          fallback: "misc",
        },
        printer: "@graphql-markdown/printer-legacy",
      };

      await generateDocFromSchema(config);

      expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
      expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
    });
  });
});
