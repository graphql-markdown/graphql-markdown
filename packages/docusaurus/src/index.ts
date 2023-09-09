/* istanbul ignore file */
import type { LoadedContent } from "@docusaurus/plugin-content-docs";
import type { LoadContext, Plugin } from "@docusaurus/types";

import type { CliOptions, ConfigOptions } from "@graphql-markdown/types";
import { generateDocFromSchema, buildConfig } from "@graphql-markdown/core";
import { Logger } from "@graphql-markdown/logger";

import type { Options } from "./options";
import { pluginContentDocs } from "./plugin-content-docs";
import { DEFAULT_ID } from "./options";

const NAME = "docusaurus-graphql-doc-generator" as const;
const COMMAND = "graphql-to-doc" as const;
const DESCRIPTION = "Generate GraphQL Schema Documentation" as const;
Logger(require.resolve("@docusaurus/logger"));

export default async function pluginGraphQLMarkdown(
  context: LoadContext,
  options: Options,
): Promise<Plugin<LoadedContent>> {
  const pluginId = options.id;

  // console.dir(options);

  const command = pluginId === DEFAULT_ID ? COMMAND : `${COMMAND}:${pluginId}`;
  const description =
    pluginId === DEFAULT_ID ? DESCRIPTION : `${DESCRIPTION} (${pluginId})`;

  const docsPluginInstance = (await pluginContentDocs(
    context,
    options,
  )) as Plugin<LoadedContent>;

  const loadContent = async (
    cliOptions?: CliOptions,
  ): Promise<LoadedContent> => {
    if (options.runOnBuild === false && !cliOptions) {
      console.log("SKIPPY");
      return { loadedVersions: [] };
    }

    const config = await buildConfig(
      options as ConfigOptions,
      cliOptions,
      pluginId,
    );
    await generateDocFromSchema({
      ...config,
    });

    const content = (await docsPluginInstance.loadContent!()) as LoadedContent;
    return content;
  };

  return {
    ...docsPluginInstance,

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
          await loadContent(cliOptions);
        });
    },

    loadContent,
  } as Plugin<LoadedContent>;
}

export { validateOptions } from "./options";
