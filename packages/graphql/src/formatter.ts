/**
 * Internal library of helpers for formatting GraphQL values.
 *
 * @packageDocumentation
 */

import { Kind, print } from "graphql/language";
import type { ObjectFieldNode, ValueNode } from "graphql/language";
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
 * Convert an untyped JavaScript value (e.g. a custom scalar default) into a GraphQL AST value node.
 * Values that cannot be represented as GraphQL literals are skipped.
 *
 * @internal
 *
 * @param value - the untyped value to convert.
 *
 * @returns a GraphQL value node, or undefined if the value is not representable.
 *
 */
const _valueToAST = (value: unknown): Maybe<ValueNode> => {
  if (typeof value === "string") {
    return { kind: Kind.STRING, value };
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
    if (Number.isInteger(value)) {
      return { kind: Kind.INT, value: String(value) };
    }
    return { kind: Kind.FLOAT, value: String(value) };
  }

  if (typeof value === "boolean") {
    return { kind: Kind.BOOLEAN, value };
  }

  if (value === null) {
    return { kind: Kind.NULL };
  }

  if (Array.isArray(value)) {
    const values = value
      .map((item) => {
        return _valueToAST(item);
      })
      .filter((item): item is ValueNode => {
        return Boolean(item);
      });
    return { kind: Kind.LIST, values };
  }

  if (typeof value === "object") {
    const fields = Object.entries(value as Record<string, unknown>)
      .filter(([key]) => {
        return /^[_A-Za-z][_0-9A-Za-z]*$/.test(key);
      })
      .map(([key, item]): Maybe<ObjectFieldNode> => {
        const fieldValue = _valueToAST(item);
        if (!fieldValue) {
          return undefined;
        }
        return {
          kind: Kind.OBJECT_FIELD,
          name: { kind: Kind.NAME, value: key },
          value: fieldValue,
        };
      })
      .filter((field): field is ObjectFieldNode => {
        return Boolean(field);
      });
    return { kind: Kind.OBJECT, fields };
  }

  return undefined;
};

/**
 * Format an enum or scalar GraphQL type value into a printable equivalent based on the type.
 * Enum values are returned as-is; string, list and object values are printed as escaped
 * single-line GraphQL literals (same as graphql-js `printSchema`); other values are unchanged.
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

  if (
    typeof defaultValue === "string" ||
    Array.isArray(defaultValue) ||
    (defaultValue !== null && typeof defaultValue === "object")
  ) {
    const ast = _valueToAST(defaultValue);
    return ast ? print(ast) : defaultValue;
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
