printScalarMetadata = (type) => {
  return printSpecification(type);
};

const printCodeScalar = (type) => {
  return `scalar ${getTypeName(type)}`;
};

module.exports = {
  printScalarMetadata,
  printCodeScalar,
};
