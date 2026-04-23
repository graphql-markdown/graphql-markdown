/**
 * Fumadocs formatter for GraphQL documentation output.
 *
 * Produces MDX compatible with Next.js Fumadocs using its native
 * Callout component for admonitions and Material UI Chip for badges.
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
import { appendLinkExtension } from "@graphql-markdown/helpers";
import { MARKDOWN_EOP } from "@graphql-markdown/utils";
import {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults";

/** File extension used for generated pages. */
export const mdxExtension = ".mdx" as const;

/** MDX import statement prepended to every generated file to register Fumadocs and MUI components. */
export const mdxDeclaration: MDXString = `
import { Callout } from 'fumadocs-ui/components/callout';
import Chip from '@mui/material/Chip';
` as MDXString;

/**
 * Formats a badge using the Material UI `<Chip>` component.
 * Maps `DEPRECATED` classname to `warning` color; all others use `info`.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted MUI Chip component string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const color = classname === "DEPRECATED" ? "warning" : "info";
  return `<Chip color="${color}" label="${text as string}" size="small" variant="outlined"/>` as MDXString;
};

/**
 * Formats an admonition using the Fumadocs `<Callout>` component.
 * Maps `warning` type to `warn`; all other types use `info`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted Fumadocs Callout component string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const calloutType = type === "warning" ? "warn" : "info";
  return `${MARKDOWN_EOP}<Callout type="${calloutType}" title="${title}">${text}</Callout>` as MDXString;
};

/**
 * Appends `.mdx` to internal link URLs.
 * @param link - Link data with URL and text
 * @returns Link with `.mdx` extension appended to the URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  return {
    text,
    url: appendLinkExtension(url, mdxExtension),
  };
};

export {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
};

/**
 * Creates a Fumadocs formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Fumadocs MDX output
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
