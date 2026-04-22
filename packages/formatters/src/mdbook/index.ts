/**
 * mdBook formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Rust's mdBook static site generator.
 * Front matter is suppressed because mdBook renders it as literal content.
 * Admonitions fall back to blockquote style as mdBook has no native support.
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
import { MARKDOWN_EOL, MARKDOWN_EOP } from "@graphql-markdown/utils";

const quoteLines = (text: string): string => {
  return text
    .split(MARKDOWN_EOL)
    .map((line) => {
      return `> ${line}`;
    })
    .join(MARKDOWN_EOL);
};

/**
 * Formats a badge as Markdown bold text — mdBook has no badge component.
 * @param badge - Badge data containing text
 * @returns Formatted bold text string
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  return `**${text as string}**` as MDXString;
};

/**
 * Formats an admonition as a Markdown blockquote.
 * mdBook has no native admonition syntax; uses `> **LABEL**` as a fallback.
 * Uses `title` when non-empty, otherwise falls back to `type`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted blockquote string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const label = (title?.trim() ? title : type).toUpperCase();
  return `${MARKDOWN_EOP}> **${label}**${MARKDOWN_EOL}${quoteLines(text)}${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats a bullet point separator.
 * @param text - Optional text to append after the bullet
 * @returns Formatted bullet string
 */
export const formatMDXBullet = (text = ""): MDXString => {
  return `&nbsp;&bull;&nbsp;${text}` as MDXString;
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
  return `${MARKDOWN_EOP}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}${MARKDOWN_EOL}\r${MARKDOWN_EOL}${MARKDOWN_EOL}<em>${dataClose}</em>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Suppresses front matter output entirely.
 * mdBook does not support front matter — it would render `---` and YAML as literal page content.
 * @returns Always returns an empty string
 */
export const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  _formatted: Maybe<string[]>,
): MDXString => {
  return "" as MDXString;
};

/**
 * Returns the link unchanged — mdBook resolves `.md` links natively.
 * @param link - Link data with URL and text
 * @returns The link unchanged
 */
export const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

/**
 * Formats a named entity as a backtick code span.
 * @param name - Entity name
 * @param parentType - Optional parent type name for qualified references
 * @returns Formatted entity reference string
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType ? `${parentType}.` : "";
  return `\`${parentName}${name}\`` as MDXString;
};

/**
 * Formats a "specified by" link as a standard Markdown link.
 * @param url - URL to the specification
 * @returns Formatted specification link string
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `[Specification ⎘](${url})` as MDXString;
};

/**
 * Creates an mdBook formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for mdBook output
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
