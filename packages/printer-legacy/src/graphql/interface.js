const { printObjectMetadata, printCodeType } = require("./object");

const printInterfaceMetadata = printObjectMetadata;

const printCodeInterface = (type) => printCodeType(type, "interface");

module.exports = {
  printInterfaceMetadata,
  printCodeInterface,
};
