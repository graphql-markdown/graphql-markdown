/**
 * MkDocs formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with MkDocs admonitions, HTML details blocks,
 * and visible page headings.
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
  RenderTypeEntitiesHook,
  TypeLink,
} from "@graphql-markdown/types";
import {
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  readFile,
  saveFile,
  toRelativeGeneratedDocLink,
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

const extractTitle = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): string => {
  const lines = formatted ?? [];
  const titleLine = lines.find((line) => {
    return line.trimStart().startsWith("title:");
  });

  let titleFromProps = "";
  if (props && typeof props === "object" && "title" in props) {
    const titleValue = (props as { title?: unknown }).title;
    if (typeof titleValue === "string") {
      titleFromProps = titleValue;
    } else if (typeof titleValue === "number") {
      titleFromProps = `${titleValue}`;
    }
  }

  return titleLine
    ? titleLine.replace(/^\s*title:\s*["']?(.+?)["']?\s*$/, "$1").trim()
    : titleFromProps;
};

const rewriteInternalLinks = (
  content: string,
  filePath: string,
  outputDir: string,
  baseURL: string,
): string => {
  return content.replace(
    /\]\((\/[^)\s#]+)(#[^)\s]+)?\)/g,
    (match, urlPath, hash = "") => {
      const relativePath = toRelativeGeneratedDocLink({
        baseURL,
        currentFilePath: filePath,
        outputDir,
        targetUrlPath: urlPath,
      });

      if (!relativePath) {
        return match;
      }

      return `](${relativePath}${hash})`;
    },
  );
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
  return `&nbsp;&bull;&nbsp;${text}` as MDXString;
};

/**
 * Formats a collapsible block as an HTML `<details>` element.
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
 * Formats page title as a visible H1 heading.
 * @param props - Front matter options used as a fallback title source
 * @param formatted - Pre-formatted front matter lines
 * @returns Visible heading string, or empty string if no title is available
 */
export const formatMDXFrontmatter = (
  props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  const title = extractTitle(props, formatted);
  return title ? (`# ${title}` as MDXString) : ("" as MDXString);
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

/** File extension used for generated pages — MkDocs uses standard Markdown (.md) files. */
export const mdxExtension = ".md" as const;

/**
 * Lifecycle hook that rewrites generated absolute GraphQL-Markdown links
 * into page-relative `.md` links compatible with MkDocs validation.
 * @param event - Hook payload containing the current file path and renderer output context
 */
export const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook = async (
  event,
): Promise<void> => {
  const { baseURL, filePath, outputDir } = (
    event as {
      data: { baseURL: string; filePath: string; outputDir: string };
    }
  ).data;

  const content = await readFile(filePath, "utf-8");
  const rewrittenContent = rewriteInternalLinks(
    content,
    filePath,
    outputDir,
    baseURL,
  );

  if (rewrittenContent !== content) {
    await saveFile(filePath, rewrittenContent);
  }
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
