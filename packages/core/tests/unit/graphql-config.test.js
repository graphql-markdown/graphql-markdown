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

    test("returns undefined if not graphql-config found", () => {
      expect.hasAssertions();

      expect(loadConfiguration()).toBeUndefined();
    });

    test("returns undefined if graphql-config empty", () => {
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
    ])("returns config if graphql-config valid", () => {
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
        loadConfiguration(undefined, undefined, {
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

    test("returns default config", () => {
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
            baseURL: "default",
          },
        },
      };

      const filePath = join(process.cwd(), ".graphqlrc");
      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      expect(
        loadConfiguration("default", undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).toStrictEqual({
        baseURL: "default",
        documents: undefined,
        exclude: undefined,
        include: undefined,
        schema: "http://localhost:4000/graphql",
      });
    });

    test("returns project config", () => {
      expect.hasAssertions();

      const graphqlConfig = {
        projects: {
          foo: {
            schema: [
              {
                "http://localhost:4000/graphql": {
                  headers: { Authorization: true },
                },
              },
            ],
            extensions: {
              "graphql-markdown": {
                baseURL: "foo",
              },
            },
          },
          bar: { schema: "./packages/bar/schema.graphql" },
        },
      };

      const filePath = join(process.cwd(), ".graphqlrc");
      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      expect(
        loadConfiguration("foo", undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).toStrictEqual({
        baseURL: "foo",
        documents: undefined,
        exclude: undefined,
        include: undefined,
        schema: "http://localhost:4000/graphql",
      });
    });

    test("returns undefined if project id does not exist", () => {
      expect.hasAssertions();

      const graphqlConfig = {
        projects: {
          foo: {
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
          },
          bar: { schema: "./packages/bar/schema.graphql" },
        },
      };

      const filePath = join(process.cwd(), ".graphqlrc");
      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      expect(loadConfiguration("baz", undefined)).toBeUndefined();
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
