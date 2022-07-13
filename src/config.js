const path = require("path");
const os = require("os");

const { parseGroupByOption } = require("./lib/group-info");
const { COMPARE_METHOD } = require("./lib/diff");

const PACKAGE_NAME = "@edno/docusaurus2-graphql-doc-generator";
const ASSETS_LOCATION = path.join(__dirname, "../assets/");

const DEFAULT_OPTIONS = {
  assets: ASSETS_LOCATION,
  baseURL: "schema",
  diffMethod: COMPARE_METHOD.DIFF,
  docOptions: {
    pagination: true,
    toc: true,
    index: false,
  },
  homepage: "generated.md",
  linkRoot: "/",
  loaders: {},
  pretty: false,
  rootPath: "./docs",
  schema: "./schema.graphql",
  tmpDir: path.join(os.tmpdir(), PACKAGE_NAME),
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

  const assetsLocation = cliOpts.assets ?? config.assets;

  const homepage = cliOpts.homepage ?? config.homepage;
  const homepageLocation = path.isAbsolute(homepage)
    ? homepage
    : path.join(assetsLocation, homepage);

  return {
    assetsLocation,
    baseURL,
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod, cliOpts.force),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    homepageLocation,
    linkRoot: cliOpts.link ?? config.linkRoot,
    loaders: config.loaders,
    outputDir: path.join(cliOpts.root ?? config.rootPath, baseURL),
    prettify: cliOpts.pretty ?? config.pretty,
    schemaLocation: cliOpts.schema ?? config.schema,
    tmpDir: cliOpts.tmp ?? config.tmpDir,
  };
}

function getDiffMethod(diff, force) {
  return force ? COMPARE_METHOD.FORCE : diff;
}

function getDocOptions(cliOpts, configOptions) {
  return {
    pagination: !cliOpts.noPagination && configOptions.pagination,
    toc: !cliOpts.noToc && configOptions.toc,
    index: cliOpts.index || configOptions.index,
  };
}

module.exports = { buildConfig, DEFAULT_OPTIONS, ASSETS_LOCATION };
