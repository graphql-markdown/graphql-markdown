const {
  graphql: { getConstDirectiveMap },
} = require("@graphql-markdown/utils");
const {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  MARKDOWN_EOP,
  MARKDOWN_EOL,
} = require("./const/strings");
const { printLink } = require("./link");

function printConstDirectives(type, options) {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  if (
    typeof constDirectiveMap !== "object" ||
    !Object.keys(constDirectiveMap).length
  ) {
    return "";
  }

  const content = Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      printConstDirective(type, constDirectiveOption, options),
    )
    .join(MARKDOWN_EOP);

  return `${HEADER_SECTION_LEVEL} Type Directives${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
}

function printConstDirective(type, constDirectiveOption, options) {
  const typeNameLink = printLink(constDirectiveOption.type, {
    ...options,
    withAttributes: false,
  });
  const description = getConstDirectiveDescription(constDirectiveOption);

  return `${HEADER_SECTION_SUB_LEVEL} ${typeNameLink}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
}

function getConstDirectiveDescription(constDirectiveOption) {
  const {
    type: customDirectiveType,
    constDirective: constDirectiveType,
    descriptor,
  } = constDirectiveOption;

  return descriptor(customDirectiveType, constDirectiveType);
}

module.exports = {
  printConstDirectives,
  printConstDirective,
  getConstDirectiveDescription,
};
