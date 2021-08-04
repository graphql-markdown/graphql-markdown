jest.mock("fs");

import path from "path";
import { promises as fs } from "fs";

import { Configuration } from "../src/lib/config";

const schemaLocation = "tweet.graphql"

const graphqlrc = `---
schema: ${schemaLocation}
extensions:
  graphql-markdown:
    layouts: ./my-layouts
    output: ./docs
`;

describe("config", () => {
  beforeEach(async () => {
    await fs.writeFile(".graphqlrc", graphqlrc);
    
    const data = jest.requireActual("fs").readFileSync(path.resolve(__dirname, `__data__/schema/${schemaLocation}`))
    await fs.writeFile(schemaLocation, data);
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

        await fs.writeFile(".graphqlrc", `schema: ${schemaLocation}`);
        await Configuration.load();

        expect(Configuration.project).toBeDefined();
        expect(Configuration.extension).toBeDefined();
        expect(Configuration.get("layouts")).toBe("./layouts");
        expect(Configuration.get("output")).toBe("./output");
      });
    });

    describe.only("schema", () => {
      it("loads graphql schema as DocumentNode from GraphQL Config file", async () => {
        expect.hasAssertions();

        await Configuration.load();
        const schema = await Configuration.schema();
        expect(schema).toMatchSnapshot();
      });
    });
  });
});
