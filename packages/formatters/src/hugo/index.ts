/**
 * Hugo formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Hugo static site generator.
 * Uses GitHub-style alerts (Hugo 0.132+) for admonitions and
 * strips file extensions from internal links to match Hugo's URL routing.
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

/** Maps graphql-markdown admonition types to Hugo GitHub-style alert types (Hugo 0.132+). */
const ALERT_TYPE_MAP: Record<string, string> = {
  note: "NOTE",
  tip: "TIP",
  info: "IMPORTANT",
  warning: "WARNING",
  danger: "CAUTION",
  deprecated: "WARNING",
  caution: "CAUTION",
  success: "NOTE",
};

const quoteLines = (text: string): string => {
  return text
    .split(MARKDOWN_EOL)
    .map((line) => {
      return `> ${line}`;
    })
    .join(MARKDOWN_EOL);
};

/**
 * Formats a badge as an inline HTML mark element.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted badge string
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  return `<mark class="gqlmd-hugo-badge">${text as string}</mark>` as MDXString;
};

/**
 * Formats an admonition using Hugo GitHub-style alert syntax (`> [!TYPE]`).
 * Requires Hugo 0.132 or later.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const alertType = ALERT_TYPE_MAP[type.toLowerCase()] ?? "NOTE";
  const titleLine = title ? `${MARKDOWN_EOL}> **${title}**` : "";
  return `${MARKDOWN_EOP}> [!${alertType}]${titleLine}${MARKDOWN_EOL}${quoteLines(text)}${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats a bullet point separator.
 * @param text - Optional text to append after the bullet
 * @returns Formatted bullet string
 */
export const formatMDXBullet = (text = ""): MDXString => {
  return `&bull;&nbsp;${text}` as MDXString;
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
  return `${MARKDOWN_EOP}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}${MARKDOWN_EOL}\r${MARKDOWN_EOL}${MARKDOWN_EOL}<p><em>${dataClose}</em></p>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
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
 * Strips the `.md` extension from internal links.
 * Hugo outputs extensionless URLs — links with `.md` would 404 in the built site.
 * @param link - Link data with URL and text
 * @returns Link with `.md` extension removed from the URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  return {
    text,
    url: url.replace(/\.md$/, ""),
  };
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
 * Creates a Hugo formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Hugo output
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
