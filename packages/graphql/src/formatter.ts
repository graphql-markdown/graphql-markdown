/**
 * Internal library of helpers for formatting GraphQL values.
 *
 * @packageDocumentation
 */

import { Kind, print } from "graphql/language";
import {
  getNamedType,
  isEnumType,
  isInputObjectType,
  isListType,
  isNonNullType,
} from "graphql/type";

import type {
  GraphQLSchemaEntity,
  GraphQLType,
  Maybe,
} from "@graphql-markdown/types";
/**
 * Format an enum or scalar GraphQL type value into a printable equivalent based on the type.
 * Enum values are returned as-is; string values are printed as escaped single-line
 * GraphQL string literals (same as graphql-js `printSchema`); other values are unchanged.
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

  if (typeof defaultValue === "string") {
    return print({ kind: Kind.STRING, value: defaultValue });
  }

  return defaultValue;
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
  if (type === undefined || type === null) {
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

const _formatInputDefaultValues = <T>(
  type: Maybe<GraphQLType>,
  defaultValue: T,
): T | string => {
  if (type === undefined || type === null) {
    return "";
  }
  if (
    isInputObjectType(type) &&
    defaultValue !== null &&
    typeof defaultValue === "object"
  ) {
    const fields = type.getFields();
    const fieldStrings = Object.entries(defaultValue as Record<string, unknown>)
      .map(([key, value]) => {
        if (key in fields) {
          const fieldType = fields[key].type;
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          const formattedValue = getFormattedDefaultValue({
            type: fieldType,
            defaultValue: value,
          });
          return `${key}: ${formattedValue}`;
        }
        return "";
      })
      .filter((str) => {
        return str !== "";
      });
    return `{ ${fieldStrings.join(", ")} }`;
  }
  return _formatDefaultValue(type, defaultValue);
};

/**
 * Returns a printable formatted value for a GraphQL type.
 * This is the generic function.
 *
 * @param entity - the GraphQL schema entity processed.
 *
 * @returns a printable formatted value.
 *
 */
export const getFormattedDefaultValue = <T>({
  type,
  defaultValue,
}: GraphQLSchemaEntity<T>): Maybe<T | string> => {
  if (
    type === undefined ||
    type === null ||
    defaultValue === undefined ||
    defaultValue === null
  ) {
    return undefined;
  }

  const nullableType = isNonNullType(type) ? type.ofType : type;

  if (isListType(nullableType)) {
    return _formatListDefaultValues(getNamedType(nullableType), defaultValue);
  }

  if (isInputObjectType(nullableType)) {
    return _formatInputDefaultValues(nullableType, defaultValue);
  }

  return _formatDefaultValue(nullableType, defaultValue);
};
