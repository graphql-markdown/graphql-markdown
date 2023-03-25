const {
  graphql: { isParametrizedField, hasDirective },
} = require("@graphql-markdown/utils");
const { hasProperty } = require("@graphql-markdown/utils/src/object");

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

const sectionLevels = [
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
];

const printSection = (values, section, options) => {
  const level =
    hasProperty(options, "level") &&
    typeof options.level !== "undefined" &&
    options.level !== null
      ? options.level
      : HEADER_SECTION_LEVEL;

  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  const levelPosition = sectionLevels.indexOf(level);
  let subLevel = undefined;
  if (levelPosition > -1) {
    subLevel = sectionLevels[levelPosition + 1];
  }

  return `${level} ${section}${MARKDOWN_EOP}${printSectionItems(values, {
    ...options,
    level: subLevel,
  })}${MARKDOWN_EOP}`;
};

const printSectionItems = (values, options) => {
  const level =
    hasProperty(options, "level") &&
    typeof options.level !== "undefined" &&
    options.level !== null
      ? options.level
      : HEADER_SECTION_SUB_LEVEL;

  if (!Array.isArray(values) || values.length === 0) {
    return "";
  }

  return values
    .map(
      (v) =>
        v &&
        printSectionItem(v, {
          ...options,
          level,
        }),
    )
    .join(MARKDOWN_EOP);
};

const printSectionItem = (type, options) => {
  const level =
    hasProperty(options, "level") &&
    typeof options.level !== "undefined" &&
    options.level !== null
      ? options.level
      : HEADER_SECTION_SUB_LEVEL;

  if (
    typeof type === "undefined" ||
    type === null ||
    hasDirective(type, options.skipDocDirective)
  ) {
    return "";
  }

  const typeNameLink = printLink(type, { withAttributes: false, ...options });
  const description = printDescription(type, "");
  const badges = printBadges(type, options);
  const parentTypeLink = printParentLink(type, options);

  let section = `${level} ${typeNameLink}${parentTypeLink} ${badges}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
  if (isParametrizedField(type)) {
    section += printSectionItems(type.args, {
      ...options,
      level: HEADER_SECTION_ITEM_LEVEL,
      parentType:
        typeof options.parentType === "undefined"
          ? undefined
          : `${options.parentType}.${type.name}`,
    });
  }

  return section;
};

module.exports = {
  printSection,
  printSectionItem,
  printSectionItems,
};
