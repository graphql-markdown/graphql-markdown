jest.mock("fs");

import fs from "fs";

import { Configuration } from "../src/lib/config";

const schemaLocation = require.resolve("./__data__/schema/tweet.graphql");

const graphqlrc = `---
schema: ${schemaLocation}
extensions:
  graphql-markdown:
    layouts: ./my-layouts
    output: ./docs
`;

describe("config", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(".graphqlrc", graphqlrc);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("Configuration", () => {
    describe("load", () => {
      it("loads schema location from GraphQL Config file", async () => {
        expect.hasAssertions();

        await Configuration.load();

        expect(Configuration.project).toBeDefined();
        expect(Configuration.project?.schema).toBe(schemaLocation);
      });
    });

    describe("get", () => {
      it("loads graphql-markdown options from GraphQL Config file", async () => {
        expect.hasAssertions();

        await Configuration.load();

        expect(Configuration.extension).toBeDefined();
        expect(Configuration.get("layouts")).toBe("./my-layouts");
      });

      it("returns default options if not set in GraphQL Config file", async () => {
        expect.hasAssertions();

        await fs.promises.writeFile(".graphqlrc", `schema: ${schemaLocation}`);
        await Configuration.load();

        expect(Configuration.project).toBeDefined();
        expect(Configuration.extension).toBeDefined();
        expect(Configuration.get("layouts")).toBe("./layouts");
        expect(Configuration.get("output")).toBe("./output");
      });
    });

    describe("schema", () => {
      it("loads graphql schema as DocumentNode from GraphQL Config file", async () => {
        expect.hasAssertions();

        await Configuration.load();
        const schema = await Configuration.schema();

        expect(schema).toMatchSnapshot();
      });
    });
  });
});
