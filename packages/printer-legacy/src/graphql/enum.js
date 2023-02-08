const {
  graphql: { isEnumType, getTypeName },
} = require("@graphql-markdown/utils");

const { printSection } = require("../section");
const { MARKDOWN_EOL } = require("../const/strings");

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

const printEnumMetadata = (type, options) => {
  return printSection(type.getValues(), "Values", {
    parentType: type.name,
    parentTypePrefix:
      typeof options !== "undefined" && options.parentTypePrefix,
  });
};

module.exports = {
  printCodeEnum,
  printEnumMetadata,
};
