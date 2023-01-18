const {
  string: { toSlug },
  object: { hasProperty },
  url: { pathUrl },
  graphql: {
    isEnumType,
    isUnionType,
    isObjectType,
    isScalarType,
    isOperation,
    isDirectiveType,
    isInterfaceType,
    getNamedType,
    isInputType,
    hasDirective,
  },
} = require("@graphql-markdown/utils");

const { ROOT_TYPE_LOCALE } = require("./const/strings");

const getRootTypeLocaleFromString = (text) => {
  for (const [type, props] of Object.entries(ROOT_TYPE_LOCALE)) {
    if (Object.values(props).includes(text)) {
      return ROOT_TYPE_LOCALE[type];
    }
  }
  return undefined;
};

const getLinkCategory = (graphLQLNamedType) => {
  switch (true) {
    case isEnumType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.ENUM;
    case isUnionType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.UNION;
    case isInterfaceType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.INTERFACE;
    case isObjectType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.TYPE;
    case isInputType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.INPUT;
    case isScalarType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.SCALAR;
    case isDirectiveType(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.DIRECTIVE;
    case isOperation(graphLQLNamedType):
      return ROOT_TYPE_LOCALE.OPERATION;
  }
  return undefined;
};

const getGroup = (type) => {
  if (typeof this.groups === "undefined") {
    return "";
  }
  const graphLQLNamedType = getNamedType(type);
  const typeName = graphLQLNamedType.name || graphLQLNamedType;
  return hasProperty(this.groups, typeName)
    ? toSlug(this.groups[typeName])
    : "";
};

const getRelationLink = (category, type) => {
  if (typeof category === "undefined") {
    return "";
  }
  const link = this.toLink(type, type.name, category);
  return `[\`${link.text}\`](${link.url})  <Badge class="secondary" text="${category.singular}"/>`;
};

const toLink = (type, name, operation) => {
  const fallback = {
    text: name,
    url: "#",
  };

  if (hasDirective(type, this.skipDocDirective)) {
    return fallback;
  }

  const graphLQLNamedType = getNamedType(type);

  let category = getLinkCategory(graphLQLNamedType);

  if (
    typeof category === "undefined" ||
    typeof graphLQLNamedType === "undefined" ||
    graphLQLNamedType === null
  ) {
    return fallback;
  }

  // special case for support relation map
  if (category === ROOT_TYPE_LOCALE.OPERATION) {
    if (typeof operation === "undefined") {
      return fallback;
    }
    category = operation;
  }

  const text = graphLQLNamedType.name || graphLQLNamedType;
  const group = getGroup(type);
  const url = pathUrl.join(
    this.linkRoot,
    this.baseURL,
    group,
    category.plural,
    toSlug(text),
  );

  return {
    text: text,
    url: url,
  };
};

const getTypeBadges = (type) => {
  const rootType = hasProperty(type, "type") ? type.type : type;

  const badges = [];

  if (type.isDeprecated) {
    badges.push("deprecated");
  }

  if (isNonNullType(rootType)) {
    badges.push("non-null");
  }

  if (isListType(rootType)) {
    badges.push("list");
  }

  const category = getLinkCategory(getNamedType(rootType));
  if (typeof category !== "undefined") {
    badges.push(category);
  }

  const group = getGroup(rootType);
  if (group !== "") {
    badges.push(group);
  }

  return badges;
};

module.exports = {
  getRootTypeLocaleFromString,
  getLinkCategory,
  getGroup,
  getRelationLink,
  toLink,
  getTypeBadges,
};
