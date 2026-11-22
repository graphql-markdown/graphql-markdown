/**
 * Docsify formatter for GraphQL documentation output.
 *
 * Builds on the Hugo preset (GitHub-style `> [!TYPE]` callouts, which Docsify
 * v5 renders natively) and adapts the output to Docsify:
 * - no front matter (Docsify would print it as text), only a `# Title` heading;
 * - internal links are root-absolute `/<path>.md` routes;
 * - every category folder gets a `README.md` (Docsify's folder index);
 * - a `_sidebar.md` is generated at the docs root once all pages are written.
 *
 * @packageDocumentation
 */

import { join, relative } from "node:path";

import type {
  Formatter,
  GenerateIndexMetafileHook,
  Maybe,
  MDXString,
  MetaInfo,
  FrontMatterOptions,
  OutputAdapter,
  RenderFilesHook,
  TypeLink,
} from "@graphql-markdown/types";
import { extractFrontmatterTitle } from "@graphql-markdown/helpers";
import { MARKDOWN_EOL, startCase } from "@graphql-markdown/utils";
import {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
} from "../hugo/index.ts";
import { readOptionalOutput, writeOutput } from "../output.ts";

/** File extension used for generated pages. */
export const mdxExtension = ".md" as const;

/**
 * Docsify has no front matter support (it would print the YAML as text).
 * Only the page title is kept, rendered as a level 1 heading.
 * @param _props - Unused front matter options
 * @param formatted - Pre-formatted front matter lines produced by the printer
 * @returns A `# Title` heading, or an empty string when there is no title
 */
export const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  const title = extractFrontmatterTitle(formatted ?? []);
  if (!title) {
    return "" as MDXString;
  }
  return `# ${title}${MARKDOWN_EOL}${MARKDOWN_EOL}` as MDXString;
};

/**
 * Turns internal links into root-absolute `/<path>.md` routes.
 * External links and `#`-only links are returned unchanged.
 * @param link - Link data with text and URL
 * @returns Link object with the Docsify route as URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) {
    return { text, url };
  }

  const [pathPart, ...anchor] = url.split("#");
  const path = pathPart
    .replaceAll("\\", "/")
    .replace(/^(\.\.?\/)+/, "")
    .replace(/^\/+/, "");
  const withExt = path.endsWith(mdxExtension) ? path : `${path}${mdxExtension}`;
  const hash = anchor.length > 0 ? `#${anchor.join("#")}` : "";
  return { text, url: `/${withExt}${hash}` };
};

export {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXNameEntity,
  formatMDXPermalink,
  formatMDXSpecifiedByLink,
} from "../hugo/index.ts";

/**
 * Creates a Docsify formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Docsify output
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

/**
 * Seeds the Docsify folder index (`README.md`) of a category directory.
 * It is completed with the page links by {@link afterRenderFilesHook}.
 * @param event - Hook event whose `data` contains `dirPath` and `category`
 */
export const beforeGenerateIndexMetafileHook: GenerateIndexMetafileHook =
  async (event): Promise<void> => {
    const { dirPath, category, outputAdapter } = (
      event as {
        data: {
          dirPath: string;
          category: string;
          outputAdapter?: OutputAdapter;
        };
      }
    ).data;

    await writeOutput(
      join(dirPath, "README.md"),
      `# ${startCase(category)}${MARKDOWN_EOL}${MARKDOWN_EOL}`,
      outputAdapter,
      dirPath,
    );
  };

const toTitle = (name: string): string => {
  return name
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => {
      return char.toUpperCase();
    });
};

const byName = (a: string, b: string): number => {
  return a.localeCompare(b);
};

interface DirNode {
  dirs: Map<string, DirNode>;
  files: Map<string, string>; // file name -> absolute file path
}

const newNode = (): DirNode => {
  return { dirs: new Map(), files: new Map() };
};

/**
 * Builds `_sidebar.md` and completes every folder `README.md` once all pages
 * have been written.
 * @param event - Hook event with `baseURL`, `outputDir`, `rootDir`, `pages` and `outputAdapter`
 */
export const afterRenderFilesHook: RenderFilesHook = async (
  event,
): Promise<void> => {
  const { baseURL, outputDir, rootDir, pages, outputAdapter } = (
    event as {
      data: {
        baseURL: string;
        outputDir: string;
        rootDir: string;
        pages: unknown[];
        outputAdapter?: OutputAdapter;
      };
    }
  ).data;

  const root = newNode();
  for (const page of pages.flat()) {
    if (page === null || typeof page !== "object") {
      continue;
    }
    const { filePath } = page as { filePath: string };
    const segments = relative(outputDir, filePath).split(/[\\/]/);
    const fileName = segments.pop()!;
    if (
      !fileName.endsWith(mdxExtension) ||
      fileName.toLowerCase() === "readme.md"
    ) {
      continue;
    }
    let node = root;
    for (const segment of segments) {
      if (!node.dirs.has(segment)) {
        node.dirs.set(segment, newNode());
      }
      node = node.dirs.get(segment)!;
    }
    node.files.set(fileName, filePath);
  }

  const pageTitle = async (
    filePath: string,
    fallback: string,
  ): Promise<string> => {
    const content = await readOptionalOutput(filePath, outputAdapter);
    const heading = content ? /^# (.+)$/m.exec(content) : null;
    return heading ? heading[1].trim() : fallback;
  };

  const toRoute = (path: string): string => {
    return `/${relative(rootDir, path).replaceAll("\\", "/")}`;
  };

  const walk = async (
    node: DirNode,
    dirPath: string,
    depth: number,
    label: string,
  ): Promise<string[]> => {
    const indent = "  ".repeat(depth);
    const lines: string[] = [];
    const indexLinks: string[] = [];

    for (const name of [...node.dirs.keys()].sort(byName)) {
      const childPath = join(dirPath, name);
      const childLabel = toTitle(name);
      const children = await walk(
        node.dirs.get(name)!,
        childPath,
        depth + 1,
        childLabel,
      );
      if (children.length > 0) {
        lines.push(`${indent}* ${childLabel}`, ...children);
        indexLinks.push(`* [${childLabel}](${toRoute(childPath)}/README.md)`);
      }
    }

    for (const name of [...node.files.keys()].sort(byName)) {
      const title = await pageTitle(node.files.get(name)!, toTitle(name));
      const link = `* [${title}](${toRoute(join(dirPath, name))})`;
      lines.push(`${indent}${link}`);
      indexLinks.push(link);
    }

    if (indexLinks.length > 0) {
      await writeOutput(
        join(dirPath, "README.md"),
        [`# ${label}`, "", ...indexLinks, ""].join(MARKDOWN_EOL),
        outputAdapter,
        dirPath,
      );
    }

    return lines;
  };

  const body = await walk(root, outputDir, 0, "GraphQL API");
  const sidebar = [
    "* [Home](/)",
    `* [GraphQL API](/${baseURL}/README.md)`,
    ...body,
    "",
  ].join(MARKDOWN_EOL);

  await writeOutput(join(rootDir, "_sidebar.md"), sidebar, outputAdapter);
};
