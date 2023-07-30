const { getTypeName } = require("@graphql-markdown/utils");

const { printSection, printMetadataSection } = require("../section");
const { printCodeField } = require("../code");

const printOperationType = (type, options) => {
  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  return printSection([options.schema.getType(queryType)], "Type", {
    ...options,
    parentTypePrefix: false,
  });
};

const printOperationMetadata = (type, options) => {
  const response = printOperationType(type, options);
  const metadata = printMetadataSection(type, type.args, "Arguments", options);

  return `${metadata}${response}`;
};

const printCodeOperation = printCodeField;

module.exports = {
  printOperationMetadata,
  printCodeOperation,
};
