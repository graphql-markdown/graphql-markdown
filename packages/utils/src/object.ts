/**
 * Internal library of helpers for manipulating objects.
 *
 * @packageDocumentation
 */

import type { Maybe } from "@graphql-markdown/types";

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
 * isEmpty({
 *     bool: true,
 *     string: "test",
 *     number: 123,
 *     array: ["one", "two"],
 *     child: { key: "value" },
 *   });
 *
 * // Returns false
 *
 * isEmpty({}); // Returns true
 * ```
 *
 * @returns `false` if the object is a valid k/v set of records, else `true`.
 *
 */
export function isEmpty(obj: unknown): boolean {
  return !(
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length > 0
  );
}

/**
 * Returns the value of the specified property or nested property of an object using a string path.
 *
 * @internal
 *
 * @param path - property path as string.
 * @param obj - the key/value record object.
 * @param fallback - optional fallback value to be returned if the path cannot be resolved.
 *
 * @example
 * ```js
 * import { getObjPath } from '@graphql-markdown/utils/object';
 *
 * getObjPath("foo.bar", { foo: { bar: 42 } }); // Returns 42
 *
 * getObjPath("foo.bak", { foo: { bar: 42 } }, "fallback"); // Returns "fallback"
 * ```
 *
 * @returns the property value if the path is resolved, else returns the `fallback` value.
 *
 */
export function getObjPath(
  path: Maybe<string>,
  obj: unknown,
  fallback: unknown = "",
): unknown {
  if (isEmpty(obj) || typeof path !== "string") {
    return fallback;
  }

  return path
    .split(".")
    .reduce((res: any, key: string) => res[key] ?? fallback, obj); // eslint-disable-line @typescript-eslint/no-explicit-any
}
