#!/usr/bin/env node

/* istanbul ignore file */

/**
 * Entry point for the GraphQL Markdown CLI.
 * Loads configuration from graphql-config and sets up command-line interface.
 * @module
 */

import type { GraphQLExtensionDeclaration } from "@graphql-markdown/types";

// Commander v15 is ESM-only; requires Node.js >=22.12.0 for synchronous require(esm).
// @ts-expect-error TS1479
import { Command } from "commander";
import { loadConfig } from "graphql-config";

import { getGraphQLMarkdownCli } from ".";
import { getSwizzleCommand } from "./swizzle-command";
import { getTelemetryCommand } from "./telemetry-command";

/**
 * Name of the GraphQL Markdown extension for graphql-config
 */
export const EXTENSION_NAME = "graphql-markdown" as const;

/**
 * GraphQL config extension declaration for GraphQL Markdown
 * @returns Extension configuration object
 */
export const graphQLConfigExtension: GraphQLExtensionDeclaration = () => {
  return { name: EXTENSION_NAME } as GraphQLExtensionDeclaration;
};

/**
 * Commands that do not need a graphql-config file.
 */
const STANDALONE_COMMANDS = ["swizzle", "telemetry"] as const;

void (async (): Promise<void> => /* NOSONAR */ {
  const program = new Command();

  const isStandalone = (STANDALONE_COMMANDS as readonly string[]).includes(
    process.argv[2],
  );

  if (!isStandalone) {
    const config = await loadConfig({
      extensions: [graphQLConfigExtension],
      throwOnMissing: true,
      throwOnEmpty: true,
    });

    const projects = config?.projects
      ? Object.keys(config.projects)
      : ["default"];
    // build commands for each project declared in graphql-config file
    for (const project of projects) {
      const cmd = getGraphQLMarkdownCli({ id: project }, undefined, undefined, {
        trigger: "cli",
      });
      program.addCommand(cmd);
    }
  }
  program.addCommand(getSwizzleCommand());
  program.addCommand(getTelemetryCommand());

  await program.parseAsync(process.argv);
})();
