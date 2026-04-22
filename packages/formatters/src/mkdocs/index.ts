/**
 * MkDocs Material formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with MkDocs Material theme admonitions,
 * collapsible blocks, and standard YAML front matter.
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

const ADMONITION_TYPE_MAP: Record<string, string> = {
  note: "note",
  tip: "tip",
  info: "info",
  warning: "warning",
  danger: "danger",
  deprecated: "warning",
  caution: "warning",
  success: "success",
};

const indentLines = (text: string, spaces: number): string => {
  const indent = " ".repeat(spaces);
  return text
    .split(MARKDOWN_EOL)
    .map((line) => {
      return line.trim() ? `${indent}${line}` : "";
    })
    .join(MARKDOWN_EOL);
};

/**
 * Formats a badge as an inline HTML mark element.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted badge string
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  return `<mark class="gqlmd-mkdocs-badge">${text as string}</mark>` as MDXString;
};

/**
 * Formats an admonition using MkDocs Material `!!!` block syntax.
 * Content is indented by 4 spaces as required by the spec.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const mkdocsType = ADMONITION_TYPE_MAP[type.toLowerCase()] ?? "note";
  const titleAttr = title ? ` "${title}"` : "";
  return `${MARKDOWN_EOP}!!! ${mkdocsType}${titleAttr}${MARKDOWN_EOL}${indentLines(text, 4)}${MARKDOWN_EOL}` as MDXString;
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
 * Formats a collapsible block using MkDocs Material `???` syntax.
 * @param option - Configuration for open/close label text
 * @returns Formatted collapsible string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}??? note "${dataOpen}"${MARKDOWN_EOL}${MARKDOWN_EOL}    \r${MARKDOWN_EOL}${MARKDOWN_EOL}    *${dataClose}*${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats YAML front matter wrapped in `---` delimiters.
 * @param _props - Front matter options (unused — formatting is handled by the caller)
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
 * Returns the link unchanged — MkDocs resolves `.md` links natively.
 * @param link - Link data with URL and text
 * @returns The link unchanged
 */
export const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
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
 * Creates an MkDocs Material formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for MkDocs Material output
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
