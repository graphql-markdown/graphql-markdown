const {
  graphql: { isDeprecated, getConstDirectiveMap },
  object: { hasProperty, isEmpty },
  string: { escapeMDX },
} = require("@graphql-markdown/utils");

const { printBadge } = require("./badge");
const { getCustomDirectiveResolver } = require("./directive");

const { MARKDOWN_EOP, NO_DESCRIPTION_TEXT } = require("./const/strings");

const printDeprecation = (type) => {
  if (isDeprecated(type) === false) {
    return "";
  }

  const reason =
    typeof type.deprecationReason === "string"
      ? ": " + type.deprecationReason
      : "";
  return (
    printBadge({
      text: `DEPRECATED${reason}`,
      classname: "badge badge--warning",
    }) + MARKDOWN_EOP
  );
};

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

  return `${content}${MARKDOWN_EOP}`;
};

const formatDescription = (type, noText = NO_DESCRIPTION_TEXT) => {
  const replacement = typeof noText === "string" ? noText : NO_DESCRIPTION_TEXT;
  const description =
    hasProperty(type, "description") && typeof type.description === "string"
      ? escapeMDX(type.description)
      : replacement;
  return `${description}${MARKDOWN_EOP}`;
};

const printDescription = (type, options, noText) => {
  const description = formatDescription(type, noText);
  const deprecation = printDeprecation(type);
  const customDirectives = printCustomDirectives(type, options);
  return `${deprecation}${description}${customDirectives}`;
};

module.exports = {
  printCustomDirectives,
  printDeprecation,
  printDescription,
};
