import type { Maybe } from "@graphql-markdown/types";
import { isEmpty } from "@graphql-markdown/utils";

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

/**
 * interpolate
 *
 * @internal
 *
 */

export function interpolate(
  template: string,
  variables: Maybe<Record<string, unknown>>,
  fallback?: string,
): string {
  const regex = /\${[^{]+}/g;
  return template.replace(regex, (match) => {
    const objPath = match.slice(2, -1).trim();
    return getObjPath(objPath, variables, fallback) as string;
  });
}
