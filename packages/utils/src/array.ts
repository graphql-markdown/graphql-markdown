/**
 * Array functions
 */

import type { Maybe } from "@graphql-markdown/types";

export function toArray(param: unknown): Maybe<unknown[]> {
  if (typeof param !== "object" || param === null) {
    return undefined;
  }
  return Object.keys(param).map(
    (key: string): unknown => (param as Record<string, unknown>)[key],
  );
}

export function convertArrayToObject<T>(typeArray: T[]): Record<string, T> {
  return typeArray.reduce(
    (result, entry: T) => {
      if (typeof entry === "object" && entry !== null) {
        const key =
          "name" in entry &&
          typeof entry.name !== "undefined" &&
          entry.name !== null
            ? String(entry.name)
            : null;
        if (key === null) {
          return result;
        }
        result[key] = entry;
      }
      return result;
    },
    {} as Record<string, T>,
  );
}
