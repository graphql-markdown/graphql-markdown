const { vol } = require("memfs");
jest.mock("fs");

const path = require("path");

const { loadConfiguration } = require("../../src/graphql-config");

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

    test("return config if graphql-config valid", () => {
      expect.hasAssertions();

      const graphqlConfig = {
        schema: "assets/my-schema.graphql",
        extensions: {
          "graphql-markdown": {
            baseURL: "test",
          },
        },
      };

      const filePath = path.join(process.cwd(), ".graphqlrc");
      vol.fromJSON({
        [filePath]: JSON.stringify(graphqlConfig),
      });

      expect(
        loadConfiguration(undefined, {
          throwOnMissing: true,
          throwOnEmpty: true,
        }),
      ).toMatchInlineSnapshot(`
        {
          "baseURL": "test",
          "documents": undefined,
          "exclude": undefined,
          "include": undefined,
          "schema": "assets/my-schema.graphql",
        }
      `);
    });
  });
});
