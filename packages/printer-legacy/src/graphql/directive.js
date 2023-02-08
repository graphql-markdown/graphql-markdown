const {
  graphql: { getTypeName },
} = require("@graphql-markdown/utils");

const { printSection } = require("../section");
const { printCodeArguments } = require("../code");

const printCodeDirectiveLocation = (type) => {
  if (
    typeof type.locations === "undefined" ||
    type.locations == null ||
    type.locations.length === 0
  ) {
    return "";
  }

  let code = ` on `;
  const separator = `\r\n  | `;
  if (type.locations.length > 1) {
    code += separator;
  }
  code += type.locations.join(separator).trim();

  return code;
};

const printDirectiveMetadata = (type, options) => {
  return printSection(type.args, "Arguments", {
    parentType: type.name,
    parentTypePrefix: options.parentTypePrefix,
  });
};

const printCodeDirective = (type) => {
  let code = `directive @${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += printCodeDirectiveLocation(type);

  return code;
};

module.exports = {
  printDirectiveMetadata,
  printCodeDirective,
};
