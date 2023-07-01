const { join } = require("path");
const { tmpdir } = require("os");

const {
  object: { hasProperty },
} = require("@graphql-markdown/utils");

const { loadConfiguration } = require("./graphql-config");

const PACKAGE_NAME = "@graphql-markdown/docusaurus";
const ASSETS_LOCATION = join(__dirname, "../assets/");

const DEFAULT_OPTIONS = {
  baseURL: "schema",
  customDirective: undefined,
  diffMethod: undefined,
  docOptions: {
    index: false,
    pagination: true,
    toc: true,
  },
  groupByDirective: undefined,
  homepage: join(ASSETS_LOCATION, "generated.md"),
  linkRoot: "/",
  loaders: {},
  pretty: false,
  printer: "@graphql-markdown/printer-legacy",
  printTypeOptions: {
    deprecated: "default",
    parentTypePrefix: true,
    relatedTypeSection: true,
    typeBadges: true,
  },
  rootPath: "./docs",
  schema: "./schema.graphql",
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  skipDocDirective: [],
};

function buildConfig(configFileOpts, cliOpts, id = undefined) {
  if (typeof cliOpts === "undefined" || cliOpts === null) {
    cliOpts = {};
  }

  const graphqlConfig = loadConfiguration(id);
  const config = { ...DEFAULT_OPTIONS, ...graphqlConfig, ...configFileOpts };

  const baseURL = cliOpts.base ?? config.baseURL;
  const skipDocDirective = getSkipDocDirectives(cliOpts, config);

  return {
    baseURL,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod, cliOpts.force),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) || config.groupByDirective,
    homepageLocation: cliOpts.homepage ?? config.homepage,
    linkRoot: cliOpts.link ?? config.linkRoot,
    loaders: config.loaders,
    outputDir: join(cliOpts.root ?? config.rootPath, baseURL),
    prettify: cliOpts.pretty ?? config.pretty,
    printer: config.printer,
    printTypeOptions: gePrintTypeOptions(cliOpts, config.printTypeOptions),
    schemaLocation: cliOpts.schema ?? config.schema,
    skipDocDirective,
    tmpDir: cliOpts.tmp ?? config.tmpDir,
  };
}

function getCustomDirectives(customDirectiveOptions, skipDocDirective = []) {
  if (
    typeof customDirectiveOptions === "undefined" ||
    (typeof customDirectiveOptions === "object" &&
      Object.keys(customDirectiveOptions).length == 0)
  ) {
    return undefined;
  }

  for (const [name, option] of Object.entries(customDirectiveOptions)) {
    if (skipDocDirective.includes(name)) {
      delete customDirectiveOptions[name];
    } else if (
      (hasProperty(option, "descriptor") === false ||
        typeof option.descriptor !== "function") &&
      (hasProperty(option, "tag") === false || typeof option.tag !== "function")
    ) {
      throw new Error(
        `Wrong format for plugin custom directive "${name}".\nPlease refer to https://graphql-markdown.github.io/docs/advanced/custom-directive`,
      );
    }
  }

  return Object.keys(customDirectiveOptions).length === 0
    ? undefined
    : customDirectiveOptions;
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

function getSkipDocDirectives(cliOpts = {}, configFileOpts = {}) {
  const directiveList = [].concat(
    cliOpts.skip ?? [],
    configFileOpts.skipDocDirective ?? [],
  );

  const skipDirectives = directiveList.map((option) =>
    getSkipDocDirective(option),
  );

  if (
    (hasProperty(configFileOpts, "printTypeOptions") === true &&
      configFileOpts.printTypeOptions.deprecated === "skip") ||
    (hasProperty(cliOpts, "deprecated") === true &&
      cliOpts.deprecated === "skip")
  ) {
    skipDirectives.push("deprecated");
  }

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

function parseGroupByOption(groupOptions) {
  const DEFAULT_GROUP = "Miscellaneous";
  const OPTION_REGEX =
    /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

  if (typeof groupOptions !== "string") {
    return undefined;
  }

  const parsedOptions = OPTION_REGEX.exec(groupOptions);

  if (typeof parsedOptions === "undefined" || parsedOptions == null) {
    throw new Error(`Invalid "${groupOptions}"`);
  }

  const { directive, field, fallback = DEFAULT_GROUP } = parsedOptions.groups;
  return { directive, field, fallback };
}

module.exports = {
  ASSETS_LOCATION,
  buildConfig,
  DEFAULT_OPTIONS,
  getCustomDirectives,
  getSkipDocDirective,
  getSkipDocDirectives,
  parseGroupByOption,
};
