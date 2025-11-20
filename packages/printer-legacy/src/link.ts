/**
 * Module for handling links and link-related operations in GraphQL Markdown printer.
 * Provides utilities for creating, formatting, and managing links to GraphQL types and operations.
 * @packageDocumentation
 */

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

/**
 * Checks if a type has printable directives based on the provided options.
 *
 * @param type - The GraphQL type to check
 * @param options - Configuration options for directive printing (`deprecated`, `onlyDocDirectives`, `skipDocDirectives`)
 * @returns `true` if the type should be printed, `false` otherwise
 */
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

/**
 * Gets the locale category for a given GraphQL type.
 *
 * @param type - The GraphQL type to get the category for
 * @returns The locale category for the type, or `undefined` if not found
 */
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

/**
 * Gets the folder name for a link category based on the GraphQL type and operation locale.
 *
 * @param type - The GraphQL type to get the folder name for
 * @param operationLocale - The locale of the operation
 * @returns The folder name for the link category, or `undefined` if not found
 */
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

/**
 * Checks if the options include the `withAttributes` attribute.
 *
 * @param options - The options to check
 * @returns `true` if the options include `withAttributes`, `false` otherwise
 */
export const hasOptionWithAttributes = (options: PrintLinkOptions): boolean => {
  return "withAttributes" in options && options.withAttributes === true;
};

/**
 * Checks if the options include the `parentTypePrefix` attribute.
 *
 * @param options - The options to check
 * @returns `true` if the options include `parentTypePrefix`, `false` otherwise
 */
export const hasOptionParentType = (options: PrintLinkOptions): boolean => {
  return (
    "parentTypePrefix" in options &&
    options.parentTypePrefix === true &&
    "parentType" in options &&
    typeof options.parentType !== "undefined"
  );
};

/**
 * Gets the folder name for an API group based on the GraphQL type and group options.
 *
 * @param type - The GraphQL type to get the folder name for
 * @param groups - The group options
 * @returns The folder name for the API group
 */
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

/**
 * Gets the folder name for deprecated types based on the GraphQL type and deprecation option.
 *
 * @param type - The GraphQL type to get the folder name for
 * @param option - The deprecation option
 * @returns The folder name for deprecated types
 */
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

/**
 * Converts a GraphQL type to a link object.
 *
 * @param type - The GraphQL type to convert
 * @param name - The name of the type
 * @param operation - The locale of the operation
 * @param options - Configuration options for link generation
 * @returns The link object for the type
 */
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

  if (typeof type !== "object" || !hasPrintableDirective(type, options)) {
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

  const formatFolder = (folder: string): string => {
    return folder && options.formatCategoryFolderName
      ? options.formatCategoryFolderName(folder)
      : folder;
  };

  const url = pathUrl.join(
    options.basePath,
    formatFolder(deprecatedFolder),
    formatFolder(groupFolder),
    formatFolder(apiGroupFolder),
    formatFolder(category),
    `${slugify(text)}`,
  );

  const link = {
    text,
    url,
  } as TypeLink;

  if (options.formatMDXLink) {
    return options.formatMDXLink(link) as TypeLink;
  }

  return link;
};

/**
 * Gets the link for a relation based on the category, type, and options.
 *
 * @param category - The locale category of the relation
 * @param type - The GraphQL type of the relation
 * @param options - Configuration options for link generation
 * @returns The link object for the relation, or `undefined` if not found
 */
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

/**
 * Prints the attributes of a link based on the GraphQL type.
 *
 * @param type - The GraphQL type to print attributes for
 * @param text - The text to append attributes to
 * @returns The text with appended attributes
 */
export const printLinkAttributes = (
  type: unknown,
  text: Maybe<string> = "",
): string => {
  if (typeof type !== "object" || type === null) {
    return text ?? "";
  }

  if (!isLeafType(type) && "ofType" in type && type.ofType !== undefined) {
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

/**
 * Prints a link for a GraphQL type based on the provided options.
 *
 * @param type - The GraphQL type to print a link for
 * @param options - Configuration options for link generation
 * @returns The formatted link as a string
 */
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

  if (!hasOptionWithAttributes(options)) {
    const textWithAttribute = options.formatMDXNameEntity!(
      link.text,
      options.parentType,
    );
    return `[${textWithAttribute}](${link.url})`;
  }

  const text = printLinkAttributes(type, link.text);

  return `[${options.formatMDXNameEntity!(text)}](${link.url})`;
};

/**
 * Prints a parent link for a GraphQL type based on the provided options.
 *
 * @param type - The GraphQL type to print a parent link for
 * @param options - Configuration options for link generation
 * @returns The formatted parent link as a string or MDX string
 */
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
  ) as MDXString;
};
