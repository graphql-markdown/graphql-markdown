/**
 * Vocs formatter for GraphQL documentation output.
 *
 * Produces MDX compatible with Vite/Vocs using its native callout syntax
 * and Material UI Chip components for badges.
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
} from "@graphql-markdown/utils";

/** MDX import statement and inline component definitions prepended to every generated file. */
export const mdxDeclaration: MDXString = `
import Chip from '@mui/material/Chip';

export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em' }}>&nbsp;●&nbsp;</span></>
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
 * Formats an admonition using Vocs native callout syntax (`:::type[title]`).
 * Maps `warning` type to `warning`; all other types use `info`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted Vocs callout string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const calloutType = type === "warning" ? "warning" : "info";
  return `${MARKDOWN_EOP}:::${calloutType}[${title}]${text}:::` as MDXString;
};

/**
 * Formats a bullet point using the inline `<Bullet/>` component defined in `mdxDeclaration`.
 * @param text - Optional text to append after the bullet
 * @returns Formatted Bullet component string
 */
export const formatMDXBullet = (text = ""): MDXString => {
  return `<Bullet/>${text}` as MDXString;
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
 * Formats YAML front matter wrapped in `---` delimiters.
 * @param _props - Front matter options (unused)
 * @param formatted - Pre-formatted front matter lines
 * @returns Formatted front matter block, or empty string if no lines provided
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
 * Appends `.mdx` to internal link URLs.
 * @param link - Link data with URL and text
 * @returns Link with `.mdx` extension appended to the URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  return {
    text,
    url: `${url}.mdx`,
  };
};

/**
 * Formats a named entity as a JSX span with styled code elements.
 * @param name - Entity name
 * @param parentType - Optional parent type name for qualified references
 * @returns Formatted JSX entity reference string
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  if (parentType) {
    return `<span className="gqlmd-mdx-entity"><code className="gqlmd-mdx-entity-parent">${parentType}</code>.<code className="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
  }
  return `<span className="gqlmd-mdx-entity"><code className="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
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
 * Creates a Vocs formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Vocs MDX output
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
