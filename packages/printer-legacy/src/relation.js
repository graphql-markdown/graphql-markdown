const {
  graphql: {
    isOperation,
    getRelationOfReturn,
    getRelationOfField,
    getRelationOfImplementation,
  },
} = require("@graphql-markdown/utils");

const { getRelationLink } = require("./link");
const { printBadge, DEFAULT_CSS_CLASSNAME } = require("./badge");
const {
  ROOT_TYPE_LOCALE,
  HEADER_SECTION_LEVEL,
  MARKDOWN_EOP,
} = require("./const/strings");

const getRootTypeLocaleFromString = (text) => {
  for (const [type, props] of Object.entries(ROOT_TYPE_LOCALE)) {
    if (Object.values(props).includes(text)) {
      return ROOT_TYPE_LOCALE[type];
    }
  }
  return undefined;
};

const printRelationOf = (type, section, getRelation, options) => {
  if (
    typeof type === "undefined" ||
    typeof getRelation !== "function" ||
    typeof options === "undefined" ||
    isOperation(type)
  ) {
    return "";
  }

  const relations = getRelation(type, options.schema);

  if (typeof relations === "undefined") {
    return "";
  }

  let data = [];
  for (const [relation, types] of Object.entries(relations)) {
    if (types.length === 0) {
      continue;
    }

    const category = getRootTypeLocaleFromString(relation);
    const badge = printBadge({
      text: category.singular,
      classname: DEFAULT_CSS_CLASSNAME,
    });
    data = data.concat(
      types.map((t) => {
        const link = getRelationLink(category, t, options);
        return `[\`${link.text}\`](${link.url})  ${badge}`;
      }),
    );
  }

  if (data.length === 0) {
    return "";
  }

  const content = [...data]
    .sort((a, b) => a.localeCompare(b))
    .join("<Bullet />");

  return `${HEADER_SECTION_LEVEL} ${section}${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
};

const printRelations = (type, options) => {
  const relations = {
    "Returned by": getRelationOfReturn,
    "Member of": getRelationOfField,
    "Implemented by": getRelationOfImplementation,
  };

  let data = "";
  for (const [section, getRelation] of Object.entries(relations)) {
    data += printRelationOf(type, section, getRelation, options);
  }

  return data;
};

module.exports = {
  getRootTypeLocaleFromString,
  printRelationOf,
  printRelations,
};
