const {
  object: { hasMethod },
  graphql: { getTypeName, getFields },
} = require("@graphql-markdown/utils");

const { printSection, printMetadataSection } = require("../section");
const { printCodeField } = require("../code");
const { MARKDOWN_EOL } = require("../const/strings");

const printInterfaceMetadata = (type, options) => {
  if (hasMethod(type, "getInterfaces") === false) {
    return "";
  }

  return printSection(type.getInterfaces(), "Interfaces", options);
};

const printObjectMetadata = (type, options) => {
  const interfaceMeta = printInterfaceMetadata(type, options);
  const metadata = printMetadataSection(
    type,
    getFields(type),
    "Fields",
    options,
  );

  return `${metadata}${interfaceMeta}`;
};

const printCodeType = (type, entity) => {
  const name = getTypeName(type);
  const extendsInterface =
    hasMethod(type, "getInterfaces") && type.getInterfaces().length > 0
      ? ` implements ${type
          .getInterfaces()
          .map((field) => getTypeName(field))
          .join(", ")}`
      : "";
  const typeFields = getFields(type)
    .map((v) => `  ${printCodeField(v)}`)
    .join("");

  return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
};

const printCodeObject = (type) => printCodeType(type, "type");

module.exports = {
  printObjectMetadata,
  printCodeObject,
  printCodeType,
};
