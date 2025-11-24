/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vol } from "memfs";

import { join } from "node:path";

import * as CoreGraphQLConfig from "../../src/graphql-config";
import {
  buildConfig,
  DEFAULT_HIERARCHY,
  DEFAULT_OPTIONS,
} from "../../src/config";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
jest.mock("graphql-config");
import * as GraphQLConfig from "graphql-config";

describe("graphql-config", () => {
  describe("loadConfiguration()", () => {
    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
      jest.resetAllMocks();
    });

    test("returns undefined if graphql-config empty", async () => {
      expect.hasAssertions();

      await expect(
        CoreGraphQLConfig.loadConfiguration("default"),
      ).resolves.toBeUndefined();
    });

    test("returns undefined if an error is thrown", async () => {
      expect.hasAssertions();

      jest
        .spyOn(CoreGraphQLConfig, "setLoaderOptions")
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(
        CoreGraphQLConfig.loadConfiguration("default", undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).resolves.toBeUndefined();
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
    ])("returns config if graphql-config valid - %#", async (schema) => {
      expect.hasAssertions();

      const graphqlConfig = {
        schema,
        extensions: {
          "graphql-markdown": {
            baseURL: "test",
          },
        },
      };

      const spy = jest
        .spyOn(GraphQLConfig, "loadConfig")
        .mockResolvedValueOnce({
          getProject: () => {
            return {
              extension: (): any => {
                return {
                  documents: undefined,
                  exclude: undefined,
                  include: undefined,
                  schema: graphqlConfig.schema,
                  ...graphqlConfig.extensions["graphql-markdown"],
                } as unknown as any;
              },
            } as unknown as any;
          },
        } as unknown as any);

      await expect(
        CoreGraphQLConfig.loadConfiguration("default", undefined, {
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
      expect(spy).toHaveBeenCalledWith({
        extensions: [CoreGraphQLConfig.graphQLConfigExtension],
        throwOnMissing: true,
        throwOnEmpty: true,
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

      jest.spyOn(GraphQLConfig, "loadConfig").mockResolvedValueOnce({
        getProject: () => {
          return {
            extension: (): any => {
              return {
                documents: undefined,
                exclude: undefined,
                include: undefined,
                schema: graphqlConfig.schema,
                ...graphqlConfig.extensions["graphql-markdown"],
              } as unknown as any;
            },
          } as unknown as any;
        },
      } as unknown as any);

      await expect(
        CoreGraphQLConfig.loadConfiguration("default", undefined, {
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

      jest.spyOn(GraphQLConfig, "loadConfig").mockResolvedValueOnce({
        getProject: () => {
          return {
            extension: (): any => {
              return {
                documents: undefined,
                exclude: undefined,
                include: undefined,
                schema: graphqlConfig.projects.foo.schema,
                ...graphqlConfig.projects.foo.extensions["graphql-markdown"],
              } as unknown as any;
            },
          } as unknown as any;
        },
      } as unknown as any);

      await expect(
        CoreGraphQLConfig.loadConfiguration("foo", undefined, {
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

      (GraphQLConfig.loadConfig as jest.Mock).mockResolvedValueOnce({
        getProject: jest.fn(() => {
          return undefined;
        }),
      });

      await expect(
        CoreGraphQLConfig.loadConfiguration("baz"),
      ).resolves.toBeUndefined();
    });

    test.each([[undefined], [null]])(
      "returns undefined if project id is %s",
      async (value) => {
        expect.hasAssertions();

        await expect(
          CoreGraphQLConfig.loadConfiguration(value),
        ).resolves.toBeUndefined();
      },
    );

    test("handles conditional expressions in configuration loading", async () => {
      expect.hasAssertions();

      // Mock loadConfig to simulate different project scenarios
      const mockLoadConfig = jest.spyOn(GraphQLConfig, "loadConfig");

      // Scenario 1: Project exists and has graphql-markdown extension
      mockLoadConfig.mockResolvedValueOnce({
        getProject: jest.fn(() => {
          return {
            extension: (): any => {
              return {
                schema: "./schema.graphql",
                baseURL: "docs",
              };
            },
          };
        }),
      } as unknown as any);

      const result1 =
        await CoreGraphQLConfig.loadConfiguration("existing-project");
      expect(result1).toEqual({
        schema: "./schema.graphql",
        baseURL: "docs",
      });

      // Scenario 2: Project exists but doesn't have graphql-markdown extension
      mockLoadConfig.mockResolvedValueOnce({
        getProject: jest.fn(() => {
          return {
            extension: (): any => {
              return undefined;
            },
          };
        }),
      } as unknown as any);

      const result2 = await CoreGraphQLConfig.loadConfiguration(
        "project-without-extension",
      );
      expect(result2).toBeUndefined();

      // Scenario 3: Project doesn't exist
      mockLoadConfig.mockResolvedValueOnce({
        getProject: jest.fn(() => {
          return undefined;
        }),
      } as unknown as any);

      const result3 = await CoreGraphQLConfig.loadConfiguration(
        "non-existent-project",
      );
      expect(result3).toBeUndefined();

      // This ensures the conditional logic is properly tested
      expect(mockLoadConfig).toHaveBeenCalledTimes(3);
    });
  });
});

describe("config", () => {
  describe("buildConfig()", () => {
    afterEach(() => {
      vol.reset();
      jest.restoreAllMocks();
      jest.resetAllMocks();
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

      jest.spyOn(GraphQLConfig, "loadConfig").mockResolvedValueOnce({
        getProject: () => {
          return {
            extension: (): any => {
              return {
                documents: undefined,
                exclude: undefined,
                include: undefined,
                schema: graphqlConfig.schema,
                ...graphqlConfig.extensions["graphql-markdown"],
              } as unknown as any;
            },
          } as unknown as any;
        },
      } as unknown as any);

      const config = await buildConfig(undefined, undefined);

      expect(config).toEqual(
        expect.objectContaining({
          id: DEFAULT_OPTIONS.id,
          baseURL: graphqlConfig.extensions["graphql-markdown"].baseURL,
          customDirective: DEFAULT_OPTIONS.customDirective,
          diffMethod: DEFAULT_OPTIONS.diffMethod,
          docOptions: DEFAULT_OPTIONS.docOptions,
          groupByDirective: DEFAULT_OPTIONS.groupByDirective,
          homepageLocation: expect.stringMatching(/.+\/assets\/generated.md$/),
          linkRoot: DEFAULT_OPTIONS.linkRoot,
          loaders: DEFAULT_OPTIONS.loaders,
          outputDir: join(
            DEFAULT_OPTIONS.rootPath!,
            graphqlConfig.extensions["graphql-markdown"].baseURL,
          ),
          prettify: DEFAULT_OPTIONS.pretty,
          printer: DEFAULT_OPTIONS.printer,
          printTypeOptions: {
            ...DEFAULT_OPTIONS.printTypeOptions,
            hierarchy: DEFAULT_HIERARCHY,
          },
          schemaLocation: graphqlConfig.schema,
          skipDocDirective: DEFAULT_OPTIONS.skipDocDirective,
          tmpDir: expect.stringMatching(/.+@graphql-markdown\/docusaurus$/),
        }),
      );
    });

    test("loads configuration with throwOnMissing and throwOnEmpty both true", async () => {
      expect.hasAssertions();

      (GraphQLConfig.loadConfig as jest.Mock).mockResolvedValueOnce({
        config: { id: "test-project" },
      });

      const result = await CoreGraphQLConfig.loadConfiguration(
        "test",
        {},
        {
          throwOnMissing: true,
          throwOnEmpty: true,
        },
      );

      expect(result).toBeUndefined();
    });

    test("loads configuration with throwOnMissing and throwOnEmpty both false", async () => {
      expect.hasAssertions();

      (GraphQLConfig.loadConfig as jest.Mock).mockResolvedValueOnce({
        config: { id: "test-project" },
      });

      const result = await CoreGraphQLConfig.loadConfiguration(
        "test",
        {},
        {
          throwOnMissing: false,
          throwOnEmpty: false,
        },
      );

      expect(result).toBeUndefined();
    });

    test("handles throwOnMissing true and throwOnEmpty false", async () => {
      expect.hasAssertions();

      (GraphQLConfig.loadConfig as jest.Mock).mockResolvedValueOnce({
        config: { id: "test-project" },
      });

      const result = await CoreGraphQLConfig.loadConfiguration(
        "test",
        {},
        {
          throwOnMissing: true,
          throwOnEmpty: false,
        },
      );

      expect(result).toBeUndefined();
    });

    test("handles throwOnMissing false and throwOnEmpty true", async () => {
      expect.hasAssertions();

      (GraphQLConfig.loadConfig as jest.Mock).mockResolvedValueOnce({
        config: { id: "test-project" },
      });

      const result = await CoreGraphQLConfig.loadConfiguration(
        "test",
        {},
        {
          throwOnMissing: false,
          throwOnEmpty: true,
        },
      );

      expect(result).toBeUndefined();
    });

    test("returns undefined when id is numeric value", async () => {
      expect.hasAssertions();

      const result = await CoreGraphQLConfig.loadConfiguration(
        123 as any,
        {},
        { throwOnMissing: true, throwOnEmpty: true },
      );

      expect(result).toBeUndefined();
    });

    test("returns undefined when id is boolean value", async () => {
      expect.hasAssertions();

      const result = await CoreGraphQLConfig.loadConfiguration(
        true as any,
        {},
        { throwOnMissing: true, throwOnEmpty: true },
      );

      expect(result).toBeUndefined();
    });

    test("returns undefined when id is empty string", async () => {
      expect.hasAssertions();

      const result = await CoreGraphQLConfig.loadConfiguration(
        "",
        {},
        { throwOnMissing: true, throwOnEmpty: true },
      );

      expect(result).toBeUndefined();
    });
  });
});
