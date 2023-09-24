import type {
  GraphQLNamedType,
  GraphQLType,
  MDXString,
  Maybe,
  PrintLinkOptions,
  SchemaEntity,
  TypeLink,
  TypeLocale,
} from "@graphql-markdown/types";

import {
  getNamedType,
  getTypeName,
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
} from "@graphql-markdown/graphql";

import { slugify, pathUrl } from "@graphql-markdown/utils";

import { getGroup } from "./group";
import { DEPRECATED, ROOT_TYPE_LOCALE } from "./const/strings";
import { hasPrintableDirective } from "./common";

export const getLinkCategory = (type: unknown): Maybe<TypeLocale> => {
  switch (true) {
    case isDirectiveType(type):
      return ROOT_TYPE_LOCALE.DIRECTIVE;
    case isEnumType(type):
      return ROOT_TYPE_LOCALE.ENUM;
    case isInputType(type):
      return ROOT_TYPE_LOCALE.INPUT;
    case isInterfaceType(type):
      return ROOT_TYPE_LOCALE.INTERFACE;
    case isObjectType(type):
      return ROOT_TYPE_LOCALE.TYPE;
    case isOperation(type):
      return ROOT_TYPE_LOCALE.OPERATION;
    case isScalarType(type):
      return ROOT_TYPE_LOCALE.SCALAR;
    case isUnionType(type):
      return ROOT_TYPE_LOCALE.UNION;
  }
  return undefined;
};

export const hasOptionWithAttributes = (options: PrintLinkOptions): boolean => {
  return "withAttributes" in options && options.withAttributes === true;
};

export const hasOptionParentType = (options: PrintLinkOptions): boolean => {
  return (
    "parentTypePrefix" in options &&
    options.parentTypePrefix === true &&
    "parentType" in options &&
    typeof options.parentType !== "undefined"
  );
};

export const toLink = (
  type: unknown,
  name: string,
  operation: Maybe<TypeLocale>,
  options: PrintLinkOptions,
): TypeLink => {
  const fallback: TypeLink = {
    text: name,
    url: "#",
  };

  if (typeof type !== "object") {
    return fallback;
  }

  if (typeof options !== "undefined" && !hasPrintableDirective(type, options)) {
    return fallback;
  }

  const graphQLNamedType = getNamedType(type as Maybe<GraphQLType>);

  let category = getLinkCategory(graphQLNamedType);

  if (!category || !graphQLNamedType) {
    return fallback;
  }

  // special case for relation map
  if (category === ROOT_TYPE_LOCALE.OPERATION) {
    if (!operation) {
      return fallback;
    }
    category = operation;
  }

  if (typeof category === "object") {
    category = category.plural;
  }

  const text = graphQLNamedType.name || graphQLNamedType.toString();
  const deprecated =
    typeof options !== "undefined" &&
    "deprecated" in options &&
    options.deprecated === "group" &&
    isDeprecated(type)
      ? DEPRECATED
      : "";
  const group =
    "groups" in options && options.groups
      ? getGroup(type, options.groups, category as SchemaEntity)
      : "";

  const url = pathUrl.join(
    options.basePath,
    deprecated,
    group,
    category,
    slugify(text),
  );

  return {
    text: text,
    url: url,
  } as TypeLink;
};

export const getRelationLink = (
  category: Maybe<TypeLocale>,
  type: unknown,
  options: PrintLinkOptions,
): Maybe<TypeLink> => {
  if (
    !category ||
    typeof type !== "object" ||
    type === null ||
    !("name" in type)
  ) {
    return undefined;
  }
  return toLink(type, type.name as string, category, options);
};

export const printLinkAttributes = (
  type: unknown,
  text: Maybe<string> = "",
): string => {
  if (typeof type !== "object" || type === null) {
    return text ?? "";
  }

  if (
    !isLeafType(type) &&
    "ofType" in type &&
    typeof type.ofType !== "undefined"
  ) {
    text = printLinkAttributes(type.ofType as GraphQLNamedType, text);
  }

  if (isListType(type)) {
    return `[${text}]`;
  }

  if (isNonNullType(type)) {
    return `${text}!`;
  }

  return text ?? "";
};

export const printLink = (type: unknown, options: PrintLinkOptions): string => {
  if (typeof type !== "object" || type === null) {
    return "";
  }

  const link = toLink(
    type,
    getTypeName(type, String(type)),
    undefined,
    options,
  );

  if (typeof options !== "undefined" && !hasOptionWithAttributes(options)) {
    const textWithAttribute = hasOptionParentType(options)
      ? `<code style={{ fontWeight: 'normal' }}>${options.parentType}.<b>${link.text}</b></code>`
      : `\`${link.text}\``;
    return `[${textWithAttribute}](${link.url})`;
  }

  const text = printLinkAttributes(type, link.text);

  return `[\`${text}\`](${link.url})`;
};

export const printParentLink = (
  type: unknown,
  options: PrintLinkOptions,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("type" in type)) {
    return "";
  }

  return `<Bullet />${printLink(type.type, {
    ...options,
    withAttributes: true,
  })}` as MDXString;
};
