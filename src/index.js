/* istanbul ignore file */
const generateDocFromSchema = require("./lib/generator");
const { buildConfig } = require("./config.js");

module.exports = function pluginGraphQLDocGenerator(context, opts) {
  const isDefaultId = opts.id === "default";

  const command = isDefaultId ? "graphql-to-doc" : `graphql-to-doc:${opts.id}`;
  const description = isDefaultId
    ? "Generate GraphQL Schema Documentation"
    : `Generate GraphQL Schema Documentation for configuration with id ${opts.id}`;

  return {
    name: "docusaurus-graphql-doc-generator",

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
        .option("-f, --force", "Force document generation")
        .option("-d, --diff <diffMethod>", "Set diff method")
        .option("-t, --tmp <tmpDir>", "Set temp dir for schema diff")
        .option(
          "-gbd, --groupByDirective <@directive(field|=fallback)>",
          "Group Documentation By Directive",
        )
        .option("--pretty", "Prettify generated files")
        .action(async (options) => {
          await generateDocFromSchema(buildConfig(opts, options));
        });
    },
  };
};
