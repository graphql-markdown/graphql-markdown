import { loadSchema as gqlToolsLoadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import type { GraphQLSchema } from "graphql/type";

import type { LoaderOption } from "@graphql-markdown/types";

import { getDocumentLoaders, loadSchema } from "../../src/loader";

const SCHEMA_FILE = require.resolve("../__data__/tweet.graphql");
const SCHEMA_CUSTOM_ROOT_FILE =
  require.resolve("../__data__/schema_with_custom_root_types.graphql");

describe("loader", () => {
  let schema: GraphQLSchema;

  beforeAll(async () => {
    schema = await gqlToolsLoadSchema(SCHEMA_FILE, {
      loaders: [new GraphQLFileLoader()],
    });
  });

  describe("loadSchema()", () => {
    test("returns valid schema", async () => {
      expect.hasAssertions();

      const testSchema = await loadSchema(SCHEMA_FILE, {
        loaders: [new GraphQLFileLoader()],
      });
      expect(JSON.stringify(testSchema)).toBe(JSON.stringify(schema));
    });

    test("returns valid schema with custom root type", async () => {
      expect.hasAssertions();

      const testSchema = await loadSchema(SCHEMA_CUSTOM_ROOT_FILE, {
        loaders: [new GraphQLFileLoader()],
        rootTypes: { query: "Root", subscription: "" },
      });

      expect(testSchema.getQueryType()!.name).toBe("Root");
      expect(testSchema.getMutationType()).toBeUndefined();
      expect(testSchema.getSubscriptionType()).toBeUndefined();
    });
  });

  describe("getDocumentLoaders()", () => {
    test("returns loaders when plugin config loaders format is a string", async () => {
      expect.hasAssertions();

      const loaderList = {
        GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
      } as LoaderOption;
      const documentLoaders = await getDocumentLoaders(loaderList);

      expect(documentLoaders).toBeDefined();
      const { loaders, ...loaderOptions } = documentLoaders!;

      expect(loaders).toMatchObject([new GraphQLFileLoader()]);
      expect(loaderOptions).toMatchObject({});
    });

    test("returns loaders and configuration when plugin config loaders format is an object", async () => {
      expect.hasAssertions();

      const loaderList = {
        GraphQLFileLoader: {
          module: "@graphql-tools/graphql-file-loader",
          options: {
            option1: true,
          },
        },
      } as LoaderOption;
      const documentLoaders = await getDocumentLoaders(loaderList);

      expect(documentLoaders).toBeDefined();
      const { loaders, ...loaderOptions } = documentLoaders!;

      expect(loaders).toMatchObject([new GraphQLFileLoader()]);
      expect(loaderOptions).toMatchObject({
        option1: true,
      });
    });

    test("throw an error when loader list is invalid", async () => {
      expect.hasAssertions();

      const loaderList = { GraphQLFileLoader: {} } as LoaderOption;
      await expect(getDocumentLoaders(loaderList)).rejects.toThrow(
        `Wrong format for plugin loader "GraphQLFileLoader", it should be {module: String, options?: Object}`,
      );
    });
  });
});
