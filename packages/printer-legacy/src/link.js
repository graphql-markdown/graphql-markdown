const {
  string: { toSlug },
  url: { pathUrl },
  object: { hasProperty },
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
    getTypeName,
    isListType,
    isNonNullType,
    isLeafType,
  },
} = require("@graphql-markdown/utils");

const { getGroup } = require("./group");
const { ROOT_TYPE_LOCALE } = require("./const/strings");

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

const getRelationLink = (category, type) => {
  if (typeof category === "undefined") {
    return "";
  }
  const link = toLink(type, type.name, category);
  return `[\`${link.text}\`](${link.url})  <Badge class="secondary" text="${category.singular}"/>`;
};

const toLink = (type, name, operation, linkRoot, baseURL, options) => {
  const fallback = {
    text: name,
    url: "#",
  };

  if (hasDirective(type, options.skipDocDirective ?? null)) {
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
    linkRoot,
    baseURL,
    group,
    category.plural,
    toSlug(text),
  );

  return {
    text: text,
    url: url,
  };
};

const printParentLink = (type, parentTypePrefix) => {
  return hasProperty(type, "type")
    ? `<Bullet />${printLink(type.type, true, undefined, parentTypePrefix)}`
    : "";
};

const printLink = (
  type,
  withAttributes = false,
  parentType = undefined,
  parentTypePrefix,
) => {
  const link = toLink(type, getTypeName(type));

  if (!withAttributes) {
    const printParentType =
      parentTypePrefix && typeof parentType !== "undefined";
    const text = printParentType
      ? `<code style={{ fontWeight: 'normal' }}>${parentType}.<b>${link.text}</b></code>`
      : `\`${link.text}\``;
    return `[${text}](${link.url})`;
  }

  const text = printLinkAttributes(type, link.text);

  return `[\`${text}\`](${link.url})`;
};

const printLinkAttributes = (type, text) => {
  if (typeof type === "undefined") {
    return text ?? "";
  }

  if (!isLeafType(type, text) && typeof type.ofType != "undefined") {
    text = printLinkAttributes(type.ofType, text);
  }

  if (isListType(type)) {
    return `[${text}]`;
  }

  if (isNonNullType(type)) {
    return `${text}!`;
  }

  return text;
};

module.exports = {
  getLinkCategory,
  getRelationLink,
  toLink,
  printParentLink,
  printLink,
  printLinkAttributes,
};
