function getCustomDirectives(rootTypes, customDirectiveOptions) {
  const customDirectives = {};

  if (
    typeof customDirectiveOptions === "undefined" ||
    customDirectiveOptions == null
  ) {
    return undefined;
  }

  const schemaDirectives = rootTypes["directives"];
  if (typeof schemaDirectives === "undefined" || schemaDirectives == null) {
    return undefined;
  }

  Object.keys(schemaDirectives).forEach((schemaDirectiveName) => {
    const type = schemaDirectives[schemaDirectiveName];
    const customDirectiveOption = customDirectiveOptions[schemaDirectiveName];

    if (
      typeof type !== "undefined" &&
      type != null &&
      typeof customDirectiveOption !== "undefined" &&
      customDirectiveOption != null
    ) {
      customDirectives[schemaDirectiveName] = {
        type,
        descriptor: customDirectiveOption.descriptor,
      };
    }
  });

  return customDirectives;
}

module.exports = { getCustomDirectives };
