/**
 * Format event helpers for printer-legacy.
 *
 * This module provides helper functions to emit MDX format events and handle
 * fallback to default formatters when no custom handlers are registered.
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

// Import default formatters
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "./const/strings";

/**
 * Default badge formatter.
 */
export const formatMDXBadge = (badge: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${badge.text as string}</mark>` as MDXString;
};

/**
 * Default admonition formatter.
 */
export const formatMDXAdmonition = (
  { text, title, type, icon }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()} ${title}</span></legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
};

/**
 * Default bullet formatter.
 */
export const formatMDXBullet = (text = ""): MDXString => {
  return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
};

/**
 * Default details formatter.
 */
export const formatMDXDetails = ({
  dataOpen,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">${dataOpen.toUpperCase()}</span></summary>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Default frontmatter formatter.
 */
export const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  return formatted
    ? ([FRONT_MATTER_DELIMITER, ...formatted, FRONT_MATTER_DELIMITER].join(
        MARKDOWN_EOL,
      ) as MDXString)
    : ("" as MDXString);
};

/**
 * Default link formatter.
 */
export const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

/**
 * Default name entity formatter.
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
 * Default specified-by link formatter.
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
};
