/**
 * Array functions
 */

import type { Maybe } from "@graphql-markdown/types";

export function toArray(param: unknown): Maybe<unknown[]> {
  if (typeof param !== "object" || param === null) {
    return undefined;
  }
  return (Object.keys(param) as Array<string>).map(
    (key: string): unknown => (<Record<string, unknown>>param)[key],
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
            ? entry.name.toString()
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
