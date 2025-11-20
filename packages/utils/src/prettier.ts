/**
 * Internal library for prettifying files using `prettier`.
 *
 * @packageDocumentation
 */

import type { LoggerType } from "@graphql-markdown/types";

/**
 * Prettify a string using @see [prettier.format](https://prettier.io/docs/en/api#prettierformatsource-options)
 *
 * @remarks
 * This function logs a warning message on error.
 *
 * @internal
 *
 * @see [Prettier doc for the list of parsers](https://prettier.io/docs/en/options#parser)
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
    const { resolveConfigFile, resolveConfig, format } = await import(
      "prettier"
    );
    const file = await resolveConfigFile();

    let options: Record<string, unknown> = {};
    if (file) {
      options = (await resolveConfig(file)) ?? {};
    }

    return await format(content, { ...options, parser });
  } catch {
    const message = `Prettier is not found or not configured. Please install it or disable the "pretty" option.`;
    if ("logger" in globalThis && globalThis.logger) {
      (globalThis.logger as LoggerType)._log(message);
    } else {
      globalThis.console.log(message);
    }
    return undefined;
  }
};

/**
 * Prettify a Markdown string using {@link prettify} and `markdown` parser.
 *
 * @remarks
 * Same as `prettify(content, "mdx")`.
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
  return prettify(content, "mdx");
};
