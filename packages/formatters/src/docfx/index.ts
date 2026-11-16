/**
 * DocFX formatter for GraphQL documentation output.
 *
 * Produces Markdown compatible with Microsoft DocFX.
 * Uses DocFX alert syntax for admonitions and injects the required
 * `uid` front matter field for cross-reference resolution.
 *
 * @packageDocumentation
 */

import { dirname, join, basename, relative } from "node:path";

import type {
  AdmonitionType,
  Badge,
  Formatter,
  FrontMatterOptions,
  Maybe,
  OutputAdapter,
  MDXString,
  MetaInfo,
  RenderTypeEntitiesHook,
  TypeLink,
} from "@graphql-markdown/types";
import { quoteMarkdownLines } from "@graphql-markdown/helpers";
import {
  capitalize,
  fsOutputAdapter,
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  toRelativeGeneratedDocLink,
} from "@graphql-markdown/utils";
import {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults.ts";
import { readOptionalOutput, readOutput, writeOutput } from "../output.ts";

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
 *
 * DocFX renders its own heading for each alert type (Note, Warning, ...), and
 * the syntax has no slot for a custom title, so the admonition title is not
 * printed. Blank lines around the text are dropped and blank lines within it
 * collapse to a single `>` paragraph separator.
 *
 * @see https://dotnet.github.io/docfx/docs/markdown.html#alerts
 *
 * @param admonition - Admonition data with text and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted admonition string
 */
export const formatMDXAdmonition = (
  { text, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const alertType = ALERT_TYPE_MAP[type.toLowerCase()] ?? "NOTE";
  const paragraphs = text
    .split(/(?:\r?\n[ \t]*){2,}/)
    .map((paragraph) => {
      return paragraph.trim();
    })
    .filter(Boolean);
  const body = paragraphs.length
    ? `${MARKDOWN_EOL}${quoteMarkdownLines(paragraphs.join(MARKDOWN_EOP), MARKDOWN_EOL).replaceAll(/^> $/gm, ">")}`
    : "";
  return `${MARKDOWN_EOP}> [!${alertType}]${body}${MARKDOWN_EOP}` as MDXString;
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
  const uidLine = id ? [`uid: ${id}`] : [];

  return [
    FRONT_MATTER_DELIMITER,
    ...uidLine,
    ...formatted,
    FRONT_MATTER_DELIMITER,
  ].join(MARKDOWN_EOL) as MDXString;
};

/**
 * Formats the page title as a visible `# Title` heading.
 *
 * DocFX only uses the front matter `title` for the document `<title>`; the
 * page heading comes from the Markdown H1, so without it generated pages
 * have no visible title.
 *
 * @see https://dotnet.github.io/docfx/docs/markdown.html
 *
 * @param title - The page title
 * @returns `# Title` heading
 */
export const formatMDXTitle = (title: string): MDXString => {
  return `# ${title}` as MDXString;
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
 * Formats a permalink for a section header as an empty HTML anchor.
 *
 * DocFX does not support the `{#id}` heading id syntax unless the Markdig
 * `attributes` extension is enabled: the braces are printed as text, and the
 * heading id is generated from the whole heading, badges included. An inline
 * anchor gives every field and argument a stable id derived from its name only.
 *
 * @param id - The ID of the section header
 * @returns Formatted permalink string
 */
export const formatMDXPermalink = (id: string): MDXString => {
  return `<a id="${id}"></a>` as MDXString;
};

export {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults.ts";

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
    formatMDXPermalink,
    formatMDXSpecifiedByLink,
    formatMDXTitle,
  };
};

/**
 * The file extension used for MDX files in DocFX output.
 */
export const mdxExtension = ".md" as const;

/**
 * Determines if a link is an absolute internal link within the documentation.
 */
const isAbsoluteInternalLink = (
  content: string,
  urlStart: number,
): { closePos: number; urlWithHash: string } | null => {
  if (content[urlStart] !== "/") return null;
  const closePos = content.indexOf(")", urlStart);
  if (closePos === -1) return null;
  const urlWithHash = content.slice(urlStart, closePos);
  if (/\s/u.test(urlWithHash)) return null;
  return { closePos, urlWithHash };
};

/**
 * Resolves an internal link to its relative path within the generated documentation.
 */
const resolveLink = (
  urlWithHash: string,
  filePath: string,
  outputDir: string,
  normalizedBaseURL: string,
  baseSegment: string,
  knownDocPaths?: ReadonlySet<string>,
): string => {
  const sepIdx = urlWithHash.indexOf("#");
  const [urlPath, hash] =
    sepIdx < 0
      ? [urlWithHash, ""]
      : [urlWithHash.slice(0, sepIdx), urlWithHash.slice(sepIdx)];

  // Strip any linkRoot prefix so toRelativeGeneratedDocLink can resolve the path.
  // e.g. /docs/graphql/types/scalars/id → /graphql/types/scalars/id
  const baseIndex = urlPath.indexOf(baseSegment);
  if (baseIndex === -1) return `](${urlWithHash})`;

  const relative = toRelativeGeneratedDocLink({
    baseURL: normalizedBaseURL,
    currentFilePath: filePath,
    extension: mdxExtension,
    knownDocPaths,
    outputDir,
    targetUrlPath: urlPath.slice(baseIndex),
  });

  return `](${relative ?? urlPath}${hash})`;
};

/**
 * Rewrites all absolute internal links in the content to relative links
 * based on the file's location and the documentation structure.
 */
const rewriteInternalLinks = (
  content: string,
  filePath: string,
  outputDir: string,
  baseURL: string,
  knownDocPaths?: ReadonlySet<string>,
): string => {
  const normalizedBaseURL = baseURL.split("/").filter(Boolean).join("/");
  const baseSegment = `/${normalizedBaseURL}/`;

  // Use indexOf scanning instead of regex to avoid ReDoS on file content.
  const out: string[] = [];
  let pos = 0;

  while (pos < content.length) {
    const markerPos = content.indexOf("](", pos);
    if (markerPos === -1) {
      out.push(content.slice(pos));
      break;
    }
    const urlStart = markerPos + 2;
    const match = isAbsoluteInternalLink(content, urlStart);
    if (!match) {
      out.push(content.slice(pos, urlStart));
      pos = urlStart;
      continue;
    }
    out.push(
      content.slice(pos, markerPos),
      resolveLink(
        match.urlWithHash,
        filePath,
        outputDir,
        normalizedBaseURL,
        baseSegment,
        knownDocPaths,
      ),
    );
    pos = match.closePos + 1;
  }

  return out.join("");
};

// ─── toc.yml builder ────────────────────────────────────────────────────────

/**
 * Map to track pending write operations for each file.
 * Ensures that concurrent writes to the same file are executed sequentially.
 */
const writeQueue = new Map<string, Promise<void>>();

/**
 * Queues a file update to ensure that multiple concurrent writes to the same file
 * are executed sequentially.
 */
const queueFileUpdate = async (
  filePath: string,
  update: () => Promise<void>,
): Promise<void> => {
  const previous = writeQueue.get(filePath) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(update);
  writeQueue.set(filePath, next);
  return next;
};

/** A `toc.yml` entry, as written by {@link updateToc}. */
interface TocEntry {
  name: string;
  href: string;
}

/** Href of a section index page, always listed first as its "Overview". */
const TOC_OVERVIEW_HREF = "index.md";

/**
 * Parses the entries of a `toc.yml` written by {@link updateToc}.
 */
const parseTocEntries = (content: string): TocEntry[] => {
  const entries: TocEntry[] = [];
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith("- name: ")) {
      entries.push({ name: line.slice("- name: ".length), href: "" });
    } else if (line.startsWith("  href: ") && entries.length > 0) {
      entries[entries.length - 1].href = line.slice("  href: ".length);
    }
  }
  return entries;
};

