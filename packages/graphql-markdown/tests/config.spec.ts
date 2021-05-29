import { IFS } from "unionfs/lib/fs";
import { Volume } from "memfs";
import { ufs } from "unionfs";

const configLib = require.resolve("../src/lib/config");
const schemaLocation = require.resolve("./__data__/schema/tweet.graphql");

const graphqlrc = `---
schema: ${schemaLocation}
extensions:
  graphql-markdown:
    layouts: ./my-layouts
    output: ./docs
`;

jest.mock(`fs`, () => {
  const vol = Volume.fromJSON({});
  vol.mkdirSync(process.cwd(), { recursive: true });
  vol.writeFileSync(".graphqlrc", graphqlrc);
  const fs = jest.requireActual("fs");
  return ufs.use(fs).use(vol as unknown as IFS);
});

describe("config", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("configuration", () => {
    it("loads schema location from GraphQL Config file", async () => {
      expect.hasAssertions();

      const configuration = (await import(configLib)).default;

      expect(configuration.schema).toBe(schemaLocation);
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

      expect(config.getConfigurationOption("layouts")).toBe("./layouts");
      expect(config.getConfigurationOption("output")).toBe("./output");
    });
  });

  describe("loadSchemaFromConfiguration", () => {
    it("loads graphql schema as DocumentNode from GraphQL Config file", async () => {
      expect.hasAssertions();

      const { loadSchemaFromConfiguration } = await import(configLib);
      const schema = loadSchemaFromConfiguration();

      expect(schema).toMatchSnapshot();
    });
  });
});
