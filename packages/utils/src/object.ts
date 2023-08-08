/**
 * Object functions
 */

import type { Maybe } from "@graphql-markdown/types";

export function isEmpty(obj: unknown): boolean {
  return !(
    typeof obj === "object" &&
    obj !== null &&
    Object.keys(obj).length > 0
  );
}

// get the specified property or nested property of an object
export function getObjPath(
  path: Maybe<string>,
  obj: unknown,
  fallback: unknown = "",
): unknown {
  if (isEmpty(obj) || typeof path !== "string" || path === null) {
    return fallback;
  }

  return path
    .split(".")
    .reduce((res: any, key: string) => res[key] || fallback, obj); // eslint-disable-line @typescript-eslint/no-explicit-any
}
