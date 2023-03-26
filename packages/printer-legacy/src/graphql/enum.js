const {
  object: { hasProperty },
  graphql: { isEnumType, getTypeName },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOL } = require("../const/strings");

const { printSection } = require("../section");

const printEnumMetadata = (type, options) => {
  return printSection(type.getValues(), "Values", {
    parentType: type.name,
    parentTypePrefix:
      hasProperty(options, "parentTypePrefix") && options.parentTypePrefix,
  });
};

const printCodeEnum = (type) => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((v) => `  ${getTypeName(v)}`)
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};

module.exports = {
  printCodeEnum,
  printEnumMetadata,
};
