const {
  graphql: { getNamedType, isDeprecated, isListType, isNonNullType },
  object: { hasProperty },
  string: { escapeMDX },
} = require("@graphql-markdown/utils");

const { getLinkCategory } = require("./link");
const { getGroup } = require("./group");
const { getCustomTags } = require("./directive");

const DEFAULT_CSS_CLASSNAME = "badge--secondary";

const getTypeBadges = (type) => {
  const rootType = hasProperty(type, "type") ? type.type : type;

  const badges = [];

  if (isDeprecated(type) === true) {
    badges.push({
      text: "deprecated",
      classname: "badge--deprecated badge--secondary",
    });
  }

  if (isNonNullType(rootType) === true) {
    badges.push({ text: "non-null", classname: DEFAULT_CSS_CLASSNAME });
  }

  if (isListType(rootType) === true) {
    badges.push({ text: "list", classname: DEFAULT_CSS_CLASSNAME });
  }

  const category = getLinkCategory(getNamedType(rootType));
  if (typeof category !== "undefined") {
    badges.push({ text: category, classname: DEFAULT_CSS_CLASSNAME });
  }

  const group = getGroup(rootType);
  if (typeof group !== "undefined" && group !== "") {
    badges.push({ text: group, classname: DEFAULT_CSS_CLASSNAME });
  }

  return badges;
};

const printCustomTags = (type, options) => {
  const badges = getCustomTags(type, options);

  if (badges.length === 0) {
    return "";
  }

  return badges.map((badge) => printBadge(badge)).join(" ");
};

const printBadges = (type, options) => {
  if (!hasProperty(options, "typeBadges") || options.typeBadges !== true) {
    return "";
  }

  const badges = getTypeBadges(type);

  if (badges.length === 0) {
    return "";
  }

  return badges.map((badge) => printBadge(badge)).join(" ");
};

function printBadge({ text, classname }) {
  const textString = hasProperty(text, "singular") ? text.singular : text;
  const formattedText = escapeMDX(textString);
  return `<Badge class="badge ${classname}" text="${formattedText}"/>`;
}

module.exports = {
  getTypeBadges,
  getCustomTags,
  printBadge,
  printBadges,
  printCustomTags,
};
