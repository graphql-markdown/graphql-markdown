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
export const MARKDOWN_EOP: string = `${MARKDOWN_EOL.repeat(2)}` as const;

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

/**
 * Removes leading and trailing blank lines (empty or whitespace-only) from a text.
 * Indentation of the first non-blank line is preserved.
 *
 * @param text - Text to trim.
 * @returns Text without leading/trailing blank lines.
 */
export const trimBlankLines = (text: string): string => {
  return text.replace(/^(?:[ \t]*\r?\n)+/, "").replace(/(?:\r?\n[ \t]*)+$/, "");
};

/**
 * Normalizes whitespace of generated Markdown outside fenced code blocks:
 * - collapses runs of blank lines into a single blank line,
 * - turns whitespace-only lines into empty lines,
 * - removes a single trailing space or tab (2+ trailing spaces are kept, as they
 *   may be a Markdown hard line break).
 *
 * Fenced code blocks (backtick or tilde fences) are left untouched.
 *
 * @param text - Generated Markdown text.
 * @returns Normalized Markdown text.
 */
export const normalizeMarkdownWhitespace = (text: string): string => {
  const out: string[] = [];
  let fence: { char: string; length: number } | undefined;
  let previousBlank = false;

  for (const line of text.split("\n")) {
    if (fence) {
      out.push(line);
      const close = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line);
      if (
        close &&
        close[1].startsWith(fence.char) &&
        close[1].length >= fence.length
      ) {
        fence = undefined;
      }
      previousBlank = false;
      continue;
    }

    const open = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (open) {
      fence = { char: open[1][0], length: open[1].length };
      out.push(line);
      previousBlank = false;
      continue;
    }

    let cleaned = line;
    if (cleaned.trim() === "") {
      cleaned = "";
    } else if (/[^ \t][ \t]$/.test(cleaned)) {
      cleaned = cleaned.slice(0, -1);
    }

    if (cleaned === "") {
      if (previousBlank) {
        continue;
      }
      previousBlank = true;
    } else {
      previousBlank = false;
    }
    out.push(cleaned);
  }

  return out.join("\n");
};
