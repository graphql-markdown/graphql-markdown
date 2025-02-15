#!/usr/bin/env node

import type {
  ConfigOptions,
  GraphQLExtensionDeclaration,
} from "@graphql-markdown/types";

import { Command } from "commander";
import { loadConfig } from "graphql-config";
import GraphQLDocCLI from "./cli";

// import { version } from "../package.json";

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
  // program.version(version)
  for (const project of Object.keys(config!.projects)) {
    const cmd = await GraphQLDocCLI(new Command(), undefined, {
      id: project,
    } as unknown as ConfigOptions);
    program.addCommand(cmd);
  }
  await program.parseAsync(process.argv);
})();
