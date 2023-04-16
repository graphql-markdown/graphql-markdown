const {
  object: { hasProperty },
  graphql: { isEnumType, getTypeName, isDeprecated },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOL, DEPRECATED } = require("../const/strings");
const { OPTION_DEPRECATED } = require("../const/options");
const { printMetadataSection } = require("../section");

const printEnumMetadata = (type, options) => {
  return printMetadataSection(type, type.getValues(), "Values", options);
};

const printCodeEnum = (type, options) => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((value) => {
      if (
        hasProperty(options, "printDeprecated") &&
        options.printDeprecated === OPTION_DEPRECATED.SKIP &&
        isDeprecated(value)
      ) {
        return "";
      }
      const v = getTypeName(value);
      const d = isDeprecated(value) ? ` @${DEPRECATED}` : "";
      return `  ${v}${d}`;
    })
    .filter((value) => value.length > 0)
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};

module.exports = {
  printCodeEnum,
  printEnumMetadata,
};
