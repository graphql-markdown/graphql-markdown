/**
 * Formatter factories for GraphQL documentation output.
 *
 * Provides factory functions to create formatters for different output targets.
 * The default formatter produces HTML-like markup suitable for most Markdown processors.
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
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "./const/strings";

/**
 * Creates a default formatter for documentation output.
 *
 * The default formatter produces HTML-like markup with CSS classes
 * that can be styled with custom CSS. This is suitable for most
 * Markdown processors that support inline HTML.
 *
 * @returns A complete Formatter implementation
 *
 * @example
 * ```typescript
 * import { createDefaultFormatter } from '@graphql-markdown/printer-legacy';
 *
 * const formatter = createDefaultFormatter();
 * const badge = formatter.formatMDXBadge({ text: 'Required' });
 * ```
 */
export const createDefaultFormatter = (): Formatter => {
  return {
    formatMDXBadge: (badge: Badge): MDXString => {
      return `<mark class="gqlmd-mdx-badge">${badge.text as string}</mark>` as MDXString;
    },

    formatMDXAdmonition: (
      { text, title, type, icon }: AdmonitionType,
      _meta: Maybe<MetaInfo>,
    ): MDXString => {
      return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()} ${title}</span></legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
    },

    formatMDXBullet: (text = ""): MDXString => {
      return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
    },

    formatMDXDetails: ({ dataOpen }: CollapsibleOption): MDXString => {
      return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">${dataOpen.toUpperCase()}</span></summary>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
    },

    formatMDXFrontmatter: (
      _props: Maybe<FrontMatterOptions>,
      formatted: Maybe<string[]>,
    ): MDXString => {
      return formatted
        ? ([FRONT_MATTER_DELIMITER, ...formatted, FRONT_MATTER_DELIMITER].join(
            MARKDOWN_EOL,
          ) as MDXString)
        : ("" as MDXString);
    },

    formatMDXLink: (link: TypeLink): TypeLink => {
      return link;
    },

    formatMDXNameEntity: (
      name: string,
      parentType?: Maybe<string>,
    ): MDXString => {
      const parentName = parentType
        ? `<code class="gqlmd-mdx-entity-parent">${parentType}</code>.`
        : "";
      return `<span class="gqlmd-mdx-entity">${parentName}<code class="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
    },

    formatMDXSpecifiedByLink: (url: string): MDXString => {
      return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
    },
  };
};
