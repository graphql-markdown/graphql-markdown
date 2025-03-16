/**
 * Library of helpers for formatting strings.
 *
 * @packageDocumentation
 */

import type { Maybe } from "@graphql-markdown/types";

/**
 * Replaces diacritics by non-diacritic equivalent characters.
 *
 *
 * @param str - the string to be transformed.
 *
 * @returns a string with diacritic characters replaced, or an empty string if `str` is not a valid string.
 *
 *  * @example
 * ```js
 * import { replaceDiacritics } from "@graphql-markdown/utils/string";
 *
 * replaceDiacritics("Âéêś"); // Expected result: "Aees"
 * ```
 *
 * @see {@link https://stackoverflow.com/a/37511463 | StackOverflow source}.
 *
 */
export const replaceDiacritics = (str: Maybe<string>): string => {
  if (typeof str !== "string") {
    return "";
  }
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

/**
 * Returns a string pruned on both start and end, similar to `trim()` but with any substring.
 *
 * @internal
 *
 * @param str - the string to be pruned.
 * @param substr - the substring to be removed from `str`.
 *
 * @returns a pruned string, or an empty string if `str` is not a valid string.
 *
 * @example
 * ```js
 * import { prune } from "@graphql-markdown/utils/string";
 *
 * const text = "**The quick brown fox jumps over the lazy dog.**";
 *
 * prune(text, "**");
 * // Expected result: "The quick brown fox jumps over the lazy dog."
 * ```
 *
 */
export const prune = (str: Maybe<string>, substr: string = ""): string => {
  if (typeof str !== "string") {
    return "";
  }

  if (substr.length === 0) {
    return str;
  }

  let res = str;
  res = res.startsWith(substr) ? res.slice(substr.length) : res;
  res = res.endsWith(substr) ? res.slice(0, -substr.length) : res;
  return res;
};

/**
 * Returns a string after applying a transformation function.
 * By default `splitter` expression will split the string into words, where non-alphanum chars are considered as word separators.
 * `separator` will be used for joining the words back together.
 * {@link prune} using `separator` is applied to the result of the transformation.
 *
 * @internal
 *
 * @param str - the string to be transformed.
 * @param transformation - optional transformation callback function.
 * @param separator - optional character separator for word-based transformation.
 * @param splitter - optional regex or string rule for splitting string into word.
 *
 * @returns a transformed string, or an empty string if `str` is not a valid string.
 *
 * @example
 * ```js
 * import { stringCaseBuilder } from "@graphql-markdown/utils/string";
 *
 * const text = "The quick brown fox jumps over the lazy dog.";
 * const transformation = (word: string): string => `*${word}*`
 *
 * stringCaseBuilder(text, transformation, " ");
 * // Expected result: "*The* *quick* *brown* *fox* *jumps* *over* *the* *lazy* *dog*"
 * ```
 *
 */
export const stringCaseBuilder = (
  str: Maybe<string>,
  transformation?: Maybe<(word: string) => string>,
  separator?: string,
  splitter: RegExp | string = /[^0-9A-Za-z]+/g,
): string => {
  if (typeof str !== "string") {
    return "";
  }

  if (typeof transformation !== "function") {
    return str;
  }

  const stringCase = replaceDiacritics(str)
    .replace(/([a-z]+|\d+)([A-Z])/g, "$1 $2")
    .replace(/([a-z]+)(\d)/g, "$1 $2")
    .replace(/(\d+)([a-z])/g, "$1 $2")
    .split(splitter)
    .filter((word) => {
      return word.length > 0;
    })
    .map((word: string): string => {
      return transformation(word);
    })
    .join(separator);
  return prune(stringCase, separator);
};

/**
 * Converts a character to its equivalent HTML unicode representation `&#x0000`.
 *
 * @internal
 *
 * @param char - the character to be transformed.
 *
 * @returns a HTML unicode representation of `char`, or an empty string if `char` is not a valid string.
 *
 * @example
 * ```js
 * import { toHTMLUnicode } from "@graphql-markdown/utils/string";
 *
 * toHTMLUnicode("%"); // Expected result: "&#x0025;"
 * ```
 *
 */
export const toHTMLUnicode = (char: Maybe<string>): string => {
  if (typeof char !== "string") {
    return "";
  }
  const unicodeChar = char.charCodeAt(0).toString(16).padStart(4, "0");
  return `&#x${unicodeChar.toUpperCase()};`;
};

/**
 * Returns a string with MDX special characters converted to HTML unicode using {@link toHTMLUnicode}.
 * Characters within code notation should not be converted.
 * List of special characters: `{`, `<`, `>`, `}`
 *
 * @internal
 *
 * @param str - the string to be transformed.
 *
 * @returns a string with MDX special characters replaced by HTML unicode equivalents.
 *
 * @example
 * ```js
 * import { escapeMDX } from "@graphql-markdown/utils/string";
 *
 * escapeMDX("{MDX} <special> characters");
 * // Expected result: "&#x007B;MDX&#x007D; &#x003C;special&#x003E; characters"
 *
 * escapeMDX("`{MDX}` `<special>` characters");
 * // Expected result: "`{MDX}` `<special>` characters"
 * ```
 *
 */
export const escapeMDX = (str: unknown): string => {
  return `${String(str)}`.replace(
    /(?<!`)([{<>}])(?=(?:[^`]*`[^`]*`)*[^`]*$)/g,
    toHTMLUnicode,
  );
};

