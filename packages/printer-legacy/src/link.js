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

class Link {
  static getLinkCategory = (graphLQLNamedType) => {
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
      options.basePath,
      group,
      category.plural,
      toSlug(text),
    );

    return {
      text: text,
      url: url,
    };
  };

  static getRelationLink = (category, type) => {
    if (typeof category === "undefined") {
      return "";
    }
    const link = Link.toLink(type, type.name, category);
    return `[\`${link.text}\`](${link.url})  <Badge class="secondary" text="${category.singular}"/>`;
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

    const link = Link.toLink(type, getTypeName(type), undefined, options);

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
