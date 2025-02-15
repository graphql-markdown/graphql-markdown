import type {
  CliOptions,
  GraphQLMarkdownCliOptions,
} from "@graphql-markdown/types";

import { Command } from "commander";

import { generateDocFromSchema, buildConfig } from "@graphql-markdown/core";
import Logger from "@graphql-markdown/logger";

const COMMAND = "graphql-to-doc" as const;
const DESCRIPTION = "Generate GraphQL Schema Documentation" as const;
const DEFAULT_ID = "default" as const;

export const runGraphQLMarkdown = async (
  options: GraphQLMarkdownCliOptions,
  cliOptions: CliOptions,
  loggerModule?: string,
): Promise<void> => {
  const config = await buildConfig(options, cliOptions, options.id);
  await generateDocFromSchema({
    ...config,
    loggerModule,
  });
};

export default function GraphQLMarkdownCLI(
  options: GraphQLMarkdownCliOptions,
  loggerModule?: string,
): Command {
  void Logger(loggerModule);

  const isDefaultId = !options.id || options.id === DEFAULT_ID;

  const cmd = isDefaultId ? COMMAND : `${COMMAND}:${options.id}`;
  const description = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${options.id}`;

  const cli = new Command();

  return cli
    .command(cmd)
    .description(description)
    .option("-s, --schema <schema>", "Schema location")
    .option("-r, --root <rootPath>", "Root folder for doc generation")
    .option("-b, --base <baseURL>", "Base URL to be used by static generator")
    .option("-l, --link <linkRoot>", "Root for links in documentation")
    .option("-h, --homepage <homepage>", "File location for doc landing page")
    .option(
      "--hierarchy <hierarchy>",
      "Schema entity hierarchy: `api`, `entity`, `flat`",
    )
    .option("--noCode", "Disable code section for types")
    .option("--noExample", "Disable example section for types")
    .option("--noParentType", "Disable parent type name as field prefix")
    .option("--noRelatedType", "Disable related types sections")
    .option("--noTypeBadges", "Disable badges for types")
    .option("--index", "Enable generated index for categories")
    .option("-f, --force", "Force document generation")
    .option("-d, --diff <diffMethod>", "Set diff method")
    .option("-t, --tmp <tmpDir>", "Set temp dir for schema diff")
    .option(
      "--groupByDirective <@directive(field|=fallback)>",
      "Group documentation by directive",
    )
    .option(
      "--only <@directive...>",
      "Only print types with matching directive",
    )
    .option("--skip <@directive...>", "Skip types with matching directive")
    .option(
      "--deprecated <option>",
      "Option for printing deprecated entities: `default`, `group` or `skip`",
    )
    .option("--pretty", "Prettify generated files")
    .action(async (cliOptions: CliOptions) => {
      await runGraphQLMarkdown(options, cliOptions, loggerModule);
    });
}
