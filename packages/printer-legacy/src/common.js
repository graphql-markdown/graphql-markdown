const {
  string: { escapeMDX },
  object: { hasProperty },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOP, NO_DESCRIPTION_TEXT } = require("./const/strings");

const printDeprecation = (type) => {
  if (!type.isDeprecated) {
    return "";
  }

  const reason = type.deprecationReason
    ? ": " + escapeMDX(type.deprecationReason)
    : "";
  return `<Badge class="warning" text="DEPRECATED${reason}"/>${MARKDOWN_EOP}`;
};

const printDescription = (type, noText = NO_DESCRIPTION_TEXT) => {
  const description =
    hasProperty(type, "description") && escapeMDX(type.description);
  return `${printDeprecation(type)}${description || noText}`;
};

module.exports = {
  printDeprecation,
  printDescription,
};
