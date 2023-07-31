import { GraphQLArgument, GraphQLEnumValue, GraphQLField, GraphQLInterfaceType, GraphQLNamedType, GraphQLType } from "graphql/type/definition";

import {
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
  hasProperty,
  toSlug,
  pathUrl,
  SchemaEntities,
} from "@graphql-markdown/utils";

import { getGroup } from "./group";
import { DEPRECATED, ROOT_TYPE_LOCALE, TypeLocale } from "./const/strings";
import { Options,DeprecatedOption } from "./const/options";
import { MDXString } from "./const/mdx";

export type TypeLink = {
  text: string,
  url: string,
}

export class Link {
  static getLinkCategory = (graphLQLNamedType: GraphQLNamedType): TypeLocale | undefined => {
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

  static toLink = (type: GraphQLEnumValue | GraphQLNamedType | GraphQLArgument, name: string, operation?: TypeLocale, options?: Options): TypeLink => {
    const fallback: TypeLink = {
      text: name,
      url: "#",
    };

    if (typeof type === "undefined") {
      return fallback;
    }

    if (typeof options !== "undefined" && "skipDocDirective" in options) {
      if (hasDirective(type, options.skipDocDirective)) {
        return fallback;
      }
    }

    const graphLQLNamedType = getNamedType(type as unknown as GraphQLType); // TODO: REVIEW

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

    const text = graphLQLNamedType.name || graphLQLNamedType.toString();
    const deprecated =
    typeof options !== "undefined" && "deprecated" in options &&
      options.deprecated === DeprecatedOption.GROUP &&
      isDeprecated(type)
        ? DEPRECATED
        : "";
    const group = typeof options !== "undefined" && "groups" in options && typeof options.groups !== "undefined"
      ? getGroup(type, options.groups, category.plural as SchemaEntities)
      : "";
    const url = pathUrl.join(
      options!.basePath,
      deprecated,
      group,
      category.plural,
      toSlug(text),
    );

    return {
      text: text,
      url: url,
    } as TypeLink;
  };

  static getRelationLink = (category: TypeLocale, type: GraphQLNamedType, options: Options): TypeLink | undefined => {
    if (typeof category === "undefined") {
      return undefined;
    }
    return Link.toLink(type, type.name, category, options);
  };

  static printParentLink = (type: GraphQLNamedType | GraphQLArgument | GraphQLEnumValue | GraphQLInterfaceType | GraphQLField<any, any, any>, options: Options): string | MDXString => {
    return "type" in type
      ? `<Bullet />${Link.printLink(type.type as GraphQLNamedType, {
        ...options,
          withAttributes: true,
        })}` as MDXString
      : "";
  };

  static hasOptionWithAttributes = (options: Options): boolean =>
    hasProperty(options, "withAttributes") === true &&
    options.withAttributes === true;

  static hasOptionParentType = (options: Options): boolean =>
    hasProperty(options, "parentTypePrefix") &&
    options.parentTypePrefix === true &&
    hasProperty(options, "parentType") &&
    typeof options.parentType !== "undefined" &&
    options.parentType !== null;

  static printLink = (type: GraphQLEnumValue | GraphQLNamedType | GraphQLArgument | GraphQLInterfaceType | GraphQLField<any, any, any>, options: Options) => {
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

  static printLinkAttributes = (type: GraphQLEnumValue | GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any>, text: string) => {
    if (typeof type === "undefined" || type === null) {
      return text ?? "";
    }

    if (!isLeafType(type) && "ofType" in type && typeof type.ofType != "undefined") {
      text = Link.printLinkAttributes(type.ofType as GraphQLNamedType, text);
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
