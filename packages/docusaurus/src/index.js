/* istanbul ignore file */
const { generateDocFromSchema, config } = require("@graphql-markdown/core");
const { logger: Logger } = require("@graphql-markdown/utils");

const NAME = "docusaurus-graphql-doc-generator";
const COMMAND = "graphql-to-doc";
const DESCRIPTION = "Generate GraphQL Schema Documentation";
const DEFAULT_ID = "default";

// eslint-disable-next-line node/no-missing-require
const LOGGER_MODULE = require.resolve("@docusaurus/logger");

Logger.setInstance(LOGGER_MODULE);

module.exports = function pluginGraphQLDocGenerator(_, configOptions) {
  const isDefaultId = configOptions.id === DEFAULT_ID;

  const command = isDefaultId ? COMMAND : `${COMMAND}:${configOptions.id}`;
  const description = isDefaultId
    ? DESCRIPTION
    : `${DESCRIPTION} for configuration with id ${configOptions.id}`;

  return {
    name: NAME,
    extendCli(cli) {
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
        .action(async (cliOptions) => {
          const options = config.buildConfig(
            configOptions,
            cliOptions,
            configOptions.id,
          );
          await generateDocFromSchema({
            ...options,
            loggerModule: LOGGER_MODULE,
          });
        });
    },
  };
};
