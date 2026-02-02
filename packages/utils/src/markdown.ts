/**
 * Shared Markdown constants used across packages.
 *
 * @packageDocumentation
 */

/**
 * End of line character for Markdown.
 */
export const MARKDOWN_EOL = "\n" as const;

/**
 * End of paragraph (double newline) for Markdown.
 */
export const MARKDOWN_EOP = `${MARKDOWN_EOL.repeat(2)}` as const;

/**
 * Frontmatter delimiter for YAML frontmatter blocks.
 */
export const FRONT_MATTER_DELIMITER = "---" as const;

/**
 * Code snippet delimiter for fenced code blocks.
 */
export const MARKDOWN_CODE_SNIPPET = "```" as const;

/**
 * Standard indentation for code blocks (2 spaces).
 */
export const MARKDOWN_CODE_INDENTATION = "  " as const;
