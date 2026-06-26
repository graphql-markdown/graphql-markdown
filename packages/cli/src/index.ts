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

// Commander v15 is ESM-only; this package requires Node.js >=22.12.0 which
// supports synchronous require(esm) natively. TypeScript's node16 module mode
// does not model this capability, so the error is suppressed intentionally.
// @ts-expect-error TS1378
import { Command } from "commander";

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
export type GraphQLMarkdownCliType = Command;

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
  await Logger(loggerModule);
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
 * @param customFormatter - Optional default formatter package name. When provided, registers
 *   `--formatter` and `--mdxParser` (deprecated) flags with this value as the default.
 *
 * @returns The configured CLI instance.
 *
 * @example
 * ```typescript
 * const cli = getGraphQLMarkdownCli(
 *   { id: "custom" },
 *   "custom-logger",
 *   "@graphql-markdown/formatters/docusaurus"
 * );
 * await cli.parseAsync(process.argv);
 * ```
 */
export const getGraphQLMarkdownCli = (
  options: GraphQLMarkdownCliOptions,
  loggerModule?: string,
  customFormatter?: string,
): GraphQLMarkdownCliType => {
  // Initialize logger asynchronously without blocking - non-critical operation
  Logger(loggerModule).catch((error: Error) => {
    // Logger initialization failure is non-critical, ignore it
    /* istanbul ignore next */
    console.debug("Warning: Logger initialization failed:", error);
  });

  const isDefaultId =
    !("id" in options) || ("id" in options && options.id === DEFAULT_ID);

  const cmd = isDefaultId ? COMMAND : `${COMMAND}:${options.id}`;
  const description = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${options.id}`;

  const command = new Command(cmd)
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
    .option("--noParentType", "Disable parent type name as field prefix")
    .option("--noTypeBadges", "Disable badges for types")
    .option("--noSectionId", "Disable custom section header IDs for permalinks")
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

  if (typeof customFormatter === "string") {
    command
      .option(
        "--formatter <formatter>",
        "Set formatter package",
        customFormatter,
      )
      .option(
        "--mdxParser <mdxParser>",
        "[deprecated] Use --formatter instead",
      );
  }

  command.action(async (cliOptions: CliOptions) => {
    await runGraphQLMarkdown(options, cliOptions, loggerModule);
  });

  // When used as a subcommand of an older commander version (e.g. Docusaurus
  // v2/v3 ship commander v5), _checkForConflictingOptions walks the ancestor
  // chain via _getCommandAndAncestors and calls _checkForConflictingLocalOptions
  // on each node. Ancestors from commander v5 do not have that method, causing
  // a TypeError at parse time. Override to guard the walk.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (command as any)._checkForConflictingOptions = function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (let cmd: any = this; cmd; cmd = cmd.parent) {
      if (typeof cmd._checkForConflictingLocalOptions === "function") {
        cmd._checkForConflictingLocalOptions();
      }
    }
  };

  return command;
};
