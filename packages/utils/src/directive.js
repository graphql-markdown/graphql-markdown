const { hasProperty, isEmpty } = require("./object");

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
      hasProperty(schemaDirectives, schemaDirectiveName) &&
      hasProperty(customDirectiveOptions, schemaDirectiveName) === false
    ) {
      continue;
    }

    customDirectives[schemaDirectiveName] = {
      type: schemaDirectives[schemaDirectiveName],
      descriptor: customDirectiveOptions[schemaDirectiveName].descriptor,
    };
  }

  return isEmpty(customDirectives) === true ? undefined : customDirectives;
}

module.exports = { getCustomDirectives };
