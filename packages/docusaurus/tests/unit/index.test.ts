import type { LoadContext } from "@docusaurus/types";

import pluginGraphQLDocGenerator from "../../src/index";

jest.mock("@graphql-markdown/cli", () => {
  return {
    getGraphQLMarkdownCli: jest.fn(),
    runGraphQLMarkdown: jest.fn(),
  };
});
import {
  getGraphQLMarkdownCli,
  runGraphQLMarkdown,
} from "@graphql-markdown/cli";

jest.mock("@graphql-markdown/logger", () => {
  return jest.fn();
});
import Logger from "@graphql-markdown/logger";

describe("pluginGraphQLDocGenerator", () => {
  const mockCli = {
    addCommand: jest.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  const mockOptions = {
    runOnBuild: true,
    someOtherOption: "value",
    docOptions: { frontMatter: { draft: true } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls Logger with LOGGER_MODULE", async () => {
    await pluginGraphQLDocGenerator({} as LoadContext, mockOptions);
    expect(Logger).toHaveBeenCalledWith("@docusaurus/logger");
  });

  test("returns a plugin object with the correct name", async () => {
    const plugin = await pluginGraphQLDocGenerator(
      {} as LoadContext,
      mockOptions,
    );
    expect(plugin.name).toBe("docusaurus-graphql-doc-generator");
  });

  describe("loadContent", () => {
    test("does not call runGraphQLMarkdown if runOnBuild is false", async () => {
      const plugin = await pluginGraphQLDocGenerator({} as LoadContext, {
        runOnBuild: false,
      });
      await plugin.loadContent!();
      expect(runGraphQLMarkdown).not.toHaveBeenCalled();
    });

    test("calls runGraphQLMarkdown if runOnBuild is true", async () => {
      const plugin = await pluginGraphQLDocGenerator(
        {} as LoadContext,
        mockOptions,
      );
      await plugin.loadContent!();
      expect(runGraphQLMarkdown).toHaveBeenCalledWith(
        mockOptions,
        {},
        "@docusaurus/logger",
      );
    });
  });

  describe("extendCli", () => {
    test("adds a command to the CLI", async () => {
      const plugin = await pluginGraphQLDocGenerator(
        {} as LoadContext,
        mockOptions,
      );
      plugin.extendCli!(mockCli);
      expect(mockCli.addCommand).toHaveBeenCalled();
      expect(getGraphQLMarkdownCli).toHaveBeenCalledWith(
        expect.objectContaining({
          docOptions: {
            frontMatter: { draft: true },
            generatorFrameworkName: "docusaurus",
            generatorFrameworkVersion: expect.any(String),
          },
        }),
        "@docusaurus/logger",
        "@graphql-markdown/docusaurus/mdx",
      );
    });

    test("passes categorySort through docOptions", async () => {
      const optionsWithCategorySort = {
        runOnBuild: false,
        docOptions: {
          frontMatter: { draft: true },
          categorySort: "natural" as const,
        },
      };
      const plugin = await pluginGraphQLDocGenerator(
        {} as LoadContext,
        optionsWithCategorySort,
      );
      plugin.extendCli!(mockCli);
      expect(getGraphQLMarkdownCli).toHaveBeenCalledWith(
        expect.objectContaining({
          docOptions: {
            categorySort: "natural",
            frontMatter: { draft: true },
            generatorFrameworkName: "docusaurus",
            generatorFrameworkVersion: expect.any(String),
          },
        }),
        "@docusaurus/logger",
        "@graphql-markdown/docusaurus/mdx",
      );
    });
  });
});
