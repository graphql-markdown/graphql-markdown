const {
  object: { hasProperty },
  graphql: { isNonNullType, isListType, isDeprecated, getNamedType },
} = require("@graphql-markdown/utils");

const { getLinkCategory } = require("./link");
const { getGroup } = require("./group");
const { getConstDirectiveMap } = require("./directive");

const getTypeBadges = (type, options) => {
  const rootType = hasProperty(type, "type") ? type.type : type;

  const badges = [];

  if (isDeprecated(type) === true) {
    badges.push("deprecated");
  }

  if (isNonNullType(rootType) === true) {
    badges.push("non-null");
  }

  if (isListType(rootType) === true) {
    badges.push("list");
  }

  const category = getLinkCategory(getNamedType(rootType));
  if (typeof category !== "undefined") {
    badges.push(category);
  }

  const group = getGroup(rootType);
  if (typeof group !== "undefined" && group !== "") {
    badges.push(group);
  }

  const constDirectiveMap = getConstDirectiveMap(type, options);
  if (typeof constDirectiveMap !== "undefined") {
    badges.push(...Object.keys(constDirectiveMap));
  }

  return badges;
};

const printBadges = (type, options) => {
  if (!hasProperty(options, "typeBadges") || options.typeBadges !== true) {
    return "";
  }

  const badges = getTypeBadges(type, options);

  if (badges.length === 0) {
    return "";
  }

  return badges
    .map(
      (badge) =>
        `<Badge class="secondary" text="${
          hasProperty(badge, "singular") ? badge.singular : badge
        }"/>`,
    )
    .join(" ");
};

module.exports = {
  printBadges,
  getTypeBadges,
};
