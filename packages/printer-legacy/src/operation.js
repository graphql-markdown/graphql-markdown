const {
  graphql: { getTypeName },
} = require("@graphql-markdown/utils");

const { printSection } = require("./section");

const printOperationMetadata = (type, options) => {
  let metadata = printSection(type.args, "Arguments", {
    parentType: type.name,
    parentTypePrefix: options.parentTypePrefix,
  });
  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  metadata += printSection([options.schema.getType(queryType)], "Type");

  return metadata;
};

module.exports = {
  printOperationMetadata,
};
