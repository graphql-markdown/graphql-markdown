/**
 * Vocs formatter for GraphQL documentation output.
 *
 * Produces MDX compatible with Vite/Vocs using its native callout syntax
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  Formatter,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import { appendLinkExtension } from "@graphql-markdown/helpers";
import { MARKDOWN_EOP } from "@graphql-markdown/utils";
import {
  formatMDXDetails,
  formatMDXEscapedPermalink,
  formatMDXFrontmatter as formatDefaultFrontmatter,
  formatMDXFrontmatterTitleOnly,
  formatMDXSpecifiedByLink,
} from "../defaults.ts";

/**
 * Formats a permalink for a section header, using the classic `{#id}` syntax
 * escaped to remain valid MDX.
 *
 * Vocs has no custom header id syntax, so the permalink is inert unless a
 * remark plugin is configured. Turn it off with
 * `docOptions.sectionHeaderId: false`.
 *
 * @see https://vocs.dev/docs/markdown
 *
 * @param id - The ID of the section header
 * @returns Formatted permalink string
 */
export const formatMDXPermalink: typeof formatMDXEscapedPermalink =
  formatMDXEscapedPermalink;

/** MDX import statement and inline component definitions prepended to every generated file. */
export const mdxDeclaration: MDXString = `
export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em' }}>&nbsp;●&nbsp;</span></>
` as MDXString;

/** File extension used for generated pages. */
export const mdxExtension = ".mdx" as const;

/**
 * Formats YAML front matter followed by a visible `# Title` heading.
 *
 * Vocs only uses the front matter `title` for the document `<title>`; the
 * page heading must be written in Markdown, so without it generated pages
 * have no visible title.
 *
 * @see https://vocs.dev/docs/markdown
 *
 * @param props - Front matter options
 * @param formatted - Pre-formatted front matter lines
 * @returns Front matter block and title heading, or empty string if no lines provided
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  const frontMatter = formatDefaultFrontmatter(props, formatted);
  const heading = formatMDXFrontmatterTitleOnly(formatted);
  if (!frontMatter || !heading) {
    return frontMatter;
  }
  return `${frontMatter}${MARKDOWN_EOP}${heading}` as MDXString;
};

/**
 * Formats a badge using Vocs native text directive (`:badge[...]`).
 * Maps `DEPRECATED` classname to `warning` color; all others use default.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted Vocs badge string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const badgeType = classname === "DEPRECATED" ? "{warning}" : "";
  return `:badge[${text as string}]${badgeType}` as MDXString;
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

export { formatMDXDetails, formatMDXSpecifiedByLink } from "../defaults.ts";

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
    formatMDXPermalink,
    formatMDXSpecifiedByLink,
  };
};
