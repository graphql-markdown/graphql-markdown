const { hasProperty, isEmpty } = require("./object");

const WILDCARD_DIRECTIVE = "*";

function getCustomDirectives(
  { directives: schemaDirectives } = { directives: undefined },
  customDirectiveOptions,
) {
  const customDirectives = {};

  if (
    typeof schemaDirectives !== "object" ||
    typeof customDirectiveOptions !== "object"
  ) {
    return undefined;
  }

  for (const schemaDirectiveName in schemaDirectives) {
    if (
      isCustomDirective(schemaDirectiveName, customDirectiveOptions) === false
    ) {
      continue;
    }

    const directiveOptions = getCustomDirectiveOptions(
      schemaDirectiveName,
      customDirectiveOptions,
    );

    customDirectives[schemaDirectiveName] = {
      type: schemaDirectives[schemaDirectiveName],
      ...directiveOptions,
    };
  }

  return isEmpty(customDirectives) === true ? undefined : customDirectives;
}

function getCustomDirectiveOptions(
  schemaDirectiveName,
  customDirectiveOptions,
) {
  if (hasProperty(customDirectiveOptions, schemaDirectiveName) === true) {
    return customDirectiveOptions[schemaDirectiveName];
  }

  if (hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true) {
    return customDirectiveOptions[WILDCARD_DIRECTIVE];
  }

  return {};
}

function isCustomDirective(schemaDirectiveName, customDirectiveOptions) {
  return (
    hasProperty(customDirectiveOptions, schemaDirectiveName) === true ||
    hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true
  );
}

module.exports = {
  getCustomDirectives,
  getCustomDirectiveOptions,
  isCustomDirective,
};
