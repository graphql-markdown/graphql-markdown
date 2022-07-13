/* istanbul ignore file */
const { buildConfig } = require("./config.js");
const generateDocFromSchema = require("./lib/generator");

const NAME = "docusaurus-graphql-doc-generator";
const COMMAND = "graphql-to-doc";
const DESCRIPTION = "Generate GraphQL Schema Documentation";
const DEFAULT_ID = "default";

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
          "-a, --assets <assetsPath>",
          "Path for documentation assets (homepage, indexes)",
        )
        .option(
          "-h, --homepage <homepage>",
          "File location for doc landing page",
        )
        .option("--noPagination", "Disable page navigation buttons")
        .option("--noToc", "Disable page table of content")
        .option("--index", "Enable generated index for categories")
        .option("-f, --force", "Force document generation")
        .option("-d, --diff <diffMethod>", "Set diff method")
        .option("-t, --tmp <tmpDir>", "Set temp dir for schema diff")
        .option(
          "-gbd, --groupByDirective <@directive(field|=fallback)>",
          "Group documentation by directive",
        )
        .option("--pretty", "Prettify generated files")
        .action(async (cliOptions) => {
          await generateDocFromSchema(buildConfig(configOptions, cliOptions));
        });
    },
  };
};
