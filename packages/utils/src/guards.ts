/**
 * Type guard utilities for common validation patterns.
 *
 * This module consolidates reusable type guards that are used throughout
 * the codebase for validating GraphQL schema objects and other entities.
 *
 * @packageDocumentation
 */

/**
 * Type guard to check if a value is a plain object.
 *
 * @param obj - The value to check
 * @returns True if the value is a non-null object, false otherwise
 *
 * @example
 * ```typescript
 * import { isTypeObject } from "@graphql-markdown/utils/guards";
 *
 * if (isTypeObject(value)) {
 *   // value is now typed as Record<string, unknown>
 *   console.log(Object.keys(value));
 * }
 * ```
 */
export const isTypeObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === "object" && obj !== null;
};

/**
 * Type guard to check if an object has a specific property.
 *
 * @param obj - The object to check
 * @param key - The property name to look for
 * @returns True if the object has the property, false otherwise
 *
 * @example
 * ```typescript
 * import { hasProperty } from "@graphql-markdown/utils/guards";
 *
 * if (hasProperty(type, "args")) {
 *   // type.args is now accessible
 *   console.log(type.args);
 * }
 * ```
 */
export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown>;
// eslint-disable-next-line no-redeclare
export function hasProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, unknown>;
// eslint-disable-next-line no-redeclare
export function hasProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, unknown> {
  return isTypeObject(obj) && key in obj;
}

/**
 * Type guard to check if an object has multiple specific properties.
 *
 * @param obj - The object to check
 * @param keys - The property names to look for
 * @returns True if the object has all the properties, false otherwise
 *
 * @example
 * ```typescript
 * import { hasProperties } from "@graphql-markdown/utils/guards";
 *
 * if (hasProperties(type, "name", "description")) {
 *   // Both properties exist on type
 *   console.log(type.name, type.description);
 * }
 * ```
 */
export const hasProperties = <K extends PropertyKey>(
  obj: unknown,
  ...keys: K[]
): obj is Record<K, unknown> => {
  return (
    isTypeObject(obj) &&
    keys.every((key) => {
      return key in obj;
    })
  );
};

/**
 * Type guard to check if an object has an array property.
 *
 * @param obj - The object to check
 * @param key - The property name to look for
 * @returns True if the property exists and is an array, false otherwise
 *
 * @example
 * ```typescript
 * import { hasArrayProperty } from "@graphql-markdown/utils/guards";
 *
 * if (hasArrayProperty(type, "args")) {
 *   // type.args is now typed as unknown[]
 *   console.log(type.args.length);
 * }
 * ```
 */
export function hasArrayProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown[]>;
// eslint-disable-next-line no-redeclare
export function hasArrayProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, unknown[]>;
// eslint-disable-next-line no-redeclare
export function hasArrayProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, unknown[]> {
  return hasProperty(obj, key) && Array.isArray(obj[key]);
}

/**
 * Type guard to check if an object has a non-empty array property.
 *
 * @param obj - The object to check
 * @param key - The property name to look for
 * @returns True if the property exists, is an array, and is non-empty, false otherwise
 *
 * @example
 * ```typescript
 * import { hasNonEmptyArrayProperty } from "@graphql-markdown/utils/guards";
 *
 * if (hasNonEmptyArrayProperty(type, "args")) {
 *   // type.args is a non-empty array
 *   const firstArg = type.args[0];
 * }
 * ```
 */
export function hasNonEmptyArrayProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown[]>;
// eslint-disable-next-line no-redeclare
export function hasNonEmptyArrayProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, unknown[]>;
// eslint-disable-next-line no-redeclare
export function hasNonEmptyArrayProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, unknown[]> {
  return hasArrayProperty(obj, key) && obj[key].length > 0;
}

/**
 * Type guard to check if an object has a string property.
 *
 * @param obj - The object to check
 * @param key - The property name to look for
 * @returns True if the property exists and is a string, false otherwise
 *
 * @example
 * ```typescript
 * import { hasStringProperty } from "@graphql-markdown/utils/guards";
 *
 * if (hasStringProperty(type, "description")) {
 *   // type.description is now typed as string
 *   console.log(type.description.length);
 * }
 * ```
 */
export function hasStringProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, string>;
// eslint-disable-next-line no-redeclare
export function hasStringProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, string>;
// eslint-disable-next-line no-redeclare
export function hasStringProperty(
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, string> {
  return hasProperty(obj, key) && typeof obj[key] === "string";
}

/**
 * Type guard to check if an object has a function property.
 *
 * @param obj - The object to check
 * @param key - The property name to look for
 * @returns True if the property exists and is a function, false otherwise
 *
 * @example
 * ```typescript
 * import { hasFunctionProperty } from "@graphql-markdown/utils/guards";
 *
 * if (hasFunctionProperty(directive, "descriptor")) {
 *   // directive.descriptor is now typed as a function
 *   directive.descriptor();
 * }
 * ```
 */
export const hasFunctionProperty = (
  obj: unknown,
  key: PropertyKey,
): obj is Record<PropertyKey, (...args: unknown[]) => unknown> => {
  return hasProperty(obj, key) && typeof obj[key] === "function";
};
