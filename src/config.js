const path = require("path");
const os = require("os");
const GroupInfo = require("./lib/group-info");

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

function buildConfig(configFileOpts, cliOpts) {
  // Merge defaults with user-defined options in config file.
  const config = { ...DEFAULT_OPTIONS, ...configFileOpts };

  const baseURL = cliOpts.base ?? config.baseURL;
  const schemaLocation = cliOpts.schema ?? config.schema;
  const root = cliOpts.root ?? config.rootPath;
  const outputDir = path.join(root, baseURL);
  const linkRoot = cliOpts.link ?? config.linkRoot;
  const homepageLocation = cliOpts.homepage ?? config.homepage;
  const diff = cliOpts.diff ?? config.diffMethod;
  const diffMethod = cliOpts.force ? "FORCE" : diff;
  const tmpDir = cliOpts.tmp ?? config.tmpDir;
  const loaders = config.loaders;
  const groupByDirective =
    GroupInfo.parseOption(cliOpts.groupByDirective) || config.groupByDirective;
  const prettify = cliOpts.pretty ?? config.pretty;

  return {
    baseURL,
    schemaLocation,
    outputDir,
    linkRoot,
    homepageLocation,
    diffMethod,
    tmpDir,
    loaders,
    groupByDirective,
    prettify,
  };
}

module.exports = { buildConfig };
