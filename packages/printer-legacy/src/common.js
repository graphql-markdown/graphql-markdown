const {
  graphql: { isDeprecated, getConstDirectiveMap },
  object: { hasProperty, isEmpty },
  string: { escapeMDX },
} = require("@graphql-markdown/utils");

const { getCustomDirectiveResolver } = require("./directive");

const {
  DEPRECATED,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  NO_DESCRIPTION_TEXT,
} = require("./const/strings");

const printCustomDirectives = (type, options) => {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  if (isEmpty(constDirectiveMap)) {
    return "";
  }

  const content = Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      getCustomDirectiveResolver("descriptor", type, constDirectiveOption, ""),
    )
    .filter((text) => text.length > 0)
    .join(MARKDOWN_EOP);

  return `${MARKDOWN_EOP}${content}`;
};

const formatDescription = (type, noText = NO_DESCRIPTION_TEXT) => {
  const replacement = typeof noText === "string" ? noText : NO_DESCRIPTION_TEXT;
  const description =
    hasProperty(type, "description") && typeof type.description === "string"
      ? escapeMDX(type.description)
      : replacement;
  return `${MARKDOWN_EOP}${description}`;
};

const printDeprecation = (type) => {
  if (isDeprecated(type) === false) {
    return "";
  }

  const reason =
    typeof type.deprecationReason === "string"
      ? type.deprecationReason + MARKDOWN_EOL
      : "";

  return `${MARKDOWN_EOP}:::caution ${DEPRECATED.toUpperCase()}${MARKDOWN_EOL}${reason}:::`;
};

const printDescription = (type, options, noText) => {
  const description = formatDescription(type, noText);
  const customDirectives = printCustomDirectives(type, options);
  const deprecation = printDeprecation(type);
  return `${deprecation}${description}${customDirectives}`;
};

module.exports = {
  printCustomDirectives,
  printDeprecation,
  printDescription,
};
