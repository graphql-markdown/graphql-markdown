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

void (async (): Promise<void> => /* NOSONAR */ {
  const config = await loadConfig({
    extensions: [graphQLConfigExtension],
    throwOnMissing: true,
    throwOnEmpty: true,
  });

  const program = new Command();

  const projects = config?.projects
    ? Object.keys(config.projects)
    : ["default"];
  // build commands for each project declared in graphql-config file
  for (const project of projects) {
    const cmd = getGraphQLMarkdownCli({ id: project });
    program.addCommand(cmd);
  }

  await program.parseAsync(process.argv);
})();
