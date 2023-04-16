const { printObjectMetadata, printCodeType } = require("./object");

const printInputMetadata = printObjectMetadata;

const printCodeInput = (type, options) => printCodeType(type, "input", options);

module.exports = {
  printInputMetadata,
  printCodeInput,
};
