const {
  graphql: { getConstDirectiveMap },
  object: { hasProperty },
} = require("@graphql-markdown/utils");
const {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  MARKDOWN_EOP,
  MARKDOWN_EOL,
} = require("./const/strings");
const { printLink } = require("./link");

function printCustomDirectives(type, options) {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  if (
    typeof constDirectiveMap !== "object" ||
    !Object.keys(constDirectiveMap).length
  ) {
    return "";
  }

  const content = Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      printCustomDirective(type, constDirectiveOption, options),
    )
    .join(MARKDOWN_EOP);

  return `${HEADER_SECTION_LEVEL} Directives${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
}

function printCustomDirective(type, constDirectiveOption, options) {
  const typeNameLink = printLink(constDirectiveOption.type, {
    ...options,
    withAttributes: false,
  });
  const description = getCustomDirectiveDescription(type, constDirectiveOption);

  return `${HEADER_SECTION_SUB_LEVEL} ${typeNameLink}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
}

function getCustomDirectiveDescription(type, constDirectiveOption) {
  if (
    typeof constDirectiveOption === "undefined" ||
    !hasProperty(constDirectiveOption, "descriptor") ||
    typeof constDirectiveOption.descriptor !== "function"
  ) {
    return "";
  }

  return constDirectiveOption.descriptor(constDirectiveOption.type, type);
}

module.exports = {
  printCustomDirectives,
  printCustomDirective,
  getCustomDirectiveDescription,
};