/**
 * Orders `toc.yml` entries deterministically: the section "Overview" first,
 * then by name (case-insensitive), then by href.
 *
 * Pages are rendered concurrently, so the order in which entries are added
 * changes from one build to the next.
 */
const compareTocEntries = (a: TocEntry, b: TocEntry): number => {
  const aOverview = a.href === TOC_OVERVIEW_HREF;
  const bOverview = b.href === TOC_OVERVIEW_HREF;
  if (aOverview !== bOverview) {
    return aOverview ? -1 : 1;
  }
  const byName = a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "en");
  if (byName !== 0) {
    return byName;
  }
  return a.href.localeCompare(b.href, "en");
};

/**
 * Updates the `toc.yml` file for a given directory with a new entry.
 * Ensures that multiple concurrent updates to the same file are queued, and
 * keeps the entries sorted so the file does not depend on completion order.
 */
const updateToc = async (
  tocFilePath: string,
  name: string,
  href: string,
  outputAdapter: Maybe<OutputAdapter>,
): Promise<void> => {
  await queueFileUpdate(tocFilePath, async () => {
    const existing = await readOptionalOutput(tocFilePath, outputAdapter);
    const entries =
      typeof existing === "string" ? parseTocEntries(existing) : [];

    if (
      entries.some((entry) => {
        return entry.href === href;
      })
    ) {
      return;
    }

    const content = [...entries, { name, href }]
      .sort(compareTocEntries)
      .map((entry) => {
        return `- name: ${entry.name}${MARKDOWN_EOL}  href: ${entry.href}${MARKDOWN_EOL}`;
      })
      .join("");

    await writeOutput(tocFilePath, content, outputAdapter);
  });
};

