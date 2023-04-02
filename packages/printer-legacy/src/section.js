const {
  graphql: { isParametrizedField, hasDirective, isDeprecated },
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
const { OPTION_DEPRECATED } = require("./const/options");

const sectionLevels = [
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  HEADER_SECTION_ITEM_LEVEL,
];

const SHOW_DEPRECATED = `<><span className="deprecated">Show deprecated</span></>`;
const HIDE_DEPRECATED = `<><span className="deprecated">Hide deprecated</span></>`;

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
  const description = printDescription(type, "").replaceAll(
    "\n",
    `${MARKDOWN_EOL}> `,
  );
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
  printMetadataSection,
  SHOW_DEPRECATED,
  HIDE_DEPRECATED,
};
