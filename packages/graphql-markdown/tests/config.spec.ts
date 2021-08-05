import { promises as fs } from "fs";

import { Configuration } from "../src/lib/config";

const schemaLocation = `packages/graphql-markdown/tests/__data__/schema/tweet.graphql`;

describe("config", () => {
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

      it.skip("returns default options if not set in GraphQL Config file", async () => {
        expect.hasAssertions();
        // this should use mock fs
        await fs.writeFile(".graphqlrc", `schema: ${schemaLocation}`);
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
