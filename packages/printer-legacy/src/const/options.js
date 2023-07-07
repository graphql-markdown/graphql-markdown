const OPTION_DEPRECATED = {
  DEFAULT: "default",
  GROUP: "group",
  SKIP: "skip",
};

const PRINT_TYPE_DEFAULT_OPTIONS = {
  parentTypePrefix: true,
  printDeprecated: OPTION_DEPRECATED.DEFAULT,
  codeSection: true,
  relatedTypeSection: true,
  typeBadges: true,
};

const DEFAULT_OPTIONS = {
  ...PRINT_TYPE_DEFAULT_OPTIONS,
  basePath: "/",
  customDirectives: {},
  groups: {},
  schema: undefined,
  skipDocDirective: undefined,
};

module.exports = {
  DEFAULT_OPTIONS,
  OPTION_DEPRECATED,
  PRINT_TYPE_DEFAULT_OPTIONS,
};
