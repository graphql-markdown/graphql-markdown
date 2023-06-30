const { vol } = require("memfs");
jest.mock("fs");

const { join } = require("path");

const { loadConfiguration } = require("../../src/graphql-config");
const { buildConfig, DEFAULT_OPTIONS } = require("../../src/config");

describe("graphql-config", () => {
  describe("loadConfiguration()", () => {
    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
    });

    test("return undefined if not graphql-config found", () => {
      expect.hasAssertions();

      expect(loadConfiguration()).toBeUndefined();
    });

    test("return undefined if graphql-config empty", () => {
      expect.hasAssertions();

      vol.fromJSON({
        "/.graphqlrc": "",
      });

      expect(loadConfiguration()).toBeUndefined();
    });

    test.each([
      ["http://localhost:4000/graphql"],
      [
        [
          {
            "http://localhost:4000/graphql": {
              headers: { Authorization: true },
            },
          },
        ],
      ],
      [["http://localhost:4000/graphql"]],
    ])("return config if graphql-config valid", () => {
      expect.hasAssertions();

      const graphqlConfig = {
        schema: [
          {
            "http://localhost:4000/graphql": {
              headers: { Authorization: true },
            },
          },
        ],
        extensions: {
          "graphql-markdown": {
            baseURL: "test",
          },
        },
      };

      const filePath = join(process.cwd(), ".graphqlrc");
      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      expect(
        loadConfiguration(undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).toStrictEqual({
        baseURL: "test",
        documents: undefined,
        exclude: undefined,
        include: undefined,
        schema: "http://localhost:4000/graphql",
      });
    });
  });
});

describe("config", () => {
  describe("buildConfig()", () => {
    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
    });

    test("returns config with .graphqlrc options set", () => {
      expect.hasAssertions();

      const graphqlConfig = {
        schema: "assets/my-schema.graphql",
        extensions: {
          "graphql-markdown": {
            baseURL: "test",
          },
        },
      };

      const filePath = join(process.cwd(), ".graphqlrc");
      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      const config = buildConfig();

      expect(config).toEqual(
        expect.objectContaining({
          baseURL: "test",
          diffMethod: DEFAULT_OPTIONS.diffMethod,
          groupByDirective: DEFAULT_OPTIONS.groupByDirective,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          linkRoot: DEFAULT_OPTIONS.linkRoot,
          loaders: DEFAULT_OPTIONS.loaders,
          outputDir: join(DEFAULT_OPTIONS.rootPath, "test"),
          prettify: DEFAULT_OPTIONS.pretty,
          schemaLocation: "assets/my-schema.graphql",
          tmpDir: expect.stringMatching(/.+@graphql-markdown\/docusaurus$/),
          docOptions: DEFAULT_OPTIONS.docOptions,
          printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
          printer: DEFAULT_OPTIONS.printer,
          skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
          customDirective: DEFAULT_OPTIONS.customDirective,
        }),
      );
    });
  });
});
