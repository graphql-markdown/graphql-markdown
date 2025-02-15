#!/usr/bin/env node

import type {
  ConfigOptions,
  GraphQLExtensionDeclaration,
} from "@graphql-markdown/types";

import { Command } from "commander";
import { loadConfig } from "graphql-config";

import GraphQLMarkdownCLI from "./cli";

export const EXTENSION_NAME = "graphql-markdown" as const;
export const graphQLConfigExtension: GraphQLExtensionDeclaration = () => {
  return { name: EXTENSION_NAME } as const;
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
    const cmd = GraphQLMarkdownCLI({
      id: project,
    } as unknown as ConfigOptions);
    program.addCommand(cmd);
  }

  program.showHelpAfterError(true);

  await program.parseAsync(process.argv);
})();
