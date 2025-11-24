/**
 * Internal library of helpers for manipulating array and list.
 *
 * @packageDocumentation
 */

import type { Maybe } from "@graphql-markdown/types";
import { toString } from "./string";

/**
 * Returns an array of values from a k/v object.
 *
 * @internal
 *
 * @param recordMap - the key/value record object to be converted.
 *
 * @example
 * ```js
 * import { toArray } from '@graphql-markdown/utils/array';
 *
 * toArray({
 *     bool: true,
 *     string: "test",
 *     number: 123,
 *     array: ["one", "two"],
 *     child: { key: "value" },
 *   });
 *
 * // Expected result: [true, "test", 123, ["one", "two"], { key: "value" }]
 * ```
 *
 * @returns an array of object values, or `undefined` if `recordMap` is not a valid object.
 *
 */
export const toArray = (
  recordMap: Maybe<Record<string, unknown>>,
): Maybe<unknown[]> => {
  if (typeof recordMap !== "object" || recordMap === null) {
    return undefined;
  }

  return Object.values(recordMap);
};

/**
 * Returns a k/v object from an array of objects with a `name` property.
 *
 * @internal
 *
 * @param list - the list of objects of type `{ name: any }` to be converted.
 *
 * @typeParam T - the type of objects the list contains.
 *
 * @returns an array of object values with `name` as key, or `undefined` if `list` is not a valid array.
 *
 * @example
 * ```js
 * import { convertArrayToMapObject } from '@graphql-markdown/utils/array';
 *
 * convertArrayToMapObject([
 *     { name: true },
 *     { name: "test" },
 *     { name: 123 },
 *     { name2: 1234 },
 *   ]);
 *
 * // Expected result: {
 * //   true: { name: true },
 * //   test: { name: "test" },
 * //   "123": { name: 123 },
 * // }
 * ```
 *
 */
export const convertArrayToMapObject = <T>(
  list: Maybe<T[]>,
): Maybe<Record<string, T>> => {
  if (!Array.isArray(list)) {
    return undefined;
  }

  return list.reduce<Record<string, T>>((result, entry: T) => {
    if (typeof entry === "object" && entry !== null) {
      const key = "name" in entry && entry.name ? toString(entry.name) : null;
      if (key === null) {
        return result;
      }
      result[key] = entry;
    }
    return result;
  }, {});
};
