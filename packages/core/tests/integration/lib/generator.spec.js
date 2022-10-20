const { vol } = require("memfs");
jest.mock("fs");

const generateDocFromSchema = require("../../../src/lib/generator");

describe("lib", () => {
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
          loaders: {},
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
          loaders: {},
        };

        await generateDocFromSchema(config);
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
          diffMethod: "SCHEMA-DIFF",
          tmpDir: "/temp",
          loaders: {},
          groupByDirective: {
            directive: "doc",
            field: "category",
            fallback: "misc",
          },
        };

        await generateDocFromSchema(config);

        expect(vol.toJSON(config.outputDir, undefined, true)).toMatchSnapshot();
        expect(vol.toJSON(config.tmpDir, undefined, true)).toMatchSnapshot();
      });
    });
  });
});
