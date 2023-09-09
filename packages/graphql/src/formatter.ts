/**
 * Internal library of helpers for formatting GraphQL values.
 *
 * @packageDocumentation
 */

import type { GraphQLType } from "graphql";
import {
  getNamedType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  isEnumType,
  isListType,
} from "graphql";

import type { Maybe } from "@graphql-markdown/types";

/**
 * Format an enum or scalar GraphQL type value into a printable equivalent based on the type.
 *
 * @internal
 *
 * @param type - the GraphQL schema type.
 * @param defaultValue - the GraphQL schema type's value to be processed
 *
 * @returns a printable formatted value.
 *
 */
const _formatDefaultValue = <T>(
  type: Maybe<GraphQLType>,
  defaultValue: T,
): T | string => {
  if (isEnumType(type)) {
    return defaultValue;
  }

  switch (type) {
    case GraphQLInt:
    case GraphQLFloat:
    case GraphQLBoolean:
      return defaultValue;
    case GraphQLID:
    case GraphQLString:
      return `"${defaultValue}"`;
    default:
      return defaultValue;
  }
};

/**
 * Format a list GraphQL type value into a printable equivalent.
 *
 * @internal
 *
 * @param type - the GraphQL schema type.
 * @param defaultValue - the GraphQL schema type's value to be processed
 *
 * @returns a printable formatted value.
 *
 */
const _formatListDefaultValues = <T>(
  type: Maybe<GraphQLType>,
  defaultValue: T,
): string => {
  if (typeof type === "undefined" || type === null) {
    return "";
  }

  const defaultValues: T[] = Array.isArray(defaultValue)
    ? defaultValue
    : [defaultValue];

  const defaultValuesString = defaultValues.map((defaultValue) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return getFormattedDefaultValue({ type, defaultValue });
  });

  return `[${defaultValuesString.join(", ")}]`;
};

/**
 * Returns a printable formatted value for a GraphQL type.
 * This is the generic function.
 *
 * @param entity - the GraphQL schema entity processed.
 * @param entity.type - the GraphQL schema type.
 * @param entity.defaultValue - the GraphQL schema type's value to be formatted.
 *
 * @returns a printable formatted value.
 *
 */
export const getFormattedDefaultValue = <T>({
  type,
  defaultValue,
}: {
  type: Maybe<GraphQLType>;
  defaultValue: T;
}): Maybe<T | string> => {
  if (
    typeof type === "undefined" ||
    type === null ||
    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
    typeof defaultValue === "undefined" ||
    defaultValue === null
  ) {
    return undefined;
  }

  if (isListType(type)) {
    return _formatListDefaultValues(getNamedType(type), defaultValue);
  }

  return _formatDefaultValue(type, defaultValue);
};
