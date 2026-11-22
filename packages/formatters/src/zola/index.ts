/**
 * Zola formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with the Zola static site generator.
 * Zola only accepts a fixed set of top-level front matter keys, so any other
 * key is moved under `extra:`. Internal links use Zola's build-checked
 * `@/path/to/page.md` form, and admonitions are plain blockquotes with a bold
 * title. Section pages are written as `_index.md` with `sort_by = "title"`.
 *
 * @packageDocumentation
 */

import type {
  AdmonitionType,
  Formatter,
  FrontMatterOptions,
  GenerateIndexMetafileHook,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import {
  extractFrontmatterTitle,
  quoteMarkdownLines,
} from "@graphql-markdown/helpers";
import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  formatFrontMatterObject,
} from "@graphql-markdown/utils";
import { createSectionIndexHook } from "../output.ts";
import { createMDXFormatter as createHugoFormatter } from "../hugo/index.ts";

/** Top-level front matter keys accepted by Zola pages. */
const ZOLA_PAGE_KEYS = new Set([
  "title",
  "description",
  "date",
  "updated",
  "weight",
  "draft",
  "slug",
  "path",
  "aliases",
  "template",
  "in_search_index",
  "render",
  "authors",
  "taxonomies",
]);

/**
 * Formats an admonition as a blockquote with a bold title.
 * @param admonition - Admonition data with text and optional title
 * @param _meta - Unused metadata parameter
 * @returns Formatted blockquote string
 */
export const formatMDXAdmonition = (
  { text, title }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const titleLine = title ? `> **${title}**${MARKDOWN_EOL}` : "";
  return `${MARKDOWN_EOP}${titleLine}${quoteMarkdownLines(text, MARKDOWN_EOL)}${MARKDOWN_EOL}` as MDXString;
};

/**
 * Formats YAML front matter keeping only Zola's top-level keys; others go under `extra:`.
 * A visible `# Title` heading follows the front matter.
 * @param props - Front matter options used as fallback when `formatted` is not provided
 * @param formatted - Pre-formatted front matter lines produced by the printer
 * @returns Front matter block with H1 heading, or empty string if no data
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  const lines = formatted ?? (props ? formatFrontMatterObject(props) : []);

  if (lines.length === 0) {
    return "" as MDXString;
  }

  const title = extractFrontmatterTitle(lines);

  const entries: { key: string; lines: string[] }[] = [];
  const baseIndent = /^\s*/.exec(lines[0])?.[0].length ?? 0;
  for (const rawLine of lines) {
    const line = rawLine.slice(
      Math.min(baseIndent, /^\s*/.exec(rawLine)![0].length),
    );
    if (/^\s/.test(line) && entries.length > 0) {
      entries.at(-1)!.lines.push(line);
      continue;
    }
    const match = /^([A-Za-z0-9_-]+):/.exec(line);
    if (match) {
      entries.push({ key: match[1], lines: [line] });
    }
  }

  const out: string[] = [FRONT_MATTER_DELIMITER];
  for (const entry of entries.filter((e) => {
    return ZOLA_PAGE_KEYS.has(e.key);
  })) {
    out.push(...entry.lines);
  }
  const extra = entries.filter((e) => {
    return !ZOLA_PAGE_KEYS.has(e.key);
  });
  if (extra.length > 0) {
    out.push("extra:");
    for (const entry of extra) {
      out.push(
        ...entry.lines.map((l) => {
          return `  ${l}`;
        }),
      );
    }
  }
  out.push(FRONT_MATTER_DELIMITER);

  const heading = title ? `${MARKDOWN_EOL}${MARKDOWN_EOL}# ${title}` : "";
  return `${out.join(MARKDOWN_EOL)}${heading}` as MDXString;
};

/**
 * Rewrites internal links to Zola's checked `@/path.md` form.
 * External links, anchor-only links and links already using `@/` are unchanged.
 * @param link - Link data with text and URL
 * @returns Link object with the rewritten URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#|@\/)/i.test(url)) {
    return { text, url };
  }

  const hashIndex = url.indexOf("#");
  const pathPart = hashIndex === -1 ? url : url.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
  const path = pathPart.replace(/^\/+/, "").replace(/\.md$/, "");
  return { text, url: `@/${path}.md${hash}` };
};

export { formatMDXBadge, formatMDXDetails } from "../hugo/index.ts";

export {
  formatMDXBullet,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
} from "../defaults.ts";

/**
 * Creates a Zola formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Zola output
 */
export const createMDXFormatter = (_meta?: Maybe<MetaInfo>): Formatter => {
  return {
    ...createHugoFormatter(_meta),
    formatMDXAdmonition,
    formatMDXFrontmatter,
    formatMDXLink,
  };
};

/** File extension used for generated pages. */
export const mdxExtension = ".md" as const;

/**
 * Lifecycle hook that generates a Zola `_index.md` section file with
 * `title` and `sort_by = "title"` front matter.
 * @param event - Hook event whose `data` contains `dirPath` and `category`
 */
export const beforeGenerateIndexMetafileHook: GenerateIndexMetafileHook =
  createSectionIndexHook("_index.md", () => {
    return ['sort_by: "title"'];
  });
