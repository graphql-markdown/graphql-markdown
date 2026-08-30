/**
 * Astro Starlight formatter for GraphQL documentation output.
 *
 * Produces MDX compatible with Astro Starlight using its native
 * Aside and Badge components. Includes lifecycle hooks for generating
 * index files for each category directory.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  Formatter,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import { MARKDOWN_EOP } from "@graphql-markdown/utils";
import {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXEscapedPermalink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults";

/**
 * Formats a permalink for a section header, using the classic `{#id}` syntax
 * escaped to remain valid MDX.
 *
 * Starlight has no built-in custom header id syntax, so the permalink is inert
 * unless a remark plugin such as `remark-custom-heading-id` is configured. Turn
 * it off with `docOptions.sectionHeaderId: false`.
 *
 * @param id - The ID of the section header
 * @returns Formatted permalink string
 */
export const formatMDXPermalink = formatMDXEscapedPermalink;

/** File extension used for generated pages. */
export const mdxExtension = ".mdx" as const;

/** MDX import statement prepended to every generated file to register Starlight components. */
export const mdxDeclaration: MDXString = `
import { Aside, Badge } from '@astrojs/starlight/components';
` as MDXString;

/**
 * Formats a badge using the Starlight `<Badge>` component.
 * Maps `DEPRECATED` classname to the `caution` variant; all others use `default`.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted Starlight Badge component string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const variant = classname === "DEPRECATED" ? "caution" : "default";
  return `<Badge variant="${variant}" text="${text as string}"/>` as MDXString;
};

/**
 * Formats an admonition using the Starlight `<Aside>` component.
 * Maps `warning` type to `caution`; all other types use `note`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted Starlight Aside component string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const asideType = type === "warning" ? "caution" : "note";
  return `${MARKDOWN_EOP}<Aside type="${asideType}" title="${title}">${text}</Aside>` as MDXString;
};

/**
 * Returns the link unchanged — Starlight routes `page.mdx` to `page/` so
 * links must not include the `.mdx` extension.
 * @param link - Link data with URL and text
 * @returns Unmodified link
 */
export const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

export {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults";

/**
 * Creates an Astro Starlight formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Starlight MDX output
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
    formatMDXPermalink,
    formatMDXSpecifiedByLink,
  };
};
