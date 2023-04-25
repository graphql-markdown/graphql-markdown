const { join } = require("path");
const { tmpdir } = require("os");

const {
  object: { hasProperty },
} = require("@graphql-markdown/utils");

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
  customDirective: {},
};

function buildConfig(configFileOpts, cliOpts) {
  let config = DEFAULT_OPTIONS;

  if (typeof configFileOpts !== "undefined" && configFileOpts != null) {
    config = { ...DEFAULT_OPTIONS, ...configFileOpts };
  }

  if (typeof cliOpts === "undefined" || cliOpts == null) {
    cliOpts = {};
  }

  const baseURL = cliOpts.base ?? config.baseURL;
  const skipDocDirective = getSkipDocDirectives(cliOpts, config);

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
    skipDocDirective,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
  };
}

function getCustomDirectives(
  customDirectiveOptions = {},
  skipDocDirective = [],
) {
  if (Object.keys(customDirectiveOptions).length == 0) {
    return customDirectiveOptions;
  }

  Object.keys(customDirectiveOptions).map((name) => {
    if (skipDocDirective.includes(name)) {
      delete customDirectiveOptions[name];
    } else if (
      hasProperty(customDirectiveOptions[name], "descriptor") === false ||
      typeof customDirectiveOptions[name].descriptor !== "function"
    ) {
      throw new Error(
        `Wrong format for plugin custom directive "${name}", it should be {descriptor: (directiveType, constDirectiveType) => String}`,
      );
    }
  });

  return customDirectiveOptions;
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
  buildConfig,
  getSkipDocDirectives,
  getSkipDocDirective,
  parseGroupByOption,
  getCustomDirectives,
  DEFAULT_OPTIONS,
  ASSETS_LOCATION,
};
