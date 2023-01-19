const {
  graphql: { isParametrizedField },
} = require("@graphql-markdown/utils");

const {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} = require("./const/strings");
const { printDescription } = require("./common");
const { printBadges } = require("./badge");
const { printLink, printParentLink } = require("./link");

const printSection = (
  values,
  section,
  { level, parentType, parentTypePrefix } = {
    level: HEADER_SECTION_LEVEL,
    parentType: undefined,
    parentTypePrefix: undefined,
  },
) => {
  if (values.length === 0) {
    return "";
  }

  if (typeof level === "undefined") {
    level = HEADER_SECTION_LEVEL;
  }

  return `${level} ${section}${MARKDOWN_EOP}${printSectionItems(values, {
    parentType,
    parentTypePrefix,
  })}${MARKDOWN_EOP}`;
};

const printSectionItems = (
  values,
  { level, parentType, parentTypePrefix } = {
    level: HEADER_SECTION_SUB_LEVEL,
    parentType: undefined,
    parentTypePrefix: undefined,
  },
) => {
  if (!Array.isArray(values)) {
    return "";
  }

  if (typeof level === "undefined") {
    level = HEADER_SECTION_SUB_LEVEL;
  }

  return values
    .map(
      (v) => v && printSectionItem(v, { level, parentType, parentTypePrefix }),
    )
    .join(MARKDOWN_EOP);
};

const printSectionItem = (
  type,
  { level, parentType, parentTypePrefix } = {
    level: HEADER_SECTION_SUB_LEVEL,
    parentType: undefined,
    parentTypePrefix: undefined,
  },
) => {
  if (typeof type === "undefined" || type === null) {
    return "";
  }

  if (typeof level === "undefined") {
    level = HEADER_SECTION_SUB_LEVEL;
  }

  const typeNameLink = printLink(type, false, parentType, parentTypePrefix);
  const description = printDescription(type, "");
  const badges = printBadges(type);
  const parentTypeLink = printParentLink(type);

  let section = `${level} ${typeNameLink}${parentTypeLink} ${badges}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
  if (isParametrizedField(type)) {
    section += printSectionItems(type.args, {
      level: HEADER_SECTION_ITEM_LEVEL,
      parentType:
        typeof parentType === "undefined"
          ? undefined
          : `${parentType}.${type.name}`,
      parentTypePrefix,
    });
  }

  return section;
};

module.exports = {
  printSection,
  printSectionItem,
  printSectionItems,
};
