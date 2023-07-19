const {
  graphql: {
    getNamedType,
    getTypeName,
    hasDirective,
    isDeprecated,
    isDirectiveType,
    isEnumType,
    isInputType,
    isInterfaceType,
    isLeafType,
    isListType,
    isNonNullType,
    isObjectType,
    isOperation,
    isScalarType,
    isUnionType,
  },
  object: { hasProperty },
  string: { toSlug },
  url: { pathUrl },
} = require("@graphql-markdown/utils");

const { getGroup } = require("./group");
const { DEPRECATED, ROOT_TYPE_LOCALE } = require("./const/strings");
const { OPTION_DEPRECATED } = require("./const/options");

class Link {
  static getLinkCategory = (graphLQLNamedType) => {
    switch (true) {
      case isDirectiveType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.DIRECTIVE;
      case isEnumType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.ENUM;
      case isInputType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.INPUT;
      case isInterfaceType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.INTERFACE;
      case isObjectType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.TYPE;
      case isOperation(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.OPERATION;
      case isScalarType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.SCALAR;
      case isUnionType(graphLQLNamedType):
        return ROOT_TYPE_LOCALE.UNION;
    }
    return undefined;
  };

  static toLink = (type, name, operation, options) => {
    const fallback = {
      text: name,
      url: "#",
    };

    if (typeof type === "undefined") {
      return fallback;
    }

    if (hasProperty(options, "skipDocDirective")) {
      if (hasDirective(type, options.skipDocDirective)) {
        return fallback;
      }
    }

    const graphLQLNamedType = getNamedType(type);

    let category = Link.getLinkCategory(graphLQLNamedType);

    if (
      typeof category === "undefined" ||
      typeof graphLQLNamedType === "undefined" ||
      graphLQLNamedType === null
    ) {
      return fallback;
    }

    // special case for relation map
    if (category === ROOT_TYPE_LOCALE.OPERATION) {
      if (typeof operation === "undefined") {
        return fallback;
      }
      category = operation;
    }

    const text = graphLQLNamedType.name || graphLQLNamedType;
    const deprecated =
      hasProperty(options, "printDeprecated") &&
      options.printDeprecated === OPTION_DEPRECATED.GROUP &&
      isDeprecated(type)
        ? DEPRECATED
        : "";
    const group = hasProperty(options, "groups")
      ? getGroup(type, options.groups, category.plural)
      : "";
    const url = pathUrl.join(
      options.basePath,
      deprecated,
      group,
      category.plural,
      toSlug(text),
    );

    return {
      text: text,
      url: url,
    };
  };

  static getRelationLink = (category, type, options) => {
    if (typeof category === "undefined") {
      return "";
    }
    return Link.toLink(type, type.name, category, options);
  };

  static printParentLink = (type, options) => {
    return hasProperty(type, "type")
      ? `<Bullet />${Link.printLink(type.type, {
          withAttributes: true,
          ...options,
        })}`
      : "";
  };

  static hasOptionWithAttributes = (options) =>
    hasProperty(options, "withAttributes") === true &&
    options.withAttributes === true;

  static hasOptionParentType = (options) =>
    hasProperty(options, "parentTypePrefix") &&
    options.parentTypePrefix === true &&
    hasProperty(options, "parentType") &&
    typeof options.parentType !== "undefined" &&
    options.parentType !== null;

  static printLink = (type, options) => {
    let text;

    const link = Link.toLink(
      type,
      getTypeName(type, type.toString()),
      undefined,
      options,
    );

    if (Link.hasOptionWithAttributes(options) === false) {
      text =
        Link.hasOptionParentType(options) === true
          ? `<code style={{ fontWeight: 'normal' }}>${options.parentType}.<b>${link.text}</b></code>`
          : `\`${link.text}\``;
      return `[${text}](${link.url})`;
    }

    text = Link.printLinkAttributes(type, link.text);

    return `[\`${text}\`](${link.url})`;
  };

  static printLinkAttributes = (type, text) => {
    if (typeof type === "undefined" || type === null) {
      return text ?? "";
    }

    if (!isLeafType(type, text) && typeof type.ofType != "undefined") {
      text = Link.printLinkAttributes(type.ofType, text);
    }

    if (isListType(type)) {
      return `[${text}]`;
    }

    if (isNonNullType(type)) {
      return `${text}!`;
    }

    return text;
  };
}

module.exports = Link;
