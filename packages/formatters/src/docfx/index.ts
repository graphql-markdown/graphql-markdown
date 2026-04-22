/**
 * DocFX formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Microsoft DocFX.
 * Uses DocFX alert syntax for admonitions and injects the required
 * `uid` front matter field for cross-reference resolution.
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

/** Maps graphql-markdown admonition types to DocFX alert types. */
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
  return `<mark class="gqlmd-docfx-badge">${text as string}</mark>` as MDXString;
};

/**
 * Formats an admonition using DocFX alert syntax (`> [!TYPE]`).
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
  return `${MARKDOWN_EOP}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}${MARKDOWN_EOL}\r${MARKDOWN_EOL}${MARKDOWN_EOL}<em>${dataClose}</em>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Formats YAML front matter, injecting a `uid` field required by DocFX
 * for cross-reference resolution between pages.
 * @param props - Front matter options; `id` is used as the DocFX `uid` value
 * @param formatted - Pre-formatted front matter lines
 * @returns Formatted front matter block, or empty string if no lines provided
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  if (!formatted) return "" as MDXString;

  // DocFX requires a uid field for cross-reference resolution between pages
  const id =
    props && typeof props === "object" && "id" in props
      ? (props.id as string)
      : undefined;
  const uidLine = id ? [`  uid: ${id}`] : [];

  return [
    FRONT_MATTER_DELIMITER,
    ...uidLine,
    ...formatted,
    FRONT_MATTER_DELIMITER,
  ].join(MARKDOWN_EOL) as MDXString;
};

/**
 * Returns the link unchanged — DocFX resolves `.md` links natively.
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
 * Creates a DocFX formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for DocFX output
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
