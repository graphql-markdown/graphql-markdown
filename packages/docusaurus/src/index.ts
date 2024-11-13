/* istanbul ignore file */
import type { LoadContext, Plugin, PluginOptions } from "@docusaurus/types";
import type {
  CliOptions,
  ConfigOptions,
  ExperimentalConfigOptions,
} from "@graphql-markdown/types";
import { generateDocFromSchema, buildConfig } from "@graphql-markdown/core";
import Logger from "@graphql-markdown/logger";

const NAME = "docusaurus-graphql-doc-generator" as const;
const COMMAND = "graphql-to-doc" as const;
const DESCRIPTION = "Generate GraphQL Schema Documentation" as const;
const DEFAULT_ID = "default" as const;
const LOGGER_MODULE = "@docusaurus/logger" as const;

export default async function pluginGraphQLDocGenerator(
  _: LoadContext,
  options: ConfigOptions & ExperimentalConfigOptions & Partial<PluginOptions>,
): Promise<Plugin> {
  await Logger(LOGGER_MODULE);

  const isDefaultId = options.id === DEFAULT_ID;

  const command = isDefaultId ? COMMAND : `${COMMAND}:${options.id}`;
  const description = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${options.id}`;

  return {
    name: NAME,

    async loadContent(): Promise<void> {
      if (options.runOnBuild !== true) {
        return;
      }
      const config = await buildConfig(options, {}, options.id);
      await generateDocFromSchema({
        ...config,
        loggerModule: LOGGER_MODULE,
      });
    },

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
          "-gbd, --groupByDirective <@directive(field|=fallback)>",
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
        // DEPRECATED options
        .option("--noToc", "Disable page table of content [DEPRECATED]")
        .option(
          "--noPagination",
          "Disable page navigation buttons [DEPRECATED]",
        )
        .option("--noApiGroup", "Disable API grouping for types [DEPRECATED]")
        .action(async (cliOptions: CliOptions) => {
          const config = await buildConfig(options, cliOptions, options.id);
          await generateDocFromSchema({
            ...config,
            loggerModule: LOGGER_MODULE,
          });
        });
    },
  };
}
