import fsMock from "mock-fs";

import * as path from "path";

const configLib = path.resolve("src/lib/config");

const rootDir = process.cwd();

const graphqlrc = `---
schema: ./tests/__data__/schema/tweet.graphql
extensions:
  graphql-markdown:
    layouts: ./my-layouts
    output: ./docs
`;

beforeEach(() => {
  fsMock({
    ".graphqlrc": graphqlrc,
    // eslint-disable-next-line camelcase
    node_modules: fsMock.load(path.resolve(rootDir, "node_modules")),
    src: fsMock.load(path.resolve(rootDir, "src"), { lazy: false }),
    tests: fsMock.load(path.resolve(rootDir, "tests"), { lazy: false }),
  });
});

afterEach(() => {
  fsMock.restore();
  jest.resetAllMocks();
});

describe("config", () => {
  describe("configuration", () => {
    it("loads schema location from GraphQL Config file", async () => {
      expect.hasAssertions();

      const configuration = (await import(configLib)).default;
      expect(configuration.schema).toBe(
        "./tests/__data__/schema/tweet.graphql"
      );
    });
  });

  describe("getConfigurationOption", () => {
    it("loads graphql-markdown options from GraphQL Config file", async () => {
      expect.hasAssertions();

      const { getConfigurationOption } = await import(configLib);
      expect(getConfigurationOption("layouts")).toBe("./my-layouts");
    });

    it("returns default options if not set in GraphQL Config file", async () => {
      expect.hasAssertions();

      const config = await import(configLib);
      jest.spyOn(config.default, "extension").mockReturnValue({});

      const layouts = config.getConfigurationOption("layouts");
      expect(layouts).toBe("./layouts");

      const output = config.getConfigurationOption("output");
      expect(output).toBe("./output");
    });
  });

  describe("loadSchemaFromConfiguration", () => {
    it("loads graphql schema as DocumentNode from GraphQL Config file", async () => {
      expect.hasAssertions();

      const { loadSchemaFromConfiguration } = await import(configLib);
      const schema = loadSchemaFromConfiguration();

      fsMock.restore(); // needed for snapshot

      expect(schema).toMatchSnapshot();
    });
  });
});
