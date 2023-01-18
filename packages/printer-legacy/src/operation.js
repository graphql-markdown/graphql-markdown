const {
  graphql: { getTypeName },
} = require("@graphql-markdown/utils");

const printOperationMetadata = (type) => {
  let metadata = this.printSection(type.args, "Arguments", {
    parentType: type.name,
  });
  const queryType = getTypeName(type.type).replace(/[![\]]*/g, "");
  metadata += this.printSection([this.schema.getType(queryType)], "Type");

  return metadata;
};

module.exports = {
  printOperationMetadata,
};
