const {
  string: { escapeMDX },
  object: { hasProperty },
  graphql: { isDeprecated },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOP, NO_DESCRIPTION_TEXT } = require("./const/strings");

const printDeprecation = (type) => {
  if (isDeprecated(type) === false) {
    return "";
  }

  const reason =
    hasProperty(type, "deprecationReason") &&
    typeof type.deprecationReason === "string"
      ? ": " + escapeMDX(type.deprecationReason)
      : "";
  return `<Badge class="warning" text="DEPRECATED${reason}"/>${MARKDOWN_EOP}`;
};

const printDescription = (type, noText = NO_DESCRIPTION_TEXT) => {
  const replacement = typeof noText === "string" ? noText : NO_DESCRIPTION_TEXT;
  const description =
    hasProperty(type, "description") && typeof type.description === "string"
      ? escapeMDX(type.description)
      : replacement;
  const deprecation = printDeprecation(type);
  return `${deprecation}${description}`;
};

module.exports = {
  printDeprecation,
  printDescription,
};