// Tracks directories whose index.md has already been prepended to their toc.yml,
// so the check runs once per directory rather than once per page. Keyed by
// destination: two adapters writing the same paths keep their own state, and a
// run with a fresh adapter starts over. `updateToc` skips an href it already
// holds, so a repeated attempt adds nothing.
const seenDirectories = new WeakMap<OutputAdapter, Set<string>>();

/**
 * Builds DocFX `toc.yml` navigation files as each entity page is written.
 *
 * Walks up from the generated file to the graphql output root (`outputDir`),
 * writing or updating a `toc.yml` at every directory level. Section index pages
 * are prepended as an "Overview" entry on first encounter.
 */
/**
 * Adds the "Overview" entry for a directory, the first time it is reached.
 *
 * @param currentDir - Directory whose toc.yml is being built
 * @param tocPath - Path of that toc.yml
 * @param isRoot - Whether the directory is the generated documentation root
 * @param outputAdapter - Destination the pages were written to
 */
const addOverviewEntry = async (
  currentDir: string,
  tocPath: string,
  isRoot: boolean,
  outputAdapter: Maybe<OutputAdapter>,
): Promise<void> => {
  if (isRoot) {
    // Homepage is written after hooks run, so add Overview unconditionally.
    await updateToc(tocPath, "Overview", "index.md", outputAdapter);
    return;
  }

  // the section index lives wherever the pages were written, which is not the
  // local filesystem when a custom adapter is configured
  const indexPath = join(currentDir, "index.md");

  if (
    typeof (await readOptionalOutput(indexPath, outputAdapter)) !== "string"
  ) {
    return;
  }

  await updateToc(
    tocPath,
    `${capitalize(basename(currentDir))} Overview`,
    "index.md",
    outputAdapter,
  );
};

/**
 * Adds a page, and every directory above it, to the toc.yml chain.
 *
 * The walk goes up in the same path shape the page was written with: resolving
 * here would hand an adapter an absolute `toc.yml` key next to a relative page
 * key, and a key based destination would file them apart.
 *
 * @param page - The rendered page, its display name and the output root
 * @param outputAdapter - Destination the pages were written to
 */
const updateTocChain = async (
  page: { filePath: string; name: string; outputDir: string; pagePath: string },
  outputAdapter: Maybe<OutputAdapter>,
): Promise<void> => {
  const { filePath, name, outputDir, pagePath } = page;
  const destination = outputAdapter ?? fsOutputAdapter;
  const seen = seenDirectories.get(destination) ?? new Set<string>();
  seenDirectories.set(destination, seen);

  let currentRelativeDir = dirname(pagePath);
  let currentHref = basename(filePath);
  let currentName = name;

  for (;;) {
    const isRoot = currentRelativeDir === "." || currentRelativeDir === "";
    const currentDir = isRoot ? outputDir : join(outputDir, currentRelativeDir);
    const tocPath = join(currentDir, "toc.yml");

    if (!seen.has(currentDir)) {
      seen.add(currentDir);
      await addOverviewEntry(currentDir, tocPath, isRoot, outputAdapter);
    }

    await updateToc(tocPath, currentName, currentHref, outputAdapter);

    if (isRoot) {
      return;
    }

    currentHref = `${basename(currentDir)}/toc.yml`;
    currentName = capitalize(basename(currentDir));
    currentRelativeDir = dirname(currentRelativeDir);
  }
};

export const afterRenderTypeEntitiesHook: RenderTypeEntitiesHook = async (
  event,
): Promise<void> => {
  const { baseURL, filePath, knownDocPaths, name, outputAdapter, outputDir } = (
    event as {
      data: {
        baseURL: string;
        filePath: string;
        knownDocPaths?: ReadonlySet<string>;
        name: string;
        outputAdapter?: OutputAdapter;
        outputDir: string;
      };
    }
  ).data;

  const pagePath = relative(outputDir, filePath);

  // Rewrite uid as a path-derived value to guarantee uniqueness across the site.
  // e.g. operations/queries/continent.md → uid: operations-queries-continent
  const uid = pagePath.replace(/\.mdx?$/, "").replaceAll(/[/\\]/g, "-");
  const content = await readOutput(filePath, outputAdapter);

  if (typeof content !== "string") {
    return;
  }

  // [ \t]* rather than \s* keeps the match within a single line: \s also
  // matches newlines, which would overlap with the `m`-flag line anchors and
  // cause polynomial backtracking when no "uid:" line is present.
  const withUid = content.replace(/^([ \t]*)uid:.*$/m, `$1uid: ${uid}`);
  const rewritten = rewriteInternalLinks(
    withUid,
    filePath,
    outputDir,
    baseURL,
    knownDocPaths,
  );

  if (rewritten !== content) {
    await writeOutput(filePath, rewritten, outputAdapter);
  }

  // A page outside the output root has no toc to belong to.
  if (pagePath.startsWith("..")) {
    return;
  }

  await updateTocChain({ filePath, name, outputDir, pagePath }, outputAdapter);
};
