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

    customDirectives[schemaDirectiveName] = {
      type: schemaDirectives[schemaDirectiveName],
      descriptor: getDescriptor(schemaDirectiveName, customDirectiveOptions),
    };
  }

  return isEmpty(customDirectives) === true ? undefined : customDirectives;
}

function getDescriptor(schemaDirectiveName, customDirectiveOptions) {
  if (hasProperty(customDirectiveOptions, schemaDirectiveName) === true) {
    return customDirectiveOptions[schemaDirectiveName].descriptor;
  }

  if (hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true) {
    return customDirectiveOptions[WILDCARD_DIRECTIVE].descriptor;
  }

  return undefined;
}

function isCustomDirective(schemaDirectiveName, customDirectiveOptions) {
  return (
    hasProperty(customDirectiveOptions, schemaDirectiveName) === true ||
    hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true
  );
}

module.exports = { getCustomDirectives, getDescriptor, isCustomDirective };
