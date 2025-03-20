#!/usr/bin/env node

import type {
  ConfigOptions,
  GraphQLExtensionDeclaration,
} from "@graphql-markdown/types";

import { Command } from "commander";
import { loadConfig } from "graphql-config";

import { getGraphQLMarkdownCli } from ".";

export const EXTENSION_NAME = "graphql-markdown" as const;
export const graphQLConfigExtension: GraphQLExtensionDeclaration = () => {
  return { name: EXTENSION_NAME } as GraphQLExtensionDeclaration;
};

void (async (): Promise<void> => {
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
    const cmd = getGraphQLMarkdownCli(
      {
        id: project,
      } as unknown as ConfigOptions,
      undefined,
      true,
    );
    program.addCommand(cmd);
  }

  await program.parseAsync(process.argv);
})();
