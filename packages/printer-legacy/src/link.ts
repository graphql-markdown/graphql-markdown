import type {
  ApiGroupOverrideType,
  GraphQLNamedType,
  GraphQLType,
  MDXString,
  Maybe,
  PrintLinkOptions,
  PrintTypeOptions,
  SchemaEntity,
  TypeDeprecatedOption,
  TypeHierarchyObjectType,
  TypeHierarchyValueType,
  TypeLink,
  TypeLocale,
} from "@graphql-markdown/types";

import {
  getNamedType,
  getTypeName,
  hasDirective,
  isApiType,
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

import { pathUrl, slugify, toString } from "@graphql-markdown/utils";

import { getGroup } from "./group";
import { DEPRECATED, ROOT_TYPE_LOCALE } from "./const/strings";
import { TypeHierarchy } from "./const/options";

export const API_GROUPS: Required<ApiGroupOverrideType> = {
  operations: "operations",
  types: "types",
} as const;

export const hasPrintableDirective = (
  type: unknown,
  options?: Pick<
    PrintTypeOptions,
    "deprecated" | "onlyDocDirectives" | "skipDocDirectives"
  >,
): boolean => {
  if (!type) {
    return false;
  }

  if (!options) {
    return true;
  }

  const skipDirective =
    "skipDocDirectives" in options && options.skipDocDirectives
      ? hasDirective(type, options.skipDocDirectives)
      : false;

  const skipDeprecated =
    "deprecated" in options &&
    options.deprecated === "skip" &&
    isDeprecated(type);

  const onlyDirective =
    "onlyDocDirectives" in options && options.onlyDocDirectives
      ? hasDirective(type, options.onlyDocDirectives, true)
      : true;

  return !(skipDirective || skipDeprecated) && onlyDirective;
};

export const getCategoryLocale = (type: unknown): Maybe<TypeLocale> => {
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

export const getLinkCategoryFolder = (
  type: unknown,
  operationLocale?: Maybe<TypeLocale>,
): Maybe<string> => {
  const categoryLocale = getCategoryLocale(type);

  if (!categoryLocale) {
    return undefined;
  }

  // special case for relation map
  if (categoryLocale === ROOT_TYPE_LOCALE.OPERATION) {
    if (!operationLocale) {
      return undefined;
    }
    return typeof operationLocale === "object"
      ? operationLocale.plural
      : operationLocale;
  }

  return typeof categoryLocale === "object"
    ? categoryLocale.plural
    : categoryLocale;
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

export const getLinkApiGroupFolder = (
  type: unknown,
  groups?: Maybe<ApiGroupOverrideType | boolean>,
): string => {
  let folderNames = API_GROUPS;
  if (groups && typeof groups === "object") {
    folderNames = { ...API_GROUPS, ...groups };
  }
  return isApiType(type) ? folderNames.operations : folderNames.types;
};

export const getLinkDeprecatedFolder = (
  type: unknown,
  option: Maybe<TypeDeprecatedOption>,
): string => {
  return option === "group" && isDeprecated(type) ? DEPRECATED : "";
};

const isHierarchy = (
  options: Maybe<PrintLinkOptions>,
  hierarchy: TypeHierarchyValueType,
): options is PrintLinkOptions & { hierarchy: TypeHierarchyObjectType } => {
  return (options?.hierarchy?.[hierarchy] && true) as boolean;
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

  if (
    typeof type !== "object" ||
    (typeof options !== "undefined" && !hasPrintableDirective(type, options))
  ) {
    return fallback;
  }

  const graphQLNamedType = getNamedType(type as Maybe<GraphQLType>);
  if (!graphQLNamedType) {
    return fallback;
  }

  let category: Maybe<string> = "";
  let deprecatedFolder = "";
  let groupFolder = "";
  let apiGroupFolder = "";

  if (!isHierarchy(options, TypeHierarchy.FLAT)) {
    category = getLinkCategoryFolder(graphQLNamedType, operation);

    if (!category) {
      return fallback;
    }

    deprecatedFolder = options.deprecated
      ? getLinkDeprecatedFolder(type, options.deprecated)
      : "";
    groupFolder = options.groups
      ? getGroup(type, options.groups, category as SchemaEntity)
      : "";
    apiGroupFolder = isHierarchy(options, TypeHierarchy.API)
      ? getLinkApiGroupFolder(type)
      : "";
  }

  const text = graphQLNamedType.name || graphQLNamedType.toString();

  const url = pathUrl.join(
    options.basePath,
    deprecatedFolder,
    apiGroupFolder,
    groupFolder,
    category,
    `${slugify(text)}`,
  );

  const link = {
    text,
    url,
  } as TypeLink;

  if (options.formatMDXLink) {
    return options.formatMDXLink(link);
  }

  return link;
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
    getTypeName(type, toString(type)),
    undefined,
    options,
  );

  if (typeof options !== "undefined" && !hasOptionWithAttributes(options)) {
    const textWithAttribute = options.formatMDXNameEntity!(
      link.text,
      options.parentType,
    );
    return `[${textWithAttribute}](${link.url})`;
  }

  const text = printLinkAttributes(type, link.text);

  return `[${options.formatMDXNameEntity!(text)}](${link.url})`;
};

export const printParentLink = (
  type: unknown,
  options: PrintLinkOptions,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("type" in type)) {
    return "";
  }

  return options.formatMDXBullet!(
    printLink(type.type, {
      ...options,
      withAttributes: true,
    }),
  );
};
