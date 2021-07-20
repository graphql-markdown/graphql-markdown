/* istanbul ignore file */
import path from "path";
import { hrtime } from "process";

import chalk from "chalk";

import { generateDocFromSchema } from "./lib/generator";

const DEFAULT_OPTIONS = {
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: path.join(__dirname, "../assets/", "generated.md"),
};

const actionGenerateDocs = async (options) => {
  const startTime = hrtime.bigint();

  const outputDir = path.join(options.root, baseURL);

  const { pages, sidebar } = await generateDocFromSchema(options.schema, {
    baseURL: options.base,
    outputDir,
    linkRoot: options.link,
    homepage: options.homepage,
  });

  const endTime = hrtime.bigint();
  const duration = ((endTime - startTime) / 1e9).toFixed(3);

  console.info(
    chalk.green(`
Documentation successfully generated in "${outputDir}" with base URL "${options.base}".
`)
  );

  console.log(
    chalk.blue(`
${pages} pages generated in ${duration}s from schema "${options.schema}".
Remember to update your Docusaurus configuration with "${sidebar}".
`)
  );

  const pluginGraphQLDocGenerator = (context, options) => {
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
            "-r, --root <rootPath>",
            "Root folder for doc generation",
            configuration.rootPath
          )
          .option(
            "-b, --base <baseURL>",
            "Base URL to be used by Docusaurus",
            configuration.baseURL
          )
          .option(
            "-l, --link <linkRoot>",
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

  module.exports = pluginGraphQLDocGenerator;
};
