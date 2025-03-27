/* istanbul ignore file */
import type { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import type { GraphQLMarkdownCliOptions } from "@graphql-markdown/types";

import { DOCUSAURUS_VERSION } from "@docusaurus/utils";

import {
  getGraphQLMarkdownCli,
  runGraphQLMarkdown,
} from "@graphql-markdown/cli";
import Logger from "@graphql-markdown/logger";

const NAME = "docusaurus-graphql-doc-generator" as const;
const LOGGER_MODULE = "@docusaurus/logger" as const;
const MDX_PACKAGE = "@graphql-markdown/docusaurus/mdx" as const;

/**
 *
 */
export default async function pluginGraphQLDocGenerator(
  _: LoadContext,
  options: GraphQLMarkdownCliOptions & Partial<PluginOptions>,
): Promise<Plugin> {
  await Logger(LOGGER_MODULE);

  return {
    name: NAME,

    async loadContent(): Promise<void> {
      if (options.runOnBuild !== true) {
        return;
      }
      await runGraphQLMarkdown(options, {}, LOGGER_MODULE);
    },

    extendCli(cli): void {
      cli.addCommand(
        getGraphQLMarkdownCli(
          {
            ...options,
            docOptions: {
              generatorFrameworkName: "docusaurus",
              generatorFrameworkVersion: DOCUSAURUS_VERSION,
            },
          },
          LOGGER_MODULE,
          MDX_PACKAGE,
        ),
      );
    },
  };
}
