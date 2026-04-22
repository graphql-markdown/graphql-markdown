/**
 * Hugo formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Hugo static site generator.
 * Uses GitHub-style alerts (Hugo 0.132+) for admonitions and
 * strips file extensions from internal links to match Hugo's URL routing.
 *
 * @packageDocumentation
 */

import { join } from "node:path";

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  Formatter,
  FrontMatterOptions,
  GenerateIndexMetafileHook,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  ensureDir,
  formatFrontMatterObject,
  saveFile,
  startCase,
} from "@graphql-markdown/utils";

/**
 * Maps graphql-markdown admonition types to Hugo GitHub-style alert types (Hugo 0.132+).
 * @see https://gohugo.io/render-hooks/blockquotes/#alerts
 */
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

/**
 * Prefixes every line of a multiline string with `> ` to produce a Markdown blockquote.
 * @param text - The text to quote
 * @returns Blockquote-formatted string
 */
const quoteLines = (text: string): string => {
  return text
    .split(MARKDOWN_EOL)
    .map((line) => {
      return `> ${line}`;
    })
    .join(MARKDOWN_EOL);
};

/**
 * Formats a badge as a styled span element.
 * @param badge - Badge data containing the display text
 * @returns HTML `<span>` string with the `gqlmd-badge` class
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  return `<span class="gqlmd-badge">${text as string}</span>` as MDXString;
};

/**
 * Formats an admonition using Hugo GitHub-style alert syntax (`> [!TYPE]`).
 * Requires Hugo 0.132 or later.
 * @param text - The admonition body text
 * @param title - Optional title rendered as bold text after the alert type line
 * @param type - Admonition type (e.g. `note`, `warning`, `danger`) mapped via {@link ALERT_TYPE_MAP}
 * @param _meta - Unused metadata parameter
 * @returns Formatted blockquote alert string
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
  return `&nbsp;&bull;&nbsp;${text}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element.
 * @param dataOpen - Label shown when the section is collapsed (used as `<summary>` text)
 * @param dataClose - Label shown inside the expanded section
 * @returns HTML `<details>`/`<summary>` block string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}${MARKDOWN_EOL}\r${MARKDOWN_EOL}${MARKDOWN_EOL}<p><em>${dataClose}</em></p>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Formats YAML front matter wrapped in `---` delimiters, with page title rendered as H1 heading.
 * Falls back to serializing `props` via {@link formatFrontMatterObject} when `formatted` is not provided.
 * The title is extracted from the frontmatter lines and also rendered as a visible `# Title` heading,
 * since Hugo does not automatically display the frontmatter `title` field as page content.
 * @param props - Front matter options used as fallback when `formatted` is not provided
 * @param formatted - Pre-formatted front matter lines produced by the printer
 * @returns Formatted front matter block with H1 title heading, or empty string if no data
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  const lines = formatted ?? (props ? formatFrontMatterObject(props) : []);

  if (lines.length === 0) {
    return "" as MDXString;
  }

  const titleLine = lines.find((line) => {
    return line.trimStart().startsWith("title:");
  });
  const title = titleLine
    ? titleLine
        .replace(/^\s*title:\s*["']?(.+?)["']?\s*$/, "$1")
        .replace(/\r?\n/g, " ")
        .trim()
    : "";

  const frontmatter = [
    FRONT_MATTER_DELIMITER,
    ...lines,
    FRONT_MATTER_DELIMITER,
  ].join(MARKDOWN_EOL);
  const heading = title ? `${MARKDOWN_EOL}${MARKDOWN_EOL}# ${title}` : "";

  return `${frontmatter}${heading}` as MDXString;
};

/**
 * Strips the `.md` extension from internal links.
 * Hugo serves pages at extensionless URLs — links with `.md` would 404 in the built site.
 * @param text - Display text for the link
 * @param url - Link target URL, with `.md` extension removed if present
 * @returns Link object with the cleaned URL
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

/** File extension used for generated pages — Hugo uses standard Markdown (.md) files. */
export const mdxExtension = ".md" as const;

/**
 * Lifecycle hook that generates a Hugo-compatible `_index.md` section index file.
 * The file is (re)created on every run with YAML frontmatter:
 * - `title`: the start-cased category name
 * - `type: docs`: required by the Hugo Book theme for sidebar rendering
 * - `bookCollapseSection: true`: collapses the section in the Hugo Book theme sidebar by default
 * @param event - Hook event whose `data` contains `dirPath` (target directory) and `category` (section name)
 */
export const beforeGenerateIndexMetafileHook: GenerateIndexMetafileHook =
  async (event): Promise<void> => {
    const { dirPath, category } = (
      event as { data: { dirPath: string; category: string } }
    ).data;
    const filePath = join(dirPath, "_index.md");
    const label = startCase(category);
    const content = `${FRONT_MATTER_DELIMITER}${MARKDOWN_EOL}title: "${label}"${MARKDOWN_EOL}type: docs${MARKDOWN_EOL}bookCollapseSection: true${MARKDOWN_EOL}${FRONT_MATTER_DELIMITER}${MARKDOWN_EOL}${MARKDOWN_EOL}# ${label}${MARKDOWN_EOL}${MARKDOWN_EOL}`;

    await ensureDir(dirPath);
    await saveFile(filePath, content);
  };
