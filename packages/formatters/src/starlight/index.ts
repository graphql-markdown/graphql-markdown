/**
 * Astro Starlight formatter for GraphQL documentation output.
 *
 * Produces MDX compatible with Astro Starlight using its native
 * Aside and Badge components. Includes lifecycle hooks for generating
 * index files for each category directory.
 *
 * @packageDocumentation
 */

import { join, dirname, resolve, basename } from "node:path";
import { appendFile } from "node:fs/promises";

import type {
  AdmonitionType,
  Badge,
  Formatter,
  Maybe,
  MDXString,
  MetaInfo,
  TypeLink,
} from "@graphql-markdown/types";
import { appendLinkExtension } from "@graphql-markdown/helpers";
import {
  ensureDir,
  fileExists,
  MARKDOWN_EOP,
  saveFile,
  startCase,
} from "@graphql-markdown/utils";
import {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "../defaults";

/** File extension used for generated pages. */
export const mdxExtension = ".mdx" as const;

/** MDX import statement prepended to every generated file to register Starlight components. */
export const mdxDeclaration: MDXString = `
import { Aside, Badge } from '@astrojs/starlight/components';
` as MDXString;

/**
 * Formats a badge using the Starlight `<Badge>` component.
 * Maps `DEPRECATED` classname to the `caution` variant; all others use `default`.
 * @param badge - Badge data containing text and optional classname
 * @returns Formatted Starlight Badge component string
 */
export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const variant = classname === "DEPRECATED" ? "caution" : "default";
  return `<Badge variant="${variant}" text="${text as string}"/>` as MDXString;
};

/**
 * Formats an admonition using the Starlight `<Aside>` component.
 * Maps `warning` type to `caution`; all other types use `note`.
 * @param admonition - Admonition data with text, title, and type
 * @param _meta - Unused metadata parameter
 * @returns Formatted Starlight Aside component string
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  _meta: Maybe<MetaInfo>,
): MDXString => {
  const asideType = type === "warning" ? "caution" : "note";
  return `${MARKDOWN_EOP}<Aside type="${asideType}" title="${title}">${text}</Aside>` as MDXString;
};

/**
 * Appends `.mdx` to internal link URLs.
 * @param link - Link data with URL and text
 * @returns Link with `.mdx` extension appended to the URL
 */
export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  return {
    text,
    url: appendLinkExtension(url, mdxExtension),
  };
};

export {
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
};

const INDEX_MD = "index.md" as const;

/**
 * Lifecycle hook that creates an `index.md` file for a category directory
 * before Starlight indexes it. Skips creation if the file already exists.
 * @param event - Hook payload containing the target directory and category name
 */
export const beforeGenerateIndexMetafileHook = async (event: {
  data: { dirPath: string; category: string };
}): Promise<void> => {
  const { dirPath, category } = event.data;
  const filePath = join(dirPath, INDEX_MD);

  if (await fileExists(filePath)) {
    return;
  }

  const label = startCase(category);
  await ensureDir(dirPath);
  await saveFile(filePath, `---\ntitle: ${label}\n---\n`);
};

/**
 * Lifecycle hook that appends a link entry to the category `index.md`
 * after each type entity page is rendered.
 * @param event - Hook payload containing the entity name and its output file path
 */
export const afterRenderTypeEntitiesHook = async (event: {
  data: { name: string; filePath: string };
}): Promise<void> => {
  const { name, filePath } = event.data;
  const indexFilePath = resolve(dirname(filePath), INDEX_MD);
  const pageFileName = basename(filePath);

  if (await fileExists(indexFilePath)) {
    await appendFile(indexFilePath, `- [${name}](./${pageFileName})\n`);
  }
};

/**
 * Creates an Astro Starlight formatter.
 * @param _meta - Unused metadata parameter
 * @returns A complete {@link Formatter} implementation for Starlight MDX output
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
