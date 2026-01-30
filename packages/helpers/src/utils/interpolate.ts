/**
 * Helpers utility functions library.
 *
 * @packageDocumentation
 */

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
 * @returns the property value if the path is resolved, else returns the `fallback` value.
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
 */
export const getObjPath = (
  path: Maybe<string>,
  obj: unknown,
  fallback: unknown = "",
): unknown => {
  if (isEmpty(obj) || typeof path !== "string") {
    return String(fallback);
  }

  return path.split(".").reduce((res: unknown, key: string): unknown => {
    if (typeof res !== "object" || res === null) {
      return String(fallback);
    }
    return (res as Record<string, unknown>)[key] ?? String(fallback);
  }, obj);
};

/**
 * Interpolate a template literal-like string.
 *
 * @param template - a string template literal-like.
 * @param variables - a record map of values with variable's name as key and `description` as directive's description.
 * @param fallback - optional fallback value if a variable cannot be substituted.
 *
 * @returns an interpolated new string from the template.
 *
 * @example
 * ```js
 * const values = { foo: 42, bar: { value: "test" } };
 * const template = "${foo} is not ${bar.notfound}";
 *
 * interpolate(template, values, "fallback"); // Expected result: "42 is not fallback",
 * ```
 *
 */

export const interpolate = (
  template: string,
  variables: Maybe<Record<string, unknown> & { description?: string }>,
  fallback?: string,
): string => {
  const regex = /\$\{[^{]+\}/g;
  return template.replaceAll(regex, (match) => {
    const objPath = match.slice(2, -1).trim();
    return getObjPath(objPath, variables, fallback) as string;
  });
};
