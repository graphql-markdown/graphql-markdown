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
 * Whether a line is empty or contains only whitespace.
 */
const isBlankLine = (line: string): boolean => {
  return line.trim() === "";
};

/**
 * Removes leading and trailing blank lines (empty or whitespace-only) from a text.
 * Indentation of the first non-blank line is preserved.
 *
 * @param text - Text to trim.
 * @returns Text without leading/trailing blank lines.
 */
export const trimBlankLines = (text: string): string => {
  const lines = text.split("\n");
  let start = 0;
  let end = lines.length;
  while (start < end && isBlankLine(lines[start])) {
    start++;
  }
  while (end > start && isBlankLine(lines[end - 1])) {
    end--;
  }
  return lines.slice(start, end).join("\n");
};

/** An open fenced code block: its fence character and length. */
interface CodeFence {
  char: string;
  length: number;
}

/**
 * Returns the code fence opened by a line (3+ backticks or tildes, up to 3
 * spaces of indentation), or `undefined`.
 */
const openingFence = (line: string): CodeFence | undefined => {
  const match = /^ {0,3}(`{3,}|~{3,})/.exec(line);
  return match ? { char: match[1][0], length: match[1].length } : undefined;
};

/**
 * Whether a line closes the given code fence: same character, at least as
 * long, and nothing but whitespace after it.
 */
const closesFence = (line: string, fence: CodeFence): boolean => {
  const match = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line);
  return (
    match !== null &&
    match[1].startsWith(fence.char) &&
    match[1].length >= fence.length
  );
};

/**
 * Cleans a line outside code blocks: a whitespace-only line becomes empty and
 * a single trailing space or tab is removed (2+ trailing spaces are kept, as
 * they may be a Markdown hard line break).
 */
const cleanLine = (line: string): string => {
  if (isBlankLine(line)) {
    return "";
  }
  return /[^ \t][ \t]$/.test(line) ? line.slice(0, -1) : line;
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
  let fence: CodeFence | undefined;

  for (const line of text.split("\n")) {
    if (fence) {
      out.push(line);
      fence = closesFence(line, fence) ? undefined : fence;
      continue;
    }

    fence = openingFence(line);
    const cleaned = fence ? line : cleanLine(line);
    if (cleaned === "" && out.at(-1) === "") {
      continue;
    }
    out.push(cleaned);
  }

  return out.join("\n");
};
