import type { LoadContext } from "@docusaurus/types";

import pluginGraphQLDocGenerator from "../../src/index";

jest.mock("@graphql-markdown/cli", () => {
  return {
    getGraphQLMarkdownCli: jest.fn(),
  };
});
import { getGraphQLMarkdownCli } from "@graphql-markdown/cli";

jest.mock("@graphql-markdown/logger", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
import Logger from "@graphql-markdown/logger";

describe("pluginGraphQLDocGenerator", () => {
  const mockCli = {
    addCommand: jest.fn(),
  } as any;

  const mockOptions = {
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

    test("passes sectionHeaderId through docOptions", async () => {
      const optionsWithSectionHeaderId = {
        docOptions: {
          frontMatter: { draft: true },
          sectionHeaderId: false,
        },
      };
      const plugin = await pluginGraphQLDocGenerator(
        {} as LoadContext,
        optionsWithSectionHeaderId,
      );
      plugin.extendCli!(mockCli);
      expect(getGraphQLMarkdownCli).toHaveBeenCalledWith(
        expect.objectContaining({
          docOptions: {
            frontMatter: { draft: true },
            generatorFrameworkName: "docusaurus",
            generatorFrameworkVersion: expect.any(String),
            sectionHeaderId: false,
          },
        }),
        "@docusaurus/logger",
        "@graphql-markdown/docusaurus/mdx",
      );
    });
  });
});
