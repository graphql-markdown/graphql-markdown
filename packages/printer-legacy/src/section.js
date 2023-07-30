const {
  hasProperty,
  isParametrizedField,
  hasDirective,
  isDeprecated,
} = require("@graphql-markdown/utils");

const { printDescription } = require("./common");
const { printBadges } = require("./badge");
const { printLink, printParentLink } = require("./link");
const { printCustomTags } = require("./directive");

const {
  HEADER_SECTION_ITEM_LEVEL,
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HIDE_DEPRECATED,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  SHOW_DEPRECATED,
} = require("./const/strings");

const { OPTION_DEPRECATED } = require("./const/options");

const sectionLevels = [
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
];

const printMetadataSection = (type, values, section, options) => {
  switch (options.printDeprecated) {
    case OPTION_DEPRECATED.GROUP: {
      const { fields, deprecated } = values.reduce(
        (res, arg) => {
          isDeprecated(arg) ? res.deprecated.push(arg) : res.fields.push(arg);
          return res;
        },
        { fields: [], deprecated: [] },
      );

      const meta = printSection(fields, section, {
        ...options,
        parentType: type.name,
      });
      const deprecatedMeta = printSection(deprecated, "", {
        ...options,
        parentType: type.name,
        level: "",
        collapsible: {
          dataOpen: HIDE_DEPRECATED,
          dataClose: SHOW_DEPRECATED,
        },
      });

      return `${meta}${deprecatedMeta}`;
    }

    case OPTION_DEPRECATED.DEFAULT:
    default:
      return printSection(values, section, {
        ...options,
        parentType: type.name,
      });
  }
};

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

  const [openSection, closeSection] = (() => {
    if (
      hasProperty(options, "collapsible") &&
      hasProperty(options.collapsible, "dataOpen") &&
      hasProperty(options.collapsible, "dataClose")
    ) {
      return [
        `${MARKDOWN_EOP}<Details dataOpen={${options.collapsible.dataOpen}} dataClose={${options.collapsible.dataClose}}>${MARKDOWN_EOP}`,
        `${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}`,
      ];
    }
    return [MARKDOWN_EOP, MARKDOWN_EOP];
  })();

  const items = printSectionItems(values, {
    ...options,
    collapsible: undefined, // do not propagate collapsible
    level: levelPosition > -1 ? sectionLevels[levelPosition + 1] : undefined,
  });

  if (items === "") {
    return ""; // do not print section is no items printed
  }

  return `${level} ${section}${openSection}${items}${closeSection}`;
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

  const skipDirective =
    hasProperty(options, "skipDocDirective") &&
    hasDirective(type, options.skipDocDirective) === true;
  const skipDeprecated =
    hasProperty(options, "printDeprecated") &&
    options.printDeprecated === OPTION_DEPRECATED.SKIP &&
    isDeprecated(type) === true;

  if (
    typeof type === "undefined" ||
    type === null ||
    skipDirective === true ||
    skipDeprecated === true
  ) {
    return "";
  }

  const typeNameLink = printLink(type, { ...options, withAttributes: false });
  const description = printDescription(type, options, "").replaceAll(
    "\n",
    `${MARKDOWN_EOL}> `,
  );
  const badges = printBadges(type, options);
  const tags = printCustomTags(type, options);
  const parentTypeLink = printParentLink(type, options);

  let section = `${level} ${typeNameLink}${parentTypeLink} ${badges} ${tags}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
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
  printMetadataSection,
};
