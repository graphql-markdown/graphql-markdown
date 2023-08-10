/* istanbul ignore file */
import type { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import type { CliOptions, ConfigOptions } from "@graphql-markdown/types";
import { generateDocFromSchema, buildConfig } from "@graphql-markdown/core";
import { Logger } from "@graphql-markdown/utils";

const NAME = "docusaurus-graphql-doc-generator" as const;
const COMMAND = "graphql-to-doc" as const;
const DESCRIPTION = "Generate GraphQL Schema Documentation" as const;
const DEFAULT_ID = "default" as const;

export default function pluginGraphQLDocGenerator(
  _: LoadContext,
  options: PluginOptions,
): Plugin {
  const loggerModule = require.resolve("@docusaurus/logger");
  Logger.setInstance(loggerModule);

  const isDefaultId = options.id === DEFAULT_ID;

  const command = isDefaultId ? COMMAND : `${COMMAND}:${options.id}`;
  const description = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${options.id}`;

  return {
    name: NAME,
    extendCli(cli): void {
      cli
        .command(command)
        .description(description)
        .option("-s, --schema <schema>", "Schema location")
        .option("-r, --root <rootPath>", "Root folder for doc generation")
        .option("-b, --base <baseURL>", "Base URL to be used by Docusaurus")
        .option("-l, --link <linkRoot>", "Root for links in documentation")
        .option(
          "-h, --homepage <homepage>",
          "File location for doc landing page",
        )
        .option("--noCode", "Disable code section for types")
        .option("--noPagination", "Disable page navigation buttons")
        .option("--noParentType", "Disable parent type name as field prefix")
        .option("--noRelatedType", "Disable related types sections")
        .option("--noToc", "Disable page table of content")
        .option("--noTypeBadges", "Disable badges for types")
        .option("--index", "Enable generated index for categories")
        .option("-f, --force", "Force document generation")
        .option("-d, --diff <diffMethod>", "Set diff method")
        .option("-t, --tmp <tmpDir>", "Set temp dir for schema diff")
        .option(
          "-gbd, --groupByDirective <@directive(field|=fallback)>",
          "Group documentation by directive",
        )
        .option("--skip <@directive...>", "Skip type with matching directive")
        .option(
          "--deprecated <option>",
          "Option for printing deprecated entities: `default`, `group` or `skip`",
        )
        .option("--pretty", "Prettify generated files")
        .action(async (cliOptions: CliOptions) => {
          const config = await buildConfig(
            options as ConfigOptions,
            cliOptions,
            options.id,
          );
          await generateDocFromSchema({
            ...config,
            loggerModule: loggerModule,
          });
        });
    },
  };
}
