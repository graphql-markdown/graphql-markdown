import path from "path";

import dirTree from "directory-tree";
import mock from "mock-fs";

import { generateDocFromSchema } from "../../../src/lib/generator";

describe("lib", () => {
  beforeEach(() => {
    mock(
      {
        __data__: mock.load(path.resolve(__dirname, "../../__data__")),
        assets: {
          "generated.md": "Dummy homepage for tweet.graphql",
        },
        // eslint-disable-next-line camelcase
        node_modules: mock.load(
          path.resolve(__dirname, "../../../node_modules")
        ),
        output: {},
        tmp: {},
      },
      { createCwd: true, createTmp: true }
    );
  });

  afterEach(() => {
    mock.restore();
  });

  describe("renderer", () => {
    describe("generateDocFromSchema()", () => {
      test("generates Markdown document structure from GraphQL schema", async () => {
        expect.hasAssertions();

        await generateDocFromSchema("__data__/tweet.graphql", {
          baseURL: "test",
          homepage: "generated.md",
          linkRoot: "test",
          rootPath: "test",
          schema: "test",
        });

        expect(dirTree("output")).toMatchSnapshot();
        expect(dirTree("tmp")).toMatchSnapshot();
      });
    });
  });
});
