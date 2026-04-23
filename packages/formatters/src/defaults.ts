/**
 * Default formatter implementations shared across multiple formatter packages.
 *
 * These functions provide the standard/baseline rendering behaviour.
 * Individual formatters import what they need and override only what differs.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import { formatMarkdownFrontmatter } from "@graphql-markdown/helpers";
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "@graphql-markdown/utils";

/**
 * Formats a badge using an HTML `<mark>` element with a `gqlmd-mdx-badge` CSS class.
 * @param badge - Badge data containing the text to display
 * @returns Formatted badge string
 */
export const formatMDXBadge = (badge: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${badge.text as string}</mark>` as MDXString;
};

/**
 * Formats an admonition as an HTML `<fieldset>` element with `gqlmd-mdx-admonition-*` CSS classes.
 * @param admonition - Admonition data with text, title, type, and optional icon
 * @param _meta - Unused metadata parameter
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, title, type, icon }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()} ${title}</span></legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
};

/**
 * Formats a bullet point separator using a `<span>` with a `gqlmd-mdx-bullet` CSS class.
 * @param text - Optional text to append after the bullet
 * @returns Formatted bullet string
 */
export const formatMDXBullet = (text = ""): MDXString => {
  return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element with a `gqlmd-mdx-details` CSS class.
 * The summary label is uppercase; the close label is rendered as `<em>`.
 * @param option - Configuration for open/close label text
 * @returns Formatted details element string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span class="gqlmd-mdx-details-summary-open">${dataOpen.toUpperCase()}</span></summary>${MARKDOWN_EOL}${MARKDOWN_EOL}\r${MARKDOWN_EOL}${MARKDOWN_EOL}<em>${dataClose}</em>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Formats YAML front matter wrapped in `---` delimiters.
 * @param _props - Front matter options (unused)
 * @param formatted - Pre-formatted front matter lines
 * @returns Formatted front matter block, or empty string if no lines provided
 */
export const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  return formatMarkdownFrontmatter(
    formatted,
    FRONT_MATTER_DELIMITER,
    MARKDOWN_EOL,
  ) as MDXString;
};

/**
 * Formats a type link — returns the link unchanged (identity passthrough).
 * @param link - The `TypeLink` object to format
 * @returns The unmodified `TypeLink` object
 */
export const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

/**
 * Formats a named entity using `<span>` and `<code>` elements with `gqlmd-mdx-entity-*` CSS classes.
 * @param name - Entity name
 * @param parentType - Optional parent type name for qualified references
 * @returns Formatted entity reference string
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType
    ? `<code class="gqlmd-mdx-entity-parent">${parentType}</code>.`
    : "";
  return `<span class="gqlmd-mdx-entity">${parentName}<code class="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
};

/**
 * Formats a "specified by" link as an HTML `<span>` with a `gqlmd-mdx-specifiedby` CSS class
 * containing an anchor that opens in a new tab.
 * @param url - URL to the specification
 * @returns Formatted specification link string
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
};
