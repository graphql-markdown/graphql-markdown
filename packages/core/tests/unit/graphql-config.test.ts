import { vol } from "memfs";
jest.mock("node:fs"); // used for @graphql-markdown
jest.mock("fs"); // used for graphql-config

import { join } from "node:path";

import { loadConfiguration } from "../../src/graphql-config";
import { buildConfig, DEFAULT_OPTIONS } from "../../src/config";

const filePath = join(__dirname, "..", "..", ".graphqlrc");

describe("graphql-config", () => {
  describe("loadConfiguration()", () => {
    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
    });

    test("returns undefined if not graphql-config found", async () => {
      expect.hasAssertions();

      await expect(loadConfiguration()).resolves.toBeUndefined();
    });

    test("returns undefined if graphql-config empty", async () => {
      expect.hasAssertions();

      vol.fromJSON({
        [filePath]: "",
      });

      await expect(loadConfiguration()).resolves.toBeUndefined();
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
      [["http://localhost:4000/graphql", "./packages/bar/schema.graphql"]],
    ])("returns config if graphql-config valid", async () => {
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

      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      await expect(
        loadConfiguration(undefined, undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).resolves.toStrictEqual({
        baseURL: "test",
        documents: undefined,
        exclude: undefined,
        include: undefined,
        schema: "http://localhost:4000/graphql",
      });
    });

    test("returns default config", async () => {
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
            loaders: {
              UrlLoader: {
                module: "@graphql-tools/url-loader",
                options: {
                  method: "POST",
                },
              },
            },
          },
        },
      };

      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      await expect(
        loadConfiguration("default", undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).resolves.toStrictEqual({
        baseURL: "default",
        documents: undefined,
        exclude: undefined,
        include: undefined,
        loaders: {
          UrlLoader: {
            module: "@graphql-tools/url-loader",
            options: {
              method: "POST",
              headers: {
                Authorization: true,
              },
            },
          },
        },
        schema: "http://localhost:4000/graphql",
      });
    });

    test("returns project config", async () => {
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
                loaders: { UrlLoader: "@graphql-tools/url-loader" },
              },
            },
          },
          bar: { schema: "./packages/bar/schema.graphql" },
        },
      };

      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      await expect(
        loadConfiguration("foo", undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).resolves.toStrictEqual({
        baseURL: "foo",
        documents: undefined,
        exclude: undefined,
        include: undefined,
        loaders: {
          UrlLoader: {
            module: "@graphql-tools/url-loader",
            options: {
              headers: {
                Authorization: true,
              },
            },
          },
        },
        schema: "http://localhost:4000/graphql",
      });
    });

    test("returns undefined if project id does not exist", async () => {
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

      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      await expect(loadConfiguration("baz")).resolves.toBeUndefined();
    });
  });
});

describe("config", () => {
  describe("buildConfig()", () => {
    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
    });

    test("returns config with .graphqlrc options set", async () => {
      expect.hasAssertions();

      const graphqlConfig = {
        schema: "assets/my-schema.graphql",
        extensions: {
          "graphql-markdown": {
            baseURL: "test",
          },
        },
      };

      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      const config = await buildConfig();

      expect(config).toEqual(
        expect.objectContaining({
          baseURL: graphqlConfig.extensions["graphql-markdown"].baseURL,
          customDirective: DEFAULT_OPTIONS.customDirective,
          diffMethod: DEFAULT_OPTIONS.diffMethod,
          docOptions: DEFAULT_OPTIONS.docOptions,
          groupByDirective: DEFAULT_OPTIONS.groupByDirective,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          linkRoot: DEFAULT_OPTIONS.linkRoot,
          loaders: DEFAULT_OPTIONS.loaders,
          outputDir: join(
            DEFAULT_OPTIONS.rootPath,
            graphqlConfig.extensions["graphql-markdown"].baseURL,
          ),
          prettify: DEFAULT_OPTIONS.pretty,
          printer: DEFAULT_OPTIONS.printer,
          printTypeOptions: DEFAULT_OPTIONS.printTypeOptions,
          schemaLocation: graphqlConfig.schema,
          skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
          tmpDir: expect.stringMatching(/.+@graphql-markdown\/docusaurus$/),
        }),
      );
    });
  });
});
