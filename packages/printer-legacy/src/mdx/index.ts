/**
 * MDX formatting module for GraphQL-Markdown.
 *
 * This module provides a set of utility functions for formatting various MDX components
 * used in the documentation generation process. It handles the formatting of badges,
 * admonitions, bullet points, collapsible sections, and other MDX-specific elements.
 *
 * The module can be used with default formatters or customized with user-provided
 * MDX formatting functions through the mdxModule factory function.
 *
 * @module printer-legacy/mdx
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MDXSupportType,
  MetaOptions,
  TypeLink,
} from "@graphql-markdown/types";

import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "../const/strings";

const formatMDXBadge = (badge: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${badge.text as string}</mark>` as MDXString;
};

const formatMDXAdmonition = (
  { text, title, type, icon }: AdmonitionType,
  _meta: Maybe<MetaOptions>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()} ${title}</span></legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
};

const formatMDXBullet = (text: string = ""): MDXString => {
  return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
};

const formatMDXDetails = ({ dataOpen }: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">${dataOpen.toUpperCase()}</span></summary>${MARKDOWN_EOP}\r${MARKDOWN_EOP}</details>${MARKDOWN_EOP}` as MDXString;
};

const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
};

const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType
    ? `<code class="gqlmd-mdx-entity-parent">${parentType}</code>.`
    : "";
  return `<span class="gqlmd-mdx-entity">${parentName}<code class="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
};

const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  return formatted
    ? ([FRONT_MATTER_DELIMITER, ...formatted, FRONT_MATTER_DELIMITER].join(
        MARKDOWN_EOL,
      ) as MDXString)
    : ("" as MDXString);
};

export const mdxDeclaration = "";

const defaultModule = {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxDeclaration,
} as MDXSupportType;

export const mdxModule = async (
  mdxPackage?: Record<string, unknown>,
): Promise<Readonly<MDXSupportType>> => {
  if (!mdxPackage) {
    return defaultModule;
  }

  const module = (mdxPackage.default ?? mdxPackage) as Record<string, unknown>;
  return {
    formatMDXAdmonition: module.formatMDXAdmonition ?? formatMDXAdmonition,
    formatMDXBadge: module.formatMDXBadge ?? formatMDXBadge,
    formatMDXBullet: module.formatMDXBullet ?? formatMDXBullet,
    formatMDXDetails: module.formatMDXDetails ?? formatMDXDetails,
    formatMDXFrontmatter: module.formatMDXFrontmatter ?? formatMDXFrontmatter,
    formatMDXLink: module.formatMDXLink ?? formatMDXLink,
    formatMDXNameEntity: module.formatMDXNameEntity ?? formatMDXNameEntity,
    formatMDXSpecifiedByLink:
      module.formatMDXSpecifiedByLink ?? formatMDXSpecifiedByLink,
    mdxDeclaration: module.mdxDeclaration ?? mdxDeclaration,
  } as MDXSupportType;
};

export default defaultModule;
