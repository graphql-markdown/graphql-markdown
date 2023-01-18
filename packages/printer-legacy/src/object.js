const {
  object: { hasMethod },
  graphql: { getTypeName, getFields },
} = require("@graphql-markdown/utils");

const printObjectMetadata = (type) => {
  let metadata = printSection(getFields(type), "Fields", {
    parentType: type.name,
  });
  if (hasMethod(type, "getInterfaces")) {
    metadata += printSection(type.getInterfaces(), "Interfaces");
  }
  return metadata;
};

const printCodeType = (type, entity) => {
  let entity;

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
