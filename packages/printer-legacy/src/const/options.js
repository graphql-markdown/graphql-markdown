const OPTION_DEPRECATED = {
  DEFAULT: "default",
  GROUP: "group",
  SKIP: "skip",
};

const DEFAULT_OPTIONS = {
  schema: undefined,
  basePath: "/",
  groups: {},
  parentTypePrefix: true,
  relatedTypeSection: true,
  typeBadges: true,
  skipDocDirective: undefined,
  printDeprecated: OPTION_DEPRECATED.DEFAULT,
};

module.exports = {
  OPTION_DEPRECATED,
  DEFAULT_OPTIONS,
};
