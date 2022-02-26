/* istanbul ignore file */
const generateDocFromSchema = require("./lib/generator");
const path = require("path");
const os = require("os");
const { pluginConfigs } = require("./utils/helpers/other.js");
const { mergeConfigWithCLIOptions } = require("./utils/helpers/other.js");

const DEFAULT_OPTIONS = {
  schema: "./schema.graphl",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: path.join(__dirname, "../assets/", "generated.md"),
  diffMethod: "SCHEMA-DIFF",
  tmpDir: path.join(os.tmpdir(), "@edno/docusaurus2-graphql-doc-generator"),
  loaders: {},
  pretty: false,
};

module.exports = function pluginGraphQLDocGenerator(context, opts) {
  // Merge defaults with user-defined options in config file.
  pluginConfigs.push({ ...DEFAULT_OPTIONS, ...opts });

  return {
    name: "docusaurus-graphql-doc-generator",

    extendCli(cli) {
      cli
        .command("graphql-to-doc")
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
        .description("Generate GraphQL Schema Documentation")
        .action(async (options) => {
          for (const config of pluginConfigs) {
            await generateDocFromSchema(
              mergeConfigWithCLIOptions(config, options),
            );
          }
        });
    },
  };
};
