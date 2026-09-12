/**
 * Docusaurus integration for running GraphQL-Markdown and wiring CLI commands.
 *
 * @packageDocumentation
 */
/* istanbul ignore file */
import type { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import type { GraphQLMarkdownCliOptions } from "@graphql-markdown/types";

import { DOCUSAURUS_VERSION } from "@docusaurus/utils";

import { getGraphQLMarkdownCli } from "@graphql-markdown/cli";
import Logger from "@graphql-markdown/logger";

const NAME = "docusaurus-graphql-doc-generator" as const;
const LOGGER_MODULE = "@docusaurus/logger" as const;
const MDX_PACKAGE = "@graphql-markdown/docusaurus/mdx" as const;

/**
 * Minimal shape `extendCli`'s CLI command must satisfy at runtime.
 *
 * \@graphql-markdown/cli builds its command with commander v15, while
 * \@docusaurus/types types `extendCli`'s parameter with commander v5's
 * `Command`. The two are structurally compatible at runtime, but not
 * assignable under TypeScript due to dual-version resolution — this type
 * (and the guard below) narrows the unsafe cast to a single checked field.
 */
interface CommanderCompatibleCommand {
  name: () => string;
}

const isCommanderCompatibleCommand = (
  value: unknown,
): value is CommanderCompatibleCommand => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { name?: unknown }).name === "function"
  );
};

const assertCommanderCompatibleCommand: (
  value: unknown,
) => asserts value is CommanderCompatibleCommand = (value) => {
  if (!isCommanderCompatibleCommand(value)) {
    throw new TypeError(
      "GraphQL-Markdown CLI command is not compatible with Docusaurus commander interface.",
    );
  }
};

/**
 * Docusaurus plugin wrapper that wires GraphQL-Markdown into the build,
 * optionally running the CLI during `docusaurus build` and registering
 * the `graphql-to-doc` command on the local CLI.
 *
 * @param _ - Load context (unused).
 * @param options - GraphQL-Markdown CLI options plus Docusaurus plugin options.
 * @returns A configured Docusaurus plugin instance.
 */
export default async function pluginGraphQLDocGenerator(
  _: LoadContext,
  options: GraphQLMarkdownCliOptions & Partial<PluginOptions>,
): Promise<Plugin> {
  await Logger(LOGGER_MODULE);

  return {
    name: NAME,

    /**
     * Extends Docusaurus CLI with GraphQL Documentation generator command.
     * This method adds a custom command to generate GraphQL documentation
     * using the configured options.
     *
     * @param cli - The Docusaurus CLI instance to extend
     * @returns void
     */
    extendCli(cli): void {
      const command = getGraphQLMarkdownCli(
        {
          ...options,
          docOptions: {
            generatorFrameworkName: "docusaurus",
            generatorFrameworkVersion: DOCUSAURUS_VERSION,
            ...options.docOptions,
          },
        },
        LOGGER_MODULE,
        options.formatter ?? MDX_PACKAGE,
      );
      assertCommanderCompatibleCommand(command);
      cli.addCommand(
        command as unknown as Parameters<typeof cli.addCommand>[0],
      );
    },
  };
}

export { createMDXFormatter } from "./mdx";
