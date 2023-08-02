/**
 * String functions
 */

import { getObjPath } from "./object";

export function stringCaseBuilder(
  str: string,
  transformation?: (word: string) => string,
  separator?: string,
): string {
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

export function prune(str: string, char: string = ""): string {
  let res = str;

  if (res.startsWith(char)) {
    // Remove first character
    res = res.slice(1);
  }

  if (res.endsWith(char)) {
    // Remove last character
    res = res.slice(0, -1);
  }

  return res;
}

export function toSlug(str: string): string {
  return kebabCase(str);
}

export function toHTMLUnicode(char: string): string {
  const unicodeChar = char.charCodeAt(0).toString(16).padStart(4, "0");
  return `&#x${unicodeChar.toUpperCase()};`;
}

export function escapeMDX(str: unknown): string {
  return `${str}`.replace(/[<>{}]/g, toHTMLUnicode);
}

export function firstUppercase(word: string): string {
  const sliceUppercase = word.slice(0, 1).toUpperCase();
  const sliceDefaultCase = word.slice(1);
  return `${sliceUppercase}${sliceDefaultCase}`;
}

export function capitalize(word: string): string {
  return firstUppercase(word.toLowerCase());
}

// from https://stackoverflow.com/a/37511463
export function replaceDiacritics(str: string): string {
  if (typeof str !== "string") {
    return "";
  }
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function startCase(str: string): string {
  return stringCaseBuilder(str, firstUppercase, " ");
}

export function kebabCase(str: string): string {
  return stringCaseBuilder(str, (word: string) => word.toLowerCase(), "-");
}

export function interpolate(
  template: string,
  variables?: Record<string, unknown>,
  fallback?: string,
): string {
  const regex = /\${[^{]+}/g;

  return template.replace(regex, (match) => {
    const objPath = match.slice(2, -1).trim();
    return getObjPath(objPath, variables, fallback) as string;
  });
}
