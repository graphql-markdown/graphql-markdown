/* eslint-disable @typescript-eslint/no-require-imports */
// packages/cli/test/index.test.ts
import { getGraphQLMarkdownCli, runGraphQLMarkdown } from "../../src/index";

// Mock dependencies
jest.mock(
  "@graphql-markdown/core",
  () => {
    return {
      buildConfig: jest.fn().mockResolvedValue(undefined),
      generateDocFromSchema: jest.fn().mockResolvedValue(undefined),
    };
  },
  { virtual: true },
);

jest.mock("@graphql-markdown/logger", () => {
  return jest.fn().mockImplementation(() => {
    return {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
  });
});

jest.mock("graphql-config", () => {
  return {
    loadConfig: jest.fn().mockResolvedValue({
      getDefault: jest.fn().mockReturnValue({
        schema: "./schema.graphql",
        documents: "./src/**/*.graphql",
        extensions: {
          "graphql-markdown": {
            rootPath: "./docs",
            baseURL: "api",
          },
        },
      }),
    }),
  };
});

describe("CLI Module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGraphQLMarkdownCli", () => {
    test("returns a configured commander command", () => {
      const options = {
        schema: "./schema.graphql",
        rootPath: "./docs",
      };
      const loggerModule = "@docusaurus/logger";
      const mdxPackage = "@graphql-markdown/docusaurus/mdx";

      const command = getGraphQLMarkdownCli(options, loggerModule, mdxPackage);

      expect(command).toBeDefined();
    });
  });

  describe("runGraphQLMarkdown", () => {
    test("runs documentation generation with provided options", async () => {
      const options = {
        schema: "./schema.graphql",
        rootPath: "./docs",
      };
      const cliOptions = {};
      const loggerModule = "@docusaurus/logger";

      await runGraphQLMarkdown(options, cliOptions, loggerModule);

      expect(
        require("@graphql-markdown/core").generateDocFromSchema,
      ).toHaveBeenCalled();
    });

    test("handles errors during documentation generation", async () => {
      const error = new Error("Generation failed");
      require("@graphql-markdown/core").generateDocFromSchema.mockRejectedValueOnce(
        error,
      );

      const options = {
        schema: "./schema.graphql",
      };

      await expect(runGraphQLMarkdown(options, {})).rejects.toThrow(
        "Generation failed",
      );
    });
  });
});
