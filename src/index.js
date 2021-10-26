/* istanbul ignore file */
const generateDocFromSchema = require("./lib/generator");
const path = require("path");
const os = require("os");

const DEFAULT_OPTIONS = {
  schema: "./schema.graphl",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: path.join(__dirname, "../assets/", "generated.md"),
  diffMethod: "SCHEMA-DIFF",
  tmpDir: path.join(os.tmpdir(), "@edno/docusaurus2-graphql-doc-generator"),
  loaders: {},
};

module.exports = function pluginGraphQLDocGenerator(context, opts) {
  // Merge defaults with user-defined options.
  const config = { ...DEFAULT_OPTIONS, ...opts };

  return {
    name: "docusaurus-graphql-doc-generator",

    extendCli(cli) {
      cli
        .command("graphql-to-doc")
        .option("-s, --schema <schema>", "Schema location", config.schema)
        .option(
          "-r, --root <rootPath>",
          "Root folder for doc generation",
          config.rootPath,
        )
        .option(
          "-b, --base <baseURL>",
          "Base URL to be used by Docusaurus",
          config.baseURL,
        )
        .option(
          "-l, --link <linkRoot>",
          "Root for links in documentation",
          config.linkRoot,
        )
        .option(
          "-h, --homepage <homepage>",
          "File location for doc landing page",
          config.homepage,
        )
        .option("-f, --force", "Force document generation")
        .option("-d, --diff <diffMethod>", "Set diff method", config.diffMethod)
        .option(
          "-t, --tmp <tmpDir>",
          "Set temp dir for schema diff",
          config.tmpDir,
        )
        .option(
          "-gbd, --groupByDirective <@directive(field|=fallback)>",
          "Group Documentation By Directive",
          config.groupByDirective,
        )
        .description("Generate GraphQL Schema Documentation")
        .action(async (options) => {
          const regex =
            /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

          let groupByDirective;
          if (regex.test(options.groupByDirective)) {
            groupByDirective = Object.assign(
              {},
              regex.exec(options.groupByDirective).groups,
            );
          } else {
            throw new Exception(`Invalid "${options.groupByDirective}"`);
          }
          await generateDocFromSchema({
            baseURL: options.base,
            schemaLocation: options.schema,
            outputDir: path.join(options.root, options.base),
            linkRoot: options.link,
            homepageLocation: options.homepage,
            diffMethod: options.force ? "FORCE" : options.diff,
            tmpDir: options.tmp,
            loaders: config.loaders,
            groupByDirective,
          });
        });
    },
  };
};
