/**
 * Library of helpers for formatting strings.
 *
 * @packageDocumentation
 */

import type { Maybe } from "@graphql-markdown/types";

import { getObjPath } from "./object";

/**
 * stringCaseBuilder
 *
 * @internal
 *
 */
export function stringCaseBuilder(
  str: Maybe<string>,
  transformation?: Maybe<(word: string) => string>,
  separator?: string,
): string {
  if (typeof str !== "string") {
    return "";
  }
  const hasTransformation = typeof transformation === "function";
  const stringCase = replaceDiacritics(str)
    .replace(/([a-z]+|\d+)([A-Z])/g, "$1 $2")
    .replace(/([a-z]+)(\d)/g, "$1 $2")
    .replace(/(\d+)([a-z])/g, "$1 $2")
    .split(/[^0-9A-Za-z]+/g)
    .map((word) => (hasTransformation ? transformation(word) : word))
    .join(separator);
  return prune(stringCase, separator);
}

/**
 * prune
 *
 * @internal
 *
 */
export function prune(str: Maybe<string>, char: string = ""): string {
  if (typeof str !== "string") {
    return "";
  }
  let res = str;
  res = res.startsWith(char) ? res.slice(1) : res;
  res = res.endsWith(char) ? res.slice(0, -1) : res;
  return res;
}

/**
 * toSlug
 *
 *
 */
export function toSlug(str: Maybe<string>): string {
  if (typeof str !== "string") {
    return "";
  }
  return kebabCase(str);
}

/**
 * toHTMLUnicode
 *
 * @internal
 *
 */
export function toHTMLUnicode(char: Maybe<string>): string {
  if (typeof char !== "string") {
    return "";
  }
  const unicodeChar = char.charCodeAt(0).toString(16).padStart(4, "0");
  return `&#x${unicodeChar.toUpperCase()};`;
}

/**
 * escapeMDX
 *
 * @internal
 *
 */
export function escapeMDX(str: unknown): string {
  return `${String(str)}`.replace(/[<>{}]/g, toHTMLUnicode);
}

/**
 * firstUppercase
 *
 *
 */
export function firstUppercase(word: Maybe<string>): string {
  if (typeof word !== "string") {
    return "";
  }
  const sliceUppercase = word.slice(0, 1).toUpperCase();
  const sliceDefaultCase = word.slice(1);
  return `${sliceUppercase}${sliceDefaultCase}`;
}

/**
 * capitalize
 *
 *
 */
export function capitalize(word: Maybe<string>): string {
  if (typeof word !== "string") {
    return "";
  }
  return firstUppercase(word.toLowerCase());
}

/**
 * replaceDiacritics
 *
 * {@link https://stackoverflow.com/a/37511463 | StackOverflow source}
 *
 * @internal
 *
 */
// from https://stackoverflow.com/a/37511463
export function replaceDiacritics(str: Maybe<string>): string {
  if (typeof str !== "string") {
    return "";
  }
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * startCase
 *
 *
 */
export function startCase(str: Maybe<string>): string {
  if (typeof str !== "string") {
    return "";
  }
  return stringCaseBuilder(str, firstUppercase, " ");
}

/**
 * kebabCase
 *
 *
 */
export function kebabCase(str: Maybe<string>): string {
  if (typeof str !== "string") {
    return "";
  }
  return stringCaseBuilder(str, (word: string) => word.toLowerCase(), "-");
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
