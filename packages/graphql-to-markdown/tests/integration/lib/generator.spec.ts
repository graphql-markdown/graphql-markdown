import * as path from "path";
import * as mock from "mock-fs";
import * as dirTree from "directory-tree";

import { generateDocFromSchema } from "../../../src/lib/generator";

describe("lib", () => {
  beforeEach(() => {
    mock({
      node_modules: mock.load(path.resolve(__dirname, "../../../node_modules")),
      __data__: mock.load(path.resolve(__dirname, "../../__data__")),
      output: {},
    });
  });

  afterEach(() => {
    mock.restore();
  });

  describe("renderer", () => {
    describe("generateDocFromSchema()", () => {
      test("generates Markdown document structure from GraphQL schema", async () => {
        expect.assertions(2);

        await generateDocFromSchema(
          "graphql",
          "__data__/tweet.graphql",
          "output",
          "docs",
          "SCHEMA-DIFF",
          "tmp",
        );

        expect(dirTree("output")).toMatchSnapshot();
        expect(dirTree("tmp")).toMatchSnapshot();
      });
    });
  });
});
