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
  return printBadge({ text: `DEPRECATED${reason}`, classname: "warning" });
};

const printCustomDirectives = (type, options) => {
  const constDirectiveMap = getConstDirectiveMap(type, options);

const printCustomDirectives = (type, constDirectiveMap) => {
  if (isEmpty(constDirectiveMap)) {
    return "";
  }

  const content = Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      getCustomDirectiveResolver("descriptor", type, constDirectiveOption, ""),
    )
    .filter((text) => text.length > 0)
    .join(MARKDOWN_EOP);

  return content;
};

const printDescription = (type, options, noText = NO_DESCRIPTION_TEXT) => {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  const replacement = typeof noText === "string" ? noText : NO_DESCRIPTION_TEXT;
  const description =
    hasProperty(type, "description") && typeof type.description === "string"
      ? escapeMDX(type.description)
      : replacement;
  const deprecation = printDeprecation(type);
  const customDirectives = printCustomDirectives(type, constDirectiveMap);
  return `${deprecation}${customDirectives}${description}`;
};

module.exports = {
  printDeprecation,
  printDescription,
  printCustomDirectives,
};
