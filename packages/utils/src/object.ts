/**
 * Internal library of helpers for manipulating objects.
 *
 * @packageDocumentation
 */

/**
 * Check if an object contains key/value records.
 *
 * @internal
 *
 * @param obj - the key/value record object.
 *
 * @example
 * ```js
 * import { isEmpty } from '@graphql-markdown/utils/object';
 *
 * const obj = {
 *   bool: true,
 *   string: "test",
 *   number: 123,
 *   array: ["one", "two"],
 *   child: { key: "value" },
 * };
 *
 * isEmpty(obj); // Returns false
 *
 * isEmpty({}); // Returns true
 * ```
 *
 * @returns `false` if the object is a valid k/v set of records, else `true`.
 *
 */
export const isEmpty = <T extends Record<string, unknown>>(
  obj: unknown,
): obj is Exclude<typeof obj, T> => {
  return !(
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length > 0
  );
};

/**
 * Type guard that checks if a value is an object with a string property.
 *
 * @template Property - The name of the property to check
 * @param value - The value to check
 * @param property - The name of the property that should be a string
 * @returns `true` if value is an object with the specified property as a string, `false` otherwise
 *
 * @example
 * ```typescript
 * const obj: unknown = { name: "John" };
 * if (hasStringProperty(obj, "name")) {
 *   console.log(obj.name); // TypeScript knows obj.name is a string
 * }
 * ```
 */
export const hasStringProperty = (
  value: unknown,
  property: string,
): value is Record<typeof property, string> => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record[property] === "string";
};
