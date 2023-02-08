const {
  graphql: { getTypeName },
} = require("@graphql-markdown/utils");

const { printSection } = require("../section");
const { printCodeField } = require("../code");

const printOperationMetadata = (type, options) => {
  let metadata = printSection(type.args, "Arguments", {
    ...options,
    parentType: type.name,
    parentTypePrefix: true,
  });

  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  metadata += printSection([options.schema.getType(queryType)], "Type", {
    ...options,
    parentTypePrefix: false,
  });

  return metadata;
};

const printCodeOperation = printCodeField;

module.exports = {
  printOperationMetadata,
  printCodeOperation,
};
