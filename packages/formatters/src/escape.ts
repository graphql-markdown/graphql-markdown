/**
 * Escaping helpers for values interpolated into generated markup.
 *
 * Each helper encodes a value for one output context. They are internal to
 * the formatters package and are not part of the public API.
 *
 * @packageDocumentation
 */

const MARKDOWN_URL_UNSAFE_CHARS = /[\s"'()<>\\`[\]{}|^]/g;

/**
 * Escapes a value for use inside a double-quoted HTML attribute or an MDX/JSX
 * string attribute. Both contexts decode character references, so the encoded
 * value is read back unchanged while quotes, angle brackets, and curly braces
 * cannot end the attribute or start markup. `&` is encoded first so that the
 * other replacements are not double-encoded.
 * @param value - Raw value to escape
 * @returns Value with HTML-significant characters replaced by character references
 */
export const escapeHTMLAttribute = (value: string): string => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;");
};

/**
 * Percent-encodes characters that could end a Markdown link destination or
 * start markup when the value is written as plain text. Whitespace is encoded
 * as well, which keeps the value a single link destination. ASCII characters
 * are encoded as `%XX` with uppercase hex; non-ASCII whitespace is encoded as
 * UTF-8 percent sequences.
 * @param value - Raw value to escape
 * @returns Value with Markdown-significant characters percent-encoded
 */
export const escapeMarkdownURL = (value: string): string => {
  return value.replace(MARKDOWN_URL_UNSAFE_CHARS, (char: string): string => {
    if (char.charCodeAt(0) > 0x7f) {
      return encodeURIComponent(char);
    }
    return `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`;
  });
};
