import { promises as fs } from "fs";

import { Configuration } from "../src/lib/config";

const schemaLocation = `packages/graphql-markdown/tests/__data__/schema/tweet.graphql`;

describe("config", () => {
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

      // eslint-disable-next-line jest/no-disabled-tests
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

      it("returns local options if set in GraphQL load options", async () => {
        expect.hasAssertions();

        await Configuration.load({
          markdownConfig: { layouts: "custom/layouts", output: "docs" },
        });

        expect(Configuration.project).toBeDefined();
        expect(Configuration.extension).toBeDefined();
        expect(Configuration.get("layouts")).toBe("custom/layouts");
        expect(Configuration.get("output")).toBe("docs");
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
