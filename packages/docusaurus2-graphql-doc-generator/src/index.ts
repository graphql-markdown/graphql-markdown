/* eslint-disable no-console */
/* istanbul ignore file */
import { hrtime } from "process";
import path from "path";

import type { LoadContext, Plugin } from "@docusaurus/types";

import { PluginOptions } from "./types";
import { generateDocFromSchema } from "./lib/generator";

const DEFAULT_OPTIONS: PluginOptions = {
  baseURL: "schema",
  homepage: path.join(__dirname, "../assets/", "generated.md"),
  linkRoot: "/",
  rootPath: "./docs",
  schema: "./schema.graphql",
};

const DEFAULT_PLUGIN_ID = "default";

const CONSOLE_CLI_COLOR = {
  BLUE: "\033[34m",
  GREEN: "\033[32m",
  RED: "\033[31m",
};

const generate = async (options: PluginOptions): Promise<void> => {
  const startTime = hrtime.bigint();

  const outputDir = path.join(options.rootPath, options.baseURL);

  const { pages, sidebar } = await generateDocFromSchema(options.schema, {
    ...options,
    rootPath: outputDir,
  });

  const endTime = hrtime.bigint();

  console.info(
    CONSOLE_CLI_COLOR.GREEN,
    `Documentation successfully generated in "${outputDir}" with base URL "${options.baseURL}".
`
  );

  console.log(
    CONSOLE_CLI_COLOR.BLUE,
    `${pages} pages generated in ${endTime - startTime}ms from schema "${
      options.schema
    }".
Remember to update your Docusaurus configuration with "${sidebar}".
`
  );
};

const pluginGraphQLDocGenerator = (
  context: LoadContext,
  options: PluginOptions
): Plugin<unknown> => {
  // Merge defaults with user-defined options.
  const configuration: PluginOptions = { ...DEFAULT_OPTIONS, ...options };

  const isDefaultPluginId =
    typeof options.id === "undefined" ? true : options.id === DEFAULT_PLUGIN_ID;

  const command = isDefaultPluginId
    ? "graphql-to-doc"
    : `graphql-to-doc:${options.id}`;
  const alias = isDefaultPluginId
    ? "graphql-to-markdown"
    : `graphql-to-markdown:${options.id}`;
  const commandDescription = isDefaultPluginId
    ? "Generate GraphQL Schema Documentation"
    : `Generate GraphQL Schema Documentation (${options.id})`;

  return {
    extendCli: (cli) => {
      cli
        .action(async (options) => {
          // eslint-disable-next-line no-return-await
          return await generate(options);
        })
        .alias(alias)
        .command(command)
        .description(commandDescription)
        .option(
          "-s, --schema <location>",
          "Schema location",
          configuration.schema
        )
        .option(
          "-r, --rootPath <path>",
          "Root folder for doc generation",
          configuration.rootPath
        )
        .option(
          "-b, --baseURL <path>",
          "Base URL to be used by Docusaurus",
          configuration.baseURL
        )
        .option(
          "-l, --linkRoot <path>",
          "Root for links in documentation",
          configuration.linkRoot
        )
        .option(
          "-h, --homepage <path>",
          "File location for doc landing page",
          configuration.homepage
        );
    },
    name: "docusaurus-graphql-doc-generator",
  };
};

export default pluginGraphQLDocGenerator;
