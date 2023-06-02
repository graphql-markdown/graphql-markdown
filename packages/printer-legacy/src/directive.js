const {
  graphql: { getConstDirectiveMap },
} = require("@graphql-markdown/utils");
const {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
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
  const description = getCustomDirectiveResolver(
    "descriptor",
    type,
    constDirectiveOption,
    "",
  );

  return `${HEADER_SECTION_SUB_LEVEL} ${typeNameLink}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
}

function getCustomDirectiveResolver(
  resolver,
  type,
  constDirectiveOption,
  fallback = undefined,
) {
  if (
    typeof constDirectiveOption === "undefined" ||
    typeof constDirectiveOption[resolver] !== "function"
  ) {
    return fallback;
  }

  return constDirectiveOption[resolver](constDirectiveOption.type, type);
}

module.exports = {
  getCustomDirectiveResolver,
  printCustomDirective,
  printCustomDirectives,
};
