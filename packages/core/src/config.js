const { join } = require("path");
const { tmpdir } = require("os");

const { parseGroupByOption } = require("./lib/group-info");

const PACKAGE_NAME = "@graphql-markdown/docusaurus";
const ASSETS_LOCATION = join(__dirname, "../assets/");

const DEFAULT_OPTIONS = {
  schema: "./schema.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: join(ASSETS_LOCATION, "generated.md"),
  diffMethod: undefined,
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  loaders: {},
  pretty: false,
  docOptions: {
    pagination: true,
    toc: true,
    index: false,
  },
  printTypeOptions: {
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
    printer: "@graphql-markdown/printer-legacy",
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
    outputDir: join(cliOpts.root ?? config.rootPath, baseURL),
    linkRoot: cliOpts.link ?? config.linkRoot,
    homepageLocation: cliOpts.homepage ?? config.homepage,
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod, cliOpts.force),
    tmpDir: cliOpts.tmp ?? config.tmpDir,
    loaders: config.loaders,
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    prettify: cliOpts.pretty ?? config.pretty,
    docOptions: getDocOptions(cliOpts, config.docOptions),
    printTypeOptions: gePrintTypeOptions(cliOpts, config.printTypeOptions),
  };
}

function getDiffMethod(diff, force) {
  return force ? "FORCE" : diff;
}

function getDocOptions(cliOpts, configOptions) {
  return {
    pagination: !cliOpts.noPagination && configOptions.pagination,
    toc: !cliOpts.noToc && configOptions.toc,
    index: cliOpts.index || configOptions.index,
  };
}

function gePrintTypeOptions(cliOpts, configOptions) {
  return {
    parentTypePrefix: !cliOpts.noParentType && configOptions.parentTypePrefix,
    relatedTypeSection:
      !cliOpts.noRelatedType && configOptions.relatedTypeSection,
    typeBadges: !cliOpts.noTypeBadges && configOptions.typeBadges,
    printer: configOptions.printer,
  };
}

module.exports = { buildConfig, DEFAULT_OPTIONS, ASSETS_LOCATION };
