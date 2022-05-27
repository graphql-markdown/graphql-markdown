const path = require("path");
const os = require("os");

const { parseGroupByOption } = require("./lib/group-info");
const { COMPARE_METHOD } = require("./lib/diff");

const PACKAGE_NAME = "@edno/docusaurus2-graphql-doc-generator";
const ASSETS_LOCATION = path.join(__dirname, "../assets/");

const DEFAULT_OPTIONS = {
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: path.join(ASSETS_LOCATION, "generated.md"),
  diffMethod: COMPARE_METHOD.DIFF,
  tmpDir: path.join(os.tmpdir(), PACKAGE_NAME),
  loaders: {},
  pretty: false,
  docOptions: {
    pagination: true,
    toc: true,
  },
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
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod, cliOpts.force),
    tmpDir: cliOpts.tmp ?? config.tmpDir,
    loaders: config.loaders,
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    prettify: cliOpts.pretty ?? config.pretty,
    docOptions: getDocOptions(cliOpts, config.docOptions),
  };
}

function getDiffMethod(diff, force) {
  return force ? COMPARE_METHOD.FORCE : diff;
}

function getDocOptions(cliOpts, configOptions) {
  return {
    pagination: !cliOpts.noPagination && configOptions.pagination,
    toc: !cliOpts.noToc && configOptions.toc,
  };
}

module.exports = { buildConfig, DEFAULT_OPTIONS, ASSETS_LOCATION };
