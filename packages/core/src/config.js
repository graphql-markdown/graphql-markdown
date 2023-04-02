const { join } = require("path");
const { tmpdir } = require("os");

const {
  object: { hasProperty },
} = require("@graphql-markdown/utils");

const { parseGroupByOption } = require("./group-info");

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
  printer: "@graphql-markdown/printer-legacy",
  docOptions: {
    pagination: true,
    toc: true,
    index: false,
  },
  printTypeOptions: {
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
    deprecated: "default",
  },
  skipDocDirective: [],
};

function buildConfig(configFileOpts, cliOpts) {
  let config = DEFAULT_OPTIONS;

  if (typeof configFileOpts !== "undefined" && configFileOpts != null) {
    config = { ...DEFAULT_OPTIONS, ...configFileOpts };
  }

  if (typeof cliOpts === "undefined" || cliOpts == null) {
    cliOpts = {};
  }

  if (
    (hasProperty(config, "printTypeOptions") &&
      config.printTypeOptions.deprecated === "skip") ||
    (hasProperty(cliOpts, "deprecated") && cliOpts.deprecated === "skip")
  ) {
    config.skipDocDirective.push("@deprecated");
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
    printer: config.printer,
    skipDocDirective: getSkipDocDirectives(
      cliOpts.skip,
      config.skipDocDirective,
    ),
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
    deprecated:
      cliOpts.deprecated ??
      configOptions.deprecated ??
      DEFAULT_OPTIONS.printTypeOptions.deprecated,
  };
}

function getSkipDocDirectives(cliOpts, configFileOpts) {
  const directiveList = [].concat(cliOpts ?? [], configFileOpts ?? []);

  const skipDirectives = directiveList.map((option) =>
    getSkipDocDirective(option),
  );

  return skipDirectives;
}

function getSkipDocDirective(option) {
  const OPTION_REGEX = /^@(?<directive>\w+)$/;

  if (typeof option !== "string") {
    throw new Error(`Invalid "${option}"`);
  }

  const parsedOption = OPTION_REGEX.exec(option);

  if (typeof parsedOption === "undefined" || parsedOption == null) {
    throw new Error(`Invalid "${option}"`);
  }

  return parsedOption.groups.directive;
}

module.exports = {
  buildConfig,
  getSkipDocDirectives,
  getSkipDocDirective,
  DEFAULT_OPTIONS,
  ASSETS_LOCATION,
};
