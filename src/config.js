const path = require("path");
const os = require("os");

const { parseGroupByOption } = require("./lib/group-info");
const { COMPARE_METHOD } = require("./lib/diff");

const ASSETS_LOCATION = path.join(__dirname, "../assets/");

const DEFAULT_OPTIONS = {
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: path.join(ASSETS_LOCATION, "generated.md"),
  diffMethod: "SCHEMA-DIFF",
  tmpDir: path.join(os.tmpdir(), "@edno/docusaurus2-graphql-doc-generator"),
  loaders: {},
  pretty: false,
};

function buildConfig(configFileOpts, cliOpts) {
  let config = DEFAULT_OPTIONS;

  if (typeof configFileOpts != "undefined" && configFileOpts != null) {
    config = { ...DEFAULT_OPTIONS, ...configFileOpts };
  }

  if (typeof cliOpts == "undefined" || cliOpts == null) {
    cliOpts = {};
  }

  // Merge defaults with user-defined options in config file.

  const baseURL = cliOpts.base ?? config.baseURL;
  const schemaLocation = cliOpts.schema ?? config.schema;
  const root = cliOpts.root ?? config.rootPath;
  const outputDir = path.join(root, baseURL);
  const linkRoot = cliOpts.link ?? config.linkRoot;
  const homepageLocation = cliOpts.homepage ?? config.homepage;
  const diffMethod = cliOpts.force
    ? COMPARE_METHOD.FORCE
    : cliOpts.diff ?? config.diffMethod;
  const tmpDir = cliOpts.tmp ?? config.tmpDir;
  const loaders = config.loaders;
  const groupByDirective =
    parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective;
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

module.exports = { buildConfig, DEFAULT_OPTIONS };
