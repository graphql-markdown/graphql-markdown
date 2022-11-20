/* istanbul ignore file */
import type { LoadContext } from "@docusaurus/types";
import type { Command } from "commander";

import { generateDocFromSchema } from "@graphql-markdown/core/generator";
import { buildConfig } from "@graphql-markdown/core/config";

const NAME: string = "docusaurus-graphql-doc-generator";
const COMMAND: string = "graphql-to-doc";
const DESCRIPTION: string = "Generate GraphQL Schema Documentation";
const DEFAULT_ID: string = "default";

export default async (_: LoadContext, configOptions: any) => {
  const isDefaultId: boolean = configOptions.id === DEFAULT_ID;

  const command: string = isDefaultId
    ? COMMAND
    : `${COMMAND}:${configOptions.id}`;
  const description: string = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${configOptions.id}`;

  return {
    name: NAME,
    extendCli(cli: Command) {
      cli
        .command(command)
        .description(description)
        .option("-s, --schema <schema>", "Schema location")
        .option("-r, --root <rootPath>", "Root folder for doc generation")
        .option("-b, --base <baseURL>", "Base URL to be used by Docusaurus")
        .option("-l, --link <linkRoot>", "Root for links in documentation")
        .option(
          "-h, --homepage <homepage>",
          "File location for doc landing page"
        )
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
          "Group documentation by directive"
        )
        .option("--skip <@directive>", "Skip type with matching directive")
        .option("--pretty", "Prettify generated files")
        .action(async (cliOptions) => {
          await generateDocFromSchema(
            await buildConfig(configOptions, cliOptions)
          );
        });
    },
  };
};
