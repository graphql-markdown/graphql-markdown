const {
  graphql: { isEnumType, getTypeName },
} = require("@graphql-markdown/utils");

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

const printEnumMetadata = (type) => {
  return printSection(type.getValues(), "Values", {
    parentType: type.name,
  });
};

module.exports = {
  printCodeEnum,
  printEnumMetadata,
};
