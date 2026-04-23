/**
 * mdBook formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Rust's mdBook static site generator.
 * Front matter is suppressed because mdBook renders it as literal content.
 * Admonitions use mdBook's native `> [!TYPE]` syntax.
 * Exports `afterRenderFilesHook` to build `SUMMARY.md` after all pages are written.
 *
 * @packageDocumentation
 */

import { dirname, join, relative } from "node:path";

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  Formatter,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MetaInfo,
  RenderFilesHook,
  TypeLink,
} from "@graphql-markdown/types";
import {
  appendExtensionToAbsolutePathWithoutExtension,
  extractFrontmatterTitle,
  quoteMarkdownLines,
} from "@graphql-markdown/helpers";
import {
  firstUppercase,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  saveFile,
} from "@graphql-markdown/utils";
import { formatMDXNameEntity, formatMDXSpecifiedByLink } from "../defaults";

/**
 * Formats a badge as Markdown bold text — mdBook has no badge component.
 * @param badge - Badge data containing text
 * @returns Formatted bold text string
 */
export const formatMDXBadge = ({ text }: Badge): MDXString => {
  return `**${text as string}**` as MDXString;
};

/**
 * Formats an admonition using mdBook's native admonition syntax (`> [!TYPE]`).
 * Uses `type` for the admonition tag and `title` as an optional override label.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const tag = type.toUpperCase();
  const titleLine = title?.trim() ? `> ${title.trim()}${MARKDOWN_EOL}` : "";
  return `${MARKDOWN_EOP}> [!${tag}]${MARKDOWN_EOL}${titleLine}${quoteMarkdownLines(text, MARKDOWN_EOL)}${MARKDOWN_EOL}` as MDXString;
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
 * Renders a deprecated section as a bold inline label.
 *
 * A fixed heading level would break hierarchy when this section is nested
 * inside field entries at varying depths. Bold text is CommonMark-safe and
 * works at any nesting level without affecting the heading outline.
 *
 * The output is split on `\r` to produce [openSection, closeSection] as the
 * printer expects — the deprecated items are inserted between the two halves.
 * @param option - Configuration for the section label
 * @returns Bold label + split marker
 */
export const formatMDXDetails = ({
  dataOpen,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}**${firstUppercase(dataOpen.toLowerCase())}**${MARKDOWN_EOL}\r${MARKDOWN_EOP}` as MDXString;
};

/**
 * Replaces front matter with an H1 title heading.
 * mdBook renders `---` YAML blocks as literal content, so front matter is
 * suppressed entirely. The page title is emitted as `# Title` instead.
 * @returns `# Title\n` when a title is available, otherwise an empty string
 */
export const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  const title = extractFrontmatterTitle(formatted);
  return (title ? `# ${title}${MARKDOWN_EOL}` : "") as MDXString;
};

/** mdBook expects `.md` files; override the default `.mdx` extension. */
export const mdxExtension = ".md";

/**
 * Returns the link unchanged — mdBook resolves `.md` links natively.
 * @param link - Link data with URL and text
 * @returns The link with `.md` appended to extensionless absolute paths
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

export { formatMDXNameEntity, formatMDXSpecifiedByLink };

/**
 * Creates an mdBook formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for mdBook output
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

const SECTION_ORDER = [
  "Queries",
  "Mutations",
  "Subscriptions",
  "Directives",
  "Objects",
  "Interfaces",
  "Unions",
  "Inputs",
  "Enums",
  "Scalars",
] as const;

/**
 * Builds `src/SUMMARY.md` after all pages have been written.
 *
 * mdBook requires every page to be listed in `SUMMARY.md` before the site can
 * be built. This hook collects all rendered pages from the event, groups them
 * by top-level section (Operations / Types) and category, then writes the file.
 */
export const afterRenderFilesHook: RenderFilesHook = async (
  event,
): Promise<void> => {
  const { baseURL, outputDir, rootDir, pages } = (
    event as {
      data: {
        baseURL: string;
        outputDir: string;
        rootDir: string;
        pages: unknown[];
      };
    }
  ).data;

  const summaryPath = join(rootDir, "SUMMARY.md");

  const allPages = pages
    .flat()
    .filter((p): p is { category: string; filePath: string; name: string } => {
      return p !== null && typeof p === "object";
    });

  const grouped = new Map<
    string,
    {
      topSection: string;
      category: string;
      entries: { filePath: string; name: string }[];
    }
  >();

  for (const { category, filePath, name } of allPages) {
    const topSegment = relative(outputDir, dirname(filePath)).split(/[\\/]/)[0];
    const topSection = firstUppercase(topSegment);
    const key = `${topSection}/${category}`;
    if (!grouped.has(key)) {
      grouped.set(key, { topSection, category, entries: [] });
    }
    grouped.get(key)!.entries.push({ filePath, name });
  }

  const sorted = [...grouped.values()].sort((a, b) => {
    if (a.topSection !== b.topSection) {
      return a.topSection === "Operations" ? -1 : 1;
    }
    return (
      SECTION_ORDER.indexOf(a.category as (typeof SECTION_ORDER)[number]) -
      SECTION_ORDER.indexOf(b.category as (typeof SECTION_ORDER)[number])
    );
  });

  const lines: string[] = [
    "# Summary",
    "",
    "[Introduction](introduction.md)",
    "",
    "---",
    "",
    `[GraphQL API Reference](${baseURL}/index${mdxExtension}})`,
    "",
  ];

  let lastTopSection: string | null = null;

  for (const { topSection, category, entries } of sorted) {
    if (topSection !== lastTopSection) {
      lines.push(`# ${topSection}`, "");
      lastTopSection = topSection;
    }

    lines.push(`- [${category}]()`);

    for (const { filePath, name: pageName } of entries) {
      const relPath = relative(rootDir, filePath).replaceAll(/\\/g, "/");
      lines.push(`  - [${pageName}](${relPath})`);
    }

    lines.push("");
  }

  await saveFile(summaryPath, lines.join("\n"));
};
