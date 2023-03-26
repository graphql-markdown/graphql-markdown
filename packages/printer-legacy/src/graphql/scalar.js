const {
  graphql: { getTypeName },
} = require("@graphql-markdown/utils");

const { HEADER_SECTION_LEVEL, MARKDOWN_EOP } = require("../const/strings");

const printSpecification = (type) => {
  if (!type.specifiedByURL && !type.specifiedByUrl) {
    return "";
  }

  const url = type.specifiedByURL || type.specifiedByUrl;

  // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
  return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}`;
};

const printScalarMetadata = (type) => {
  return printSpecification(type);
};

const printCodeScalar = (type) => {
  return `scalar ${getTypeName(type)}`;
};

module.exports = {
  printSpecification,
  printScalarMetadata,
  printCodeScalar,
};
