/**
 * This module provides the CLI functionality for generating documentation from GraphQL schemas.
 * It exports utilities to run the documentation generator both programmatically and via CLI.
 *
 * @module cli
 * @see {@link https://graphql-markdown.dev | GraphQL Markdown Documentation}
 */

import type {
  CliOptions,
  GraphQLMarkdownCliOptions,
} from "@graphql-markdown/types";

import type { CommanderStatic } from "commander";
import Commander from "commander";

import { generateDocFromSchema, buildConfig } from "@graphql-markdown/core";
import Logger from "@graphql-markdown/logger";

const COMMAND = "graphql-to-doc" as const;
const DESCRIPTION = "Generate GraphQL Schema Documentation" as const;
const DEFAULT_ID = "default" as const;

/**
 * Type representing the GraphQL Markdown CLI.
 *
 * @see {@link https://graphql-markdown.dev | GraphQL Markdown Documentation}
 */
export type GraphQLMarkdownCliType = CommanderStatic;

/**
 * Runs the GraphQL Markdown CLI to generate documentation from a GraphQL schema.
 *
 * @param options - Options for configuring the GraphQL Markdown CLI.
 * @param cliOptions - Command-line options passed to the CLI.
 * @param loggerModule - Optional logger module to use.
 *
 * @example
 * ```typescript
 * await runGraphQLMarkdown(
 *   { id: "custom" },
 *   { schema: "./schema.graphql", root: "./docs" },
 *   "custom-logger"
 * );
 * ```
 */
export const runGraphQLMarkdown = async (
  options: GraphQLMarkdownCliOptions,
  cliOptions: CliOptions,
  loggerModule?: string,
): Promise<void> => {
  const config = await buildConfig(options, cliOptions, options.id);

  if (cliOptions.config) {
    console.dir(config, { depth: null });
    return;
  }

  await generateDocFromSchema({
    ...config,
    loggerModule,
  });
};

/**
 * Configures and returns the GraphQL Markdown CLI.
 *
 * @param options - Options for configuring the GraphQL Markdown CLI.
 * @param loggerModule - Optional logger module to use.
 * @param customMdxParser - Optional MDX parser configuration.
 *
 * @returns The configured CLI instance.
 *
 * @example
 * ```typescript
 * const cli = getGraphQLMarkdownCli(
 *   { id: "custom" },
 *   "custom-logger",
 *   true
 * );
 * await cli.parseAsync(process.argv);
 * ```
 */
export const getGraphQLMarkdownCli = (
  options: GraphQLMarkdownCliOptions,
  loggerModule?: string,
  customMdxParser?: boolean | string,
): GraphQLMarkdownCliType => {
  void Logger(loggerModule);

  const isDefaultId =
    typeof options === "undefined" ||
    !("id" in options) ||
    ("id" in options && options.id === DEFAULT_ID);

  const cmd = isDefaultId ? COMMAND : `${COMMAND}:${options.id}`;
  const description = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${options.id}`;

  const cli: GraphQLMarkdownCliType = Commander;

  const command = cli
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
    .option("--config", "Print configuration (for debugging)");

  // allows passing the mdx package to the CLI
  if (customMdxParser === true || typeof customMdxParser === "string") {
    command.option(
      "--mdxParser <mdxParser>",
      "Set MDX package processor",
      typeof customMdxParser === "string" ? customMdxParser : undefined,
    );
  }

  command.action(async (cliOptions: CliOptions) => {
    await runGraphQLMarkdown(options, cliOptions, loggerModule);
  }) as GraphQLMarkdownCliType;

  return command as CommanderStatic;
};
