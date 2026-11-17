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
 * @see [StackOverflow source](https://stackoverflow.com/a/37511463)
 *
 */
export const replaceDiacritics = (str: Maybe<string>): string => {
  if (typeof str !== "string") {
    return "";
  }
  return str
    .toString()
    .normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "");
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
    // single-char lookarounds keep matching linear (no polynomial ReDoS on long runs)
    .replaceAll(/(?<=[a-z\d])(?=[A-Z])/g, " ")
    .replaceAll(/(?<=[a-z])(?=\d)/g, " ")
    .replaceAll(/(?<=\d)(?=[a-z])/g, " ")
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
  const unicodeChar = char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "";
  return `&#x${unicodeChar.toUpperCase()};`;
};

const MDX_SPECIAL_CHARS = /[{<_*>}]/g;
// MDX disables indented code, so micromark then accepts fences with any
// indentation (CommonMark: up to 3 spaces). Fence-like and closing-fence lines
// are therefore matched with any leading whitespace.
const FENCE_LIKE_LINE = /^[ \t]*(?:`{3,}|~{3,})/;
const TRUSTED_FENCE_OPENER = /^(`{3,})[^`]*$/;
const BACKTICK_FENCE_CLOSER = /^[ \t]*(`+)[ \t]*$/;
// A closer both CommonMark and MDX agree on: at most 3 spaces of indentation.
const STRICT_FENCE_CLOSER = /^ {0,3}`/;
// A backtick run followed by another backtick on its line is never a fence
// (backtick fence info strings cannot hold backticks), only inline code.
const NON_FENCE_BACKTICK_LINE = /^[ \t]*`{3,}(?!`)[^`]*`/;
// Link destinations and titles (`](`), and reference definitions (`]:`), are
// parsed before code spans and may continue onto later lines.
const LINK_DESTINATION = /\]\(|\]:/;

const escapeMDXText = (text: string): string => {
  return text.replaceAll(MDX_SPECIAL_CHARS, toHTMLUnicode);
};

const getBacktickRunLength = (text: string, index: number): number => {
  let end = index;
  while (text[end] === "`") {
    end += 1;
  }
  return end - index;
};

const isBackslashEscaped = (text: string, index: number): boolean => {
  let count = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i -= 1) {
    count += 1;
  }
  return count % 2 === 1;
};

/**
 * Returns the end index of the first backtick run of exactly `length`
 * starting at or after `from` in `line`, or `undefined` if there is none.
 */
const findInlineCloserEnd = (
  line: string,
  from: number,
  length: number,
): number | undefined => {
  let index = line.indexOf("`", from);
  while (index !== -1) {
    const runLength = getBacktickRunLength(line, index);
    if (runLength === length) {
      return index + runLength;
    }
    index = line.indexOf("`", index + runLength);
  }
  return undefined;
};

/**
 * Escapes one line outside its inline code spans, pairing backtick runs left
 * to right within the line as CommonMark does.
 *
 * `closed` is `false` when a backtick run stays unpaired: Markdown may pair it
 * with a run on a later line, so the caller must stop preserving code there.
 * A line containing `|` may be a GFM table row, whose cells are split before
 * code spans are parsed, so it is escaped entirely.
 */
const escapeMDXLine = (line: string): { text: string; closed: boolean } => {
  if (line.includes("|")) {
    return { text: escapeMDXText(line), closed: !line.includes("`") };
  }

  let text = "";
  let cursor = 0;
  let closed = true;
  let index = line.indexOf("`");

  while (index !== -1) {
    let runLength = getBacktickRunLength(line, index);
    // A backslash-escaped backtick is literal text, not part of an opener.
    if (isBackslashEscaped(line, index)) {
      index += 1;
      runLength -= 1;
    }
    const closerEnd =
      runLength > 0
        ? findInlineCloserEnd(line, index + runLength, runLength)
        : undefined;

    if (closerEnd === undefined) {
      closed &&= runLength === 0;
      index = line.indexOf("`", index + Math.max(runLength, 1));
      continue;
    }

    text += escapeMDXText(line.slice(cursor, index));
    text += line.slice(index, closerEnd);
    cursor = closerEnd;
    index = line.indexOf("`", closerEnd);
  }

  return { text: text + escapeMDXText(line.slice(cursor)), closed };
};

const hasFenceCloser = (
  lines: string[],
  openerIndex: number,
  length: number,
): boolean => {
  for (let index = openerIndex + 1; index < lines.length; index += 1) {
    const closer = BACKTICK_FENCE_CLOSER.exec(lines[index]);
    if (closer !== null && closer[1].length >= length) {
      return true;
    }
  }
  return false;
};

/**
 * Returns a string with MDX special characters converted to HTML unicode using {@link toHTMLUnicode}.
 * List of special characters: `{`, `<`, `>`, `}`, `_`, `*`.
 *
 * Characters inside code are not converted, but only where Markdown is
 * certain to parse the same code boundaries; anything ambiguous is escaped.
 * Over-escaping only affects readability, while under-escaping would let
 * schema text inject raw HTML/MDX. Code is preserved in:
 * - inline code spans paired within a single line, on lines without `|`
 *   (GFM table cells), `](` or `]:` (link destinations and titles);
 * - fenced code blocks opened by 3+ backticks at column 0 of a line other than
 *   the first, with no backtick in the info string, and a closing fence.
 *
 * Once a line leaves a backtick run unpaired, holds a link destination, or is
 * a fence-like line not matching the rule above (indented, tilde, or on the
 * first line), Markdown may pair later backticks differently, so everything
 * after it is escaped.
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
  // CommonMark treats `\r\n` and `\r` as line endings too; normalise them so
  // the line-based checks see the same lines Markdown does.
  const lines = String(str).replaceAll(/\r\n?/g, "\n").split("\n");
  const output: string[] = [];
  let trusted = true;
  let fenceLength = 0;

  for (const [lineIndex, line] of lines.entries()) {
    if (!trusted) {
      output.push(escapeMDXText(line));
      continue;
    }

    if (fenceLength > 0) {
      const closer = BACKTICK_FENCE_CLOSER.exec(line);
      if (closer && closer[1].length >= fenceLength) {
        fenceLength = 0;
        // An indented closer ends the fence for MDX but not for CommonMark,
        // so what follows may be outside code for one of them.
        trusted = STRICT_FENCE_CLOSER.test(line);
        output.push(trusted ? line : escapeMDXText(line));
        continue;
      }
      output.push(line);
      continue;
    }

    if (FENCE_LIKE_LINE.test(line) && !NON_FENCE_BACKTICK_LINE.test(line)) {
      const opener = TRUSTED_FENCE_OPENER.exec(line);
      if (
        lineIndex > 0 &&
        opener !== null &&
        hasFenceCloser(lines, lineIndex, opener[1].length)
      ) {
        fenceLength = opener[1].length;
        output.push(line);
      } else {
        trusted = false;
        output.push(escapeMDXText(line));
      }
      continue;
    }

    if (LINK_DESTINATION.test(line)) {
      trusted = false;
      output.push(escapeMDXText(line));
      continue;
    }

    const { text, closed } = escapeMDXLine(line);
    output.push(text);
    trusted = closed;
  }

  return output.join("\n");
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
 */
/** @alias */
export const slugify: typeof kebabCase = kebabCase;

/**
 * Returns a stringified version of the variable.
 *
 *
 * @param variable - the variable to be transformed.
 *
 * @returns a string
 */
export const toString: StringConstructor = String;
