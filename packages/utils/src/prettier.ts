/**
 * Internal library for prettifying files using `prettier`.
 *
 * @packageDocumentation
 */

import type { LoggerType } from "@graphql-markdown/types";

/**
 * Prettify a string using {@link https://prettier.io/docs/en/api#prettierformatsource-options | prettier.format}.
 *
 * @remarks
 * This function logs a warning message on error.
 *
 * @internal
 *
 * @see https://prettier.io/docs/en/options#parser for the list of parsers.
 *
 * @param content - the string to be prettified.
 * @param parser - the `prettier` parser to use.
 *
 * @returns a prettified string, or undefined if an error occurred.
 *
 */
export const prettify = async (
  content: string,
  parser: string,
): Promise<string | undefined> => {
  try {
    const { format } = await import("prettier");
    return await format(content, { parser });
  } catch {
    if ("logger" in global && global.logger) {
      (global.logger as LoggerType)._log("Prettier is not found");
    } else {
      global.console.log("Prettier is not found");
    }
    return undefined;
  }
};

/**
 * Prettify a Markdown string using {@link prettify} and `markdown` parser.
 *
 * @remarks
 * Same as `prettify(content, "markdown")`.
 *
 * @see {@link prettify}
 *
 * @internal
 *
 * @param content - the string to be prettified.
 *
 * @returns a prettified string, or undefined if an error occurred.
 *
 */
export const prettifyMarkdown = async (
  content: string,
): Promise<string | undefined> => {
  return prettify(content, "markdown");
};
