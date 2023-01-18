const {
  graphql: { isUnionType, getTypeName },
} = require("@graphql-markdown/utils");

printUnionMetadata = (type) => {
  return printSection(type.getTypes(), "Possible types");
};

const printCodeUnion = (type) => {
  if (!isUnionType(type)) {
    return "";
  }

  let code = `union ${getTypeName(type)} = `;
  code += type
    .getTypes()
    .map((v) => getTypeName(v))
    .join(" | ");

  return code;
};

module.exports = {
  printUnionMetadata,
  printCodeUnion,
};
