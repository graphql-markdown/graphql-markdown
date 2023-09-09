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
export const isEmpty = (obj: unknown): boolean => {
  return !(
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length > 0
  );
};
