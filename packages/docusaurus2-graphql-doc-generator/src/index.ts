/* istanbul ignore file */
import path from "path";
import { hrtime } from "process";

import chalk from "chalk";

import { generateDocFromSchema } from "./lib/generator";
import { PluginOptions } from "./type";

import type { LoadContext, Plugin } from "@docusaurus/types";

const DEFAULT_OPTIONS: PluginOptions = {
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: path.join(__dirname, "../assets/", "generated.md"),
};

const actionGenerateDocs = async (options: PluginOptions): Promise<void> => {
  const startTime = hrtime.bigint();

  const outputDir = path.join(options.rootPath, options.baseURL);

  const { pages, sidebar } = await generateDocFromSchema(options.schema, options);

  const endTime = hrtime.bigint();

  console.info(
    chalk.green(`
Documentation successfully generated in "${outputDir}" with base URL "${options.baseURL}".
`)
  );

  console.log(
    chalk.blue(`
${pages} pages generated in ${endTime - startTime}ms from schema "${
      options.schema
    }".
Remember to update your Docusaurus configuration with "${sidebar}".
`)
  );
};

const pluginGraphQLDocGenerator = (context: LoadContext, options: PluginOptions): Plugin => {
  // Merge defaults with user-defined options.
  const configuration = { ...DEFAULT_OPTIONS, ...options };
  return {
    name: "docusaurus-graphql-doc-generator",

    extendCli: (cli) => {
      cli
        .command("graphql-to-doc")
        .option(
          "-s, --schema <schema>",
          "Schema location",
          configuration.schema
        )
        .option(
          "-r, --rootPath <rootPath>",
          "Root folder for doc generation",
          configuration.rootPath
        )
        .option(
          "-b, --baseURL <baseURL>",
          "Base URL to be used by Docusaurus",
          configuration.baseURL
        )
        .option(
          "-l, --linkRoot <linkRoot>",
          "Root for links in documentation",
          configuration.linkRoot
        )
        .option(
          "-h, --homepage <homepage>",
          "File location for doc landing page",
          configuration.homepage
        )
        .description("Generate GraphQL Schema Documentation")
        .action(actionGenerateDocs);
    },
  };
};

export default pluginGraphQLDocGenerator;
