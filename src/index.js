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
        .description("Generate GraphQL Schema Documentation")
        .action(async (options) => {
          const baseURL = options.base;
          const linkRoot = options.link;
          const schema = options.schema;
          const rootPath = path.join(options.root, baseURL);
          const homepage = options.homepage;
          const diffMethod = options.force ? "FORCE" : options.diff;
          const tmpDir = options.tmp;
          await generateDocFromSchema(
            baseURL,
            schema,
            rootPath,
            linkRoot,
            homepage,
            diffMethod,
            tmpDir,
          );
        });
    },
  };
};