/**
 * Returns a string with the 1st character in uppercase.
 *
 * @param str - the string to be transformed.
 *
 * @returns a string with the 1st character in uppercase, or an empty string if `str` is not a valid string.
 *
 * @example
 * ```js
 * import { firstUppercase } from "@graphql-markdown/utils/string";
 *
 * firstUppercase("the quick Brown Fox");
 * // Expected result: "The quick Brown Fox"
 * ```
 *
 */
export const firstUppercase = (str: Maybe<string>): string => {
  if (typeof str !== "string") {
    return "";
  }
  const sliceUppercase = str.slice(0, 1).toUpperCase();
  const sliceDefaultCase = str.slice(1);
  return `${sliceUppercase}${sliceDefaultCase}`;
};

/**
 * Returns a string in lowercase excepted for the 1st character capitalized using {@link firstUppercase}.
 *
 * @param str - the string to be transformed.
 *
 * @returns a capitalized string, or an empty string if `str` is not a valid string.
 *
 * @example
 * ```js
 * import { capitalize } from "@graphql-markdown/utils/string";
 *
 * capitalize("the quick Brown Fox");
 * // Expected result: "The quick brown fox"
 * ```
 */
export const capitalize = (str: Maybe<string>): string => {
  if (typeof str !== "string") {
    return "";
  }
  return firstUppercase(str.toLowerCase());
};

/**
 * Applies {@link firstUppercase} using {@link stringCaseBuilder} to every word of a string with `space` character as separator.
 *
 * @param str - the string to be transformed.
 *
 * @returns a string converted to start case, or an empty string if `str` is not a valid string.
 *
 * @example
 * ```js
 * import { startCase } from "@graphql-markdown/utils/string";
 *
 * startCase("the quick Brown Fox");
 * // Expected result: "The Quick Brown Fox"
 * ```
 */
export const startCase = (str: Maybe<string>): string => {
  return stringCaseBuilder(str, firstUppercase, " ");
};

/**
 * Returns a lowercase string with `-` as replacement for non alphanum characters using {@link stringCaseBuilder}.
 *
 *
 * @param str - the string to be transformed.
 *
 * @returns a string converted to start case, or an empty string if `str` is not a valid string.
 *
 * @example
 * ```js
 * import { kebabCase } from "@graphql-markdown/utils/string";
 *
 * kebabCase("The quick brown Fox");
 * // Expected result: "the-quick-brown-fox"
 * ```
 *
 */
export const kebabCase = (str: Maybe<string>): string => {
  return stringCaseBuilder(
    str,
    (word: string) => {
      return word.toLowerCase();
    },
    "-",
  );
};

/**
 * Alias of {@link kebabCase}.
 *
 * @see kebabCase
 * @alias kebabCase
 */
export const slugify = kebabCase;

/**
 * Returns a stringified version of the variable.
 *
 *
 * @param variable - the variable to be transformed.
 *
 * @returns a string
 */
export const toString = (variable: unknown): string => {
  return String(variable);
};
