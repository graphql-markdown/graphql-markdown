const { printObjectMetadata, printCodeType } = require("./object");

const printInputMetadata = printObjectMetadata;

const printCodeInput = (type) => printCodeType(type, "input");

module.exports = {
  printInputMetadata,
  printCodeInput,
};
