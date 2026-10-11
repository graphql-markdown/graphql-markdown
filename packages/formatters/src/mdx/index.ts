/**
 * Generic MDX formatter for GraphQL documentation output.
 *
 * Produces framework-neutral `.mdx` pages: plain Markdown and JSX-safe HTML,
 * with no framework components and no `import` declarations.
 * Header permalinks are escaped (`\{#id\}`) so that they remain valid MDX.
 * YAML front matter is kept, and internal links are rewritten to page-relative paths.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  Formatter,
  Maybe,
  MDXString,
  MetaInfo,
  RenderTypeEntitiesHook,
  TypeLink,
} from "@graphql-markdown/types";
import {
  appendExtensionToAbsolutePathWithoutExtension,
  quoteMarkdownLines,
} from "@graphql-markdown/helpers";
import {
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  toRelativeGeneratedDocLink,
} from "@graphql-markdown/utils";
import {
  formatMDXBullet,
  formatMDXEscapedPermalink,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults";
import { rewriteRenderedPage } from "../output";

/** Generic MDX pages use the `.mdx` extension. */
export const mdxExtension = ".mdx";

/**
 * Formats a badge as an HTML `<mark>` element (valid JSX, no component).
 * @param badge - Badge data containing text
 * @returns Formatted badge string
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${text as string}</mark>` as MDXString;
};

/**
 * Formats an admonition as a Markdown blockquote with a bold type/title label.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const label = title?.trim() ? title.trim() : type.toUpperCase();
  return `${MARKDOWN_EOP}> **${label}**${MARKDOWN_EOL}>${MARKDOWN_EOL}${quoteMarkdownLines(text, MARKDOWN_EOL)}${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element.
 * The output is split on `\r` by the printer into [openSection, closeSection].
 * @param option - Configuration for open/close label text
 * @returns Formatted collapsible string
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details>${MARKDOWN_EOL}<summary>${dataOpen}</summary>${MARKDOWN_EOL}${MARKDOWN_EOL}\r${MARKDOWN_EOL}${MARKDOWN_EOL}<em>${dataClose}</em>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Rewrites extensionless absolute links so they point to `.mdx` pages.
 * @param link - Link data with URL and text
 * @returns The link with `.mdx` appended to extensionless absolute paths
 */
export const formatMDXLink = (link: TypeLink): TypeLink => {
  const { url } = link;
  if (!url) {
    return link;
  }

  return {
    ...link,
    url: appendExtensionToAbsolutePathWithoutExtension(url, mdxExtension),
  };
};

export {
  formatMDXBullet,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
};

/**
 * Formats a header permalink with escaped braces (`\{#id\}`), valid in MDX.
 * @param id - The ID of the section header
 * @returns Escaped permalink string
 */
export const formatMDXPermalink = formatMDXEscapedPermalink;

const rewriteInternalLinks = (
  content: string,
  filePath: string,
  outputDir: string,
  baseURL: string,
): string => {
  return content.replaceAll(
    /\]\((\/[^)\s#]+)(#[^)\s]+)?\)/g,
    (_match, urlPath, hash = "") => {
      const relativePath = toRelativeGeneratedDocLink({
        baseURL,
        currentFilePath: filePath,
        extension: mdxExtension,
        outputDir,
        targetUrlPath: urlPath,
      });

      const target = relativePath ?? urlPath;
      return `](${target}${hash})`;
    },
  );
};

/**
 * Rewrites absolute generated doc links to page-relative `.mdx` paths after each page is rendered.
 */
export const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook = async (
  event,
): Promise<void> => {
  await rewriteRenderedPage(event, rewriteInternalLinks);
};

/**
 * Creates a generic MDX formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for generic MDX output
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
