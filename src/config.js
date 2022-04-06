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

  const baseURL = cliOpts.base ?? config.baseURL;

  return {
    baseURL,
    schemaLocation: cliOpts.schema ?? config.schema,
    outputDir: path.join(cliOpts.root ?? config.rootPath, baseURL),
    linkRoot: cliOpts.link ?? config.linkRoot,
    homepageLocation: cliOpts.homepage ?? config.homepage,
    diffMethod: cliOpts.force
      ? COMPARE_METHOD.FORCE
      : cliOpts.diff ?? config.diffMethod,
    tmpDir: cliOpts.tmp ?? config.tmpDir,
    loaders: config.loaders,
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    prettify: cliOpts.pretty ?? config.pretty,
  };
}

module.exports = { buildConfig, DEFAULT_OPTIONS };
