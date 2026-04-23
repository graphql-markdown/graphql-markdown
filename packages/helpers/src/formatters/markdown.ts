/**
 * Shared markdown-oriented helpers used by formatter presets.
 *
 * @packageDocumentation
 */

const FRONTMATTER_TITLE_PREFIX = "title:" as const;

/**
 * Prefixes each line with a Markdown blockquote marker.
 *
 * @param text - Multiline text to transform into blockquote content.
 * @param eol - Line separator used to split and join lines.
 * @returns Text where every line starts with `> `.
 */
export const quoteMarkdownLines = (text: string, eol = "\n"): string => {
  return text
    .split(eol)
    .map((line) => {
      return `> ${line}`;
    })
    .join(eol);
};

/**
 * Parses a YAML-like frontmatter title line and returns its string value.
 *
 * Accepts unquoted values (`title: My Title`) and quoted values
 * (`title: "My Title"` or `title: 'My Title'`).
 *
 * @param line - Candidate frontmatter line.
 * @returns Parsed title value, or an empty string when the line is not a title.
 */
export const parseFrontmatterTitleLine = (line: string): string => {
  const trimmed = line.trim();

  if (!trimmed.startsWith(FRONTMATTER_TITLE_PREFIX)) {
    return "";
  }

  const rawValue = trimmed.slice(FRONTMATTER_TITLE_PREFIX.length).trim();
  if (rawValue.length === 0) {
    return "";
  }

  const firstChar = rawValue[0];
  const lastChar = rawValue[rawValue.length - 1];
  const isWrappedInMatchingQuotes =
    rawValue.length >= 2 &&
    ((firstChar === '"' && lastChar === '"') ||
      (firstChar === "'" && lastChar === "'"));

  return isWrappedInMatchingQuotes
    ? rawValue.slice(1, -1).trim()
    : rawValue.trim();
};

/**
 * Extracts a title value from pre-formatted frontmatter lines.
 *
 * @param formatted - Serialized frontmatter lines without delimiters.
 * @returns Parsed title value, or an empty string when no `title:` line exists.
 */
export const extractFrontmatterTitle = (
  formatted: string[] | null | undefined,
): string => {
  const titleLine = formatted?.find((line) => {
    return line.trimStart().startsWith(FRONTMATTER_TITLE_PREFIX);
  });

  return titleLine ? parseFrontmatterTitleLine(titleLine) : "";
};

/**
 * Formats a markdown frontmatter block from preformatted lines.
 *
 * @param formatted - Serialized frontmatter lines without delimiters.
 * @param delimiter - Frontmatter delimiter marker.
 * @param eol - End-of-line separator.
 * @returns Complete frontmatter block or an empty string when input is absent.
 */
export const formatMarkdownFrontmatter = (
  formatted: string[] | null | undefined,
  delimiter = "---",
  eol = "\n",
): string => {
  if (!formatted) {
    return "";
  }

  return [delimiter, ...formatted, delimiter].join(eol);
};

/**
 * Appends an extension to a link URL.
 *
 * @param url - Link URL to update.
 * @param extension - Extension suffix (for example `.mdx`).
 * @returns URL with appended extension.
 */
export const appendLinkExtension = (url: string, extension: string): string => {
  return `${url}${extension}`;
};

/**
 * Appends an extension only when URL is an absolute path without a file extension.
 *
 * Fragment-only and already suffixed paths are returned unchanged.
 *
 * @param url - Link URL to evaluate.
 * @param extension - Extension suffix to append when eligible.
 * @returns Updated or original URL depending on path shape.
 */
export const appendExtensionToAbsolutePathWithoutExtension = (
  url: string,
  extension: string,
): string => {
  if (url.startsWith("/") && !/\.[a-z]{2,5}(#.*)?$/i.test(url)) {
    return `${url}${extension}`;
  }

  return url;
};

/**
 * Indents non-empty markdown lines by a fixed amount of spaces.
 *
 * @param text - Multiline markdown block to indent.
 * @param spaces - Number of spaces to prepend to non-empty lines.
 * @param eol - Line separator used to split and join lines.
 * @returns Indented multiline string.
 */
export const indentMarkdownLines = (
  text: string,
  spaces: number,
  eol = "\n",
): string => {
  const indent = " ".repeat(spaces);

  return text
    .split(eol)
    .map((line) => {
      return line.trim() ? `${indent}${line}` : "";
    })
    .join(eol);
};
