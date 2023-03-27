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

  const openSection =
    hasProperty(options, "collapsible") && options.collapsible === true
      ? `${MARKDOWN_EOP}<Details summary="Show deprecated">${MARKDOWN_EOP}`
      : MARKDOWN_EOP;
  const closeSection =
    hasProperty(options, "collapsible") && options.collapsible === true
      ? `${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}`
      : MARKDOWN_EOP;

  return `${level} ${section}${openSection}${printSectionItems(values, {
    ...options,
    collapsible: false, // do not propagate collapsible
    level: subLevel,
  })}${closeSection}`;
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
    (hasProperty(options, "skipDocDirective") &&
      hasDirective(type, options.skipDocDirective) === true) ||
    (hasProperty(options, "onlyDocDirective") &&
      hasDirective(type, options.onlyDocDirective) === false)
  ) {
    return "";
  }

  const typeNameLink = printLink(type, { ...options, withAttributes: false });
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
          ? type.name
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
