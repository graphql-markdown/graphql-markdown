/**
 * DocFX formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Microsoft DocFX.
 * Uses DocFX alert syntax for admonitions and injects the required
 * `uid` front matter field for cross-reference resolution.
 *
 * @packageDocumentation
 */

import { dirname, resolve, basename, relative } from "node:path";

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
import { quoteMarkdownLines } from "@graphql-markdown/helpers";
import {
  capitalize,
  fileExists,
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  readFile,
  saveFile,
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

/** Maps graphql-markdown badge classnames to Bootstrap 5 contextual badge classes. */
export const BADGE_CLASS_MAP: Record<string, string> = {
  DEPRECATED: "text-bg-danger",
  NON_NULL: "text-bg-primary",
  RELATION: "text-bg-info",
};

/**
 * Formats a badge using Bootstrap 5 badge classes available in DocFX's modern template.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted badge string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const key = Array.isArray(classname) ? classname[0] : classname;
  const variant = (key && BADGE_CLASS_MAP[key]) ?? "text-bg-secondary";
  return `<span class="badge ${variant}">${text as string}</span>` as MDXString;
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
  return `${MARKDOWN_EOP}> [!${alertType}]${titleLine}${MARKDOWN_EOL}${quoteMarkdownLines(text, MARKDOWN_EOL)}${MARKDOWN_EOL}` as MDXString;
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

export const mdxExtension = ".md" as const;

// ─── toc.yml builder ────────────────────────────────────────────────────────

const writeQueue = new Map<string, Promise<void>>();

const queueFileUpdate = async (
  filePath: string,
  update: () => Promise<void>,
): Promise<void> => {
  const previous = writeQueue.get(filePath) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(update);
  writeQueue.set(filePath, next);
  return next;
};

const updateToc = async (
  tocFilePath: string,
  name: string,
  href: string,
): Promise<void> => {
  await queueFileUpdate(tocFilePath, async () => {
    const entry = `- name: ${name}${MARKDOWN_EOL}  href: ${href}`;

    if (!(await fileExists(tocFilePath))) {
      await saveFile(tocFilePath, entry + MARKDOWN_EOL);
      return;
    }

    const existing = await readFile(tocFilePath, "utf-8");
    if (existing.includes(`href: ${href}`)) {
      return;
    }

    await saveFile(
      tocFilePath,
      existing.trimEnd() + MARKDOWN_EOL + entry + MARKDOWN_EOL,
    );
  });
};

// Tracks directories whose index.md has already been prepended to their toc.yml.
// Module-level so it persists across all hook invocations within one generation run.
const seenDirectories = new Set<string>();

/**
 * Builds DocFX `toc.yml` navigation files as each entity page is written.
 *
 * Walks up from the generated file to the graphql output root (`outputDir`),
 * writing or updating a `toc.yml` at every directory level. Section index pages
 * are prepended as an "Overview" entry on first encounter.
 */
export const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook = async (
  event,
): Promise<void> => {
  const { filePath, name, outputDir } = (
    event as { data: { filePath: string; name: string; outputDir: string } }
  ).data;

  const graphqlRoot = resolve(outputDir);

  // Rewrite uid as a path-derived value to guarantee uniqueness across the site.
  // e.g. operations/queries/continent.md → uid: operations-queries-continent
  const uid = relative(graphqlRoot, filePath)
    .replace(/\.mdx?$/, "")
    .replace(/[/\\]/g, "-");
  const content = await readFile(filePath, "utf-8");
  const rewritten = content.replace(/^(\s*)uid:.*$/m, `$1uid: ${uid}`);
  if (rewritten !== content) {
    await saveFile(filePath, rewritten);
  }

  let currentDir = resolve(dirname(filePath));
  let currentHref = basename(filePath);
  let currentName = name;

  while (currentDir.startsWith(graphqlRoot)) {
    const tocPath = resolve(currentDir, "toc.yml");

    if (!seenDirectories.has(currentDir)) {
      seenDirectories.add(currentDir);
      if (currentDir === graphqlRoot) {
        // Homepage is written after hooks run, so add Overview unconditionally.
        await updateToc(tocPath, "Overview", "index.md");
      } else {
        const indexPath = resolve(currentDir, "index.md");
        if (await fileExists(indexPath)) {
          await updateToc(
            tocPath,
            `${capitalize(basename(currentDir))} Overview`,
            "index.md",
          );
        }
      }
    }

    await updateToc(tocPath, currentName, currentHref);

    if (currentDir === graphqlRoot) break;

    currentHref = `${basename(currentDir)}/toc.yml`;
    currentName = capitalize(basename(currentDir));
    currentDir = dirname(currentDir);
  }
};
