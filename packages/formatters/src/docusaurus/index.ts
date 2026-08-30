/**
 * Docusaurus MDX formatter for GraphQL documentation output.
 *
 * Produces MDX markup compatible with Docusaurus v2 and v3,
 * using Badge, Bullet, SpecifiedBy components and native admonition syntax.
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
  appendLinkExtension,
  formatMarkdownFrontmatter,
} from "@graphql-markdown/helpers";
import {
  escapeMDX,
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "@graphql-markdown/utils";
import { isFrameworkVersion, isFrameworkVersionAtLeast } from "../version";

const LINK_MDX_EXTENSION = ".mdx" as const;
const DOCUSAURUS_FRAMEWORK = "docusaurus" as const;
/** Docusaurus version using the legacy `:::caution` admonition syntax. */
const LEGACY_ADMONITION_VERSION = { major: 2 } as const;
/** Docusaurus version introducing the MDX comment heading id syntax. */
const MDX_COMMENT_HEADING_ID_VERSION = { major: 3, minor: 10 } as const;
const DEFAULT_CSS_CLASSNAME = "badge--secondary" as const;

/** MDX component definitions prepended to every generated file. */
export const mdxDeclaration: MDXString = `
export const Bullet = () => <><span style={{ fontWeight: 'normal', fontSize: '.5em', color: 'var(--ifm-color-secondary-darkest)' }}>&nbsp;●&nbsp;</span></>

export const SpecifiedBy = (props) => <>Specification<a className="link" style={{ fontSize:'1.5em', paddingLeft:'4px' }} target="_blank" href={props.url} title={'Specified by ' + props.url}>⎘</a></>

export const Badge = (props) => <><span className={props.class}>{props.text}</span></>


` as MDXString;

/**
 * Formats a badge using the inline `<Badge>` component defined in `mdxDeclaration`.
 * Appends a CSS class derived from `classname` (e.g. `badge--deprecated`).
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted Badge component string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const style =
    typeof classname === "string" ? `badge--${classname.toLowerCase()}` : "";
  return `<Badge class="badge ${DEFAULT_CSS_CLASSNAME} ${style}" text="${text as string}"/>` as MDXString;
};

/**
 * Formats an admonition using Docusaurus native `:::type` callout syntax.
 * Detects Docusaurus v2 (via `meta`) and uses `:::caution` instead of `:::warning`.
 * @param admonition - Admonition data with text, title, and type
 * @param meta - Optional metadata used to detect Docusaurus version
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  meta: Maybe<MetaInfo>,
): MDXString => {
  if (
    isFrameworkVersion(meta, DOCUSAURUS_FRAMEWORK, LEGACY_ADMONITION_VERSION)
  ) {
    const oldType = type === "warning" ? "caution" : type;
    return `${MARKDOWN_EOP}:::${oldType} ${title}${text}:::` as MDXString;
  }
  return `${MARKDOWN_EOP}:::${type}[${title}]${text}:::` as MDXString;
};

/**
 * Formats a bullet point using the inline `<Bullet/>` component defined in `mdxDeclaration`.
 * @param text - Optional text to append after the bullet
 * @returns Formatted Bullet component string
 */
export const formatMDXBullet = (text: string = ""): MDXString => {
  return `<Bullet />${text}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element with
 * toggle labels that swap via the `hidden` attribute.
 * Text is escaped so curly braces and angle brackets don't break MDX.
 * @param option - Configuration for open/close label text
 * @returns Formatted details element string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  const openLabel = escapeMDX(`Hide ${dataOpen}`);
  const closeLabel = escapeMDX(`Show ${dataClose}`);
  return `${MARKDOWN_EOP}<details class="graphql-markdown-details">${MARKDOWN_EOL}<summary>${MARKDOWN_EOL}<span class="graphql-markdown-details-label-closed">${closeLabel}</span>${MARKDOWN_EOL}<span class="graphql-markdown-details-label-open" hidden>${openLabel}</span>${MARKDOWN_EOL}</summary>${MARKDOWN_EOP}\r${MARKDOWN_EOP}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Formats a "specified by" link using the inline `<SpecifiedBy>` component.
 * @param url - URL to the specification
 * @returns Formatted SpecifiedBy component string
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<SpecifiedBy url="${url}"/>` as MDXString;
};

/**
 * Formats a named entity as an inline `<code>` element with the parent type
 * in normal weight and the entity name in bold.
 * Text is escaped so curly braces don't break MDX.
 * @param name - Entity name
 * @param parentType - Optional parent type name for qualified references
 * @returns Formatted JSX code element string
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType ? `${parentType}.` : "";
  return `<code style={{ fontWeight: 'normal' }}>${escapeMDX(parentName)}<b>${escapeMDX(name)}</b></code>` as MDXString;
};

/**
 * Appends `.mdx` to internal link URLs.
 * @param link - Link data with URL and text
 * @returns Link with `.mdx` extension appended to the URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  return {
    text,
    url: appendLinkExtension(url, LINK_MDX_EXTENSION),
  };
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
 * Creates a Docusaurus formatter.
 * Captures `meta` in closure so `formatMDXAdmonition` can detect the Docusaurus version.
 * @param meta - Optional metadata used to detect Docusaurus version
 * @returns A complete {@link Formatter} implementation for Docusaurus MDX output
 */
/**
 * Formats a permalink for a section header.
 *
 * Docusaurus 3.10 introduced a heading id syntax based on a native MDX comment,
 * and deprecated the classic one. The braces of the comment must NOT be escaped:
 * the heading id is extracted from a real MDX expression node, so an escaped
 * token would be rendered as text. Older versions only support the classic
 * syntax, whose braces must be escaped to remain valid MDX.
 *
 * @see https://docusaurus.io/blog/releases/3.10#strict-heading-ids
 *
 * @param id - The ID of the section header
 * @param meta - Optional metadata used to detect the Docusaurus version
 * @returns Formatted permalink string
 */
export const formatMDXPermalink = (
  id: string,
  meta?: Maybe<MetaInfo>,
): MDXString => {
  if (
    isFrameworkVersionAtLeast(
      meta,
      DOCUSAURUS_FRAMEWORK,
      MDX_COMMENT_HEADING_ID_VERSION,
    )
  ) {
    return `{/* #${id} */}` as MDXString;
  }
  // use raw string to prevent MDX from interpreting the curly braces as JSX
  return String.raw`\{#${id}\}` as MDXString;
};

export const createMDXFormatter = (meta?: Maybe<MetaInfo>): Formatter => {
  return {
    formatMDXBadge,
    formatMDXAdmonition: (
      admonition: AdmonitionType,
      _meta: Maybe<MetaInfo>,
    ): MDXString => {
      return formatMDXAdmonition(admonition, meta ?? _meta);
    },
    formatMDXBullet,
    formatMDXDetails,
    formatMDXFrontmatter,
    formatMDXLink,
    formatMDXNameEntity,
    formatMDXPermalink: (id: string): MDXString => {
      return formatMDXPermalink(id, meta);
    },
    formatMDXSpecifiedByLink,
  };
};
