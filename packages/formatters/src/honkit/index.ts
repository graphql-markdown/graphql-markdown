/**
 * HonKit formatter for GraphQL documentation output.
 *
 * Produces plain Markdown compatible with HonKit static site generator.
 * Internal links are converted to .html paths.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  Formatter,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import {
  appendExtensionToAbsolutePathWithoutExtension,
  extractFrontmatterTitle,
  formatMarkdownFrontmatter,
  mergeFrontmatterLines,
} from "@graphql-markdown/helpers";
import { FRONT_MATTER_DELIMITER, MARKDOWN_EOL } from "@graphql-markdown/utils";
import { formatMDXBullet } from "../defaults";

export const __default = { formatMDXBullet };

/** File extension used for generated pages — HonKit renders plain Markdown to HTML. */
export const mdxExtension = ".md" as const;

/** Shared default badge theme used across this preset. */
const DEFAULT_BADGE_THEME = {
  bg: "#f6f7f9",
  border: "#d1d5db",
  color: "#374151",
} as const;

/**
 * Formats a badge as an inline HTML `<span>` with a shared default style.
 * Users can customize badge colors by providing their own `formatMDXBadge` implementation.
 * @param badge - Badge data containing text
 * @returns Formatted inline HTML span string
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  const label = (
    typeof text === "string" ? String(text) : String(text.singular)
  ).trim();
  return `<span style="display:inline-block;padding:0.12rem 0.5rem;margin-right:0.35rem;border:1px solid ${DEFAULT_BADGE_THEME.border};border-radius:999px;background:${DEFAULT_BADGE_THEME.bg};color:${DEFAULT_BADGE_THEME.color};font-size:1.15rem;font-weight:600;line-height:1.2;vertical-align:middle;">${label}</span>` as MDXString;
};

/**
 * Formats an admonition as a Markdown blockquote with a bold prefix label.
 * Maps `warning` type to `WARNING`; all other types use `INFO`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted blockquote string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const prefix = type === "warning" ? "WARNING" : "INFO";
  return `> **${prefix} - ${title}**\n>\n> ${text}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element.
 * @param option - Configuration for open/close label text
 * @returns Formatted details element string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOL}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}\r${dataClose}${MARKDOWN_EOL}</details>${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats YAML front matter and appends an H1 heading derived from the `title` prop.
 * Merges `props` entries with `formatted` lines (formatted lines take precedence).
 * Returns empty string if `props` is empty or absent — HonKit renders front matter
 * without a title as literal YAML content.
 * @param props - Front matter options; `title` is used to generate the H1 heading
 * @param formatted - Pre-formatted front matter lines that override props values
 * @returns Formatted front matter block with optional H1, or empty string
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  if (!props || typeof props !== "object" || Object.keys(props).length === 0) {
    return "" as MDXString;
  }

  const lines = mergeFrontmatterLines(props, formatted ?? null);

  const frontmatter = formatMarkdownFrontmatter(
    lines,
    FRONT_MATTER_DELIMITER,
    MARKDOWN_EOL,
  );

  const title = extractFrontmatterTitle(lines).replaceAll(/\r?\n/g, " ").trim();
  const heading = title ? `\n\n# ${title}` : "";

  return `${frontmatter}${heading}` as MDXString;
};

/**
 * Converts internal link URLs to `.html` paths for HonKit static output.
 * Absolute paths without an `.html` extension are suffixed with `.html`.
 * External URLs and fragment-only links are returned unchanged.
 * @param link - Link data with URL and text
 * @returns Link with `.html` extension applied to absolute internal paths
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  if (!url || /^(https?:|mailto:|tel:)/i.test(url) || url.startsWith("#"))
    return { text, url };

  const href = String(url).trim();

  const match = /^([^?#]*)([?#].*)?$/.exec(href);
  const pathname = match?.[1] ?? href;
  const suffix = match?.[2] ?? "";

  if (pathname === "/") {
    return { text, url: href };
  }

  const updatedPath = appendExtensionToAbsolutePathWithoutExtension(
    pathname,
    ".html",
  );

  return { text, url: `${updatedPath}${suffix}` };
};

/**
 * Formats a named entity as plain text (no markup).
 * HonKit renders plain Markdown — no JSX or code spans needed.
 * @param name - Entity name
 * @param parentType - Optional parent type name for qualified references
 * @returns Formatted entity reference string
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  return (parentType ? `${parentType}.${name}` : name) as MDXString;
};

/**
 * Formats a "specified by" link as plain text with the raw URL.
 * HonKit does not render custom JSX components.
 * @param url - URL to the specification
 * @returns Formatted specification text string
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `\n\nSpecified by: ${url}` as MDXString;
};

/**
 * Creates a HonKit formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for HonKit output
 */
export const createMDXFormatter = (_meta?: Maybe<MetaInfo>): Formatter => {
  return {
    formatMDXBadge,
    formatMDXAdmonition,
    formatMDXBullet,
    formatMDXDetails,
    formatMDXFrontmatter,
    formatMDXLink,
    formatMDXNameEntity,
    formatMDXSpecifiedByLink,
  };
};
