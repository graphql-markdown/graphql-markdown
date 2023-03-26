const {
  graphql: { isEnumType, getTypeName },
} = require("@graphql-markdown/utils");

const { MARKDOWN_EOL } = require("../const/strings");

const { printSection } = require("../section");

const printEnumMetadata = (type, options) => {
  return printSection(type.getValues(), "Values", {
    ...options,
    parentType: type.name,
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
