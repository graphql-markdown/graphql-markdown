/**
 * @module mdx
 * This module provides utilities for generating MDX content in Docusaurus format.
 * It includes functions for creating badges, admonitions, bullet points, collapsible sections,
 * specification links, and other MDX-specific formatting for GraphQL documentation.
 *
 * @primaryExport
 */

import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  Maybe,
  MDXString,
  MetaOptions,
  TypeLink,
} from "@graphql-markdown/types";
import { escapeMDX } from "@graphql-markdown/utils";

const MARKDOWN_EOL = "\n" as const;
const MARKDOWN_EOP = `${MARKDOWN_EOL.repeat(2)}` as const;
const LINK_MDX_EXTENSION = ".mdx" as const;
const DEFAULT_CSS_CLASSNAME = "badge--secondary" as const;

export { mdxDeclaration } from "./components";
export { generateIndexMetafile } from "./category";

export const formatMDXBadge = ({ text, classname }: Badge): MDXString => {
  const style =
    typeof classname === "string" ? `badge--${classname.toLowerCase()}` : "";
  return `<Badge class="badge ${DEFAULT_CSS_CLASSNAME} ${style}" text="${text as string}"/>` as MDXString;
};

/**
 * Formats an admonition block in MDX format
 * @param param - The admonition configuration object
 * @param meta - Optional metadata for generator configuration
 * @returns Formatted MDX string for the admonition
 */
export const formatMDXAdmonition = (
  { text, title, type }: AdmonitionType,
  meta: Maybe<MetaOptions>,
): MDXString => {
  const isDocusaurus = meta?.generatorFrameworkName === "docusaurus";
  if (isDocusaurus && meta.generatorFrameworkVersion?.startsWith("2")) {
    const oldType = type === "warning" ? "caution" : type;
    return `${MARKDOWN_EOP}:::${oldType} ${title}${text}:::` as MDXString;
  }
  return `${MARKDOWN_EOP}:::${type}[${title}]${text}:::` as MDXString;
};

/**
 * Creates a bullet point element in MDX format
 * @param text - Optional text to append after the bullet point
 * @returns Formatted MDX string for the bullet point
 */
export const formatMDXBullet = (text: string = ""): MDXString => {
  return `<Bullet />${text}` as MDXString;
};

/**
 * Creates a collapsible details section in MDX format
 * @param param - The collapsible section configuration
 * @returns Formatted MDX string for the collapsible section
 */
export const formatMDXDetails = ({
  dataOpen,
  dataClose,
}: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<Details dataOpen="Hide ${dataOpen}" dataClose="Show ${dataClose}">${MARKDOWN_EOP}\r${MARKDOWN_EOP}</Details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Creates a link to the specification documentation
 * @param url - The URL to the specification
 * @returns Formatted MDX string for the specification link
 */
export const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<SpecifiedBy url="${url}"/>` as MDXString;
};

/**
 * Formats a name entity with optional parent type
 * @param name - The name to format
 * @param parentType - Optional parent type to prefix the name
 * @returns Formatted MDX string for the name entity
 */
export const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType ? `${parentType}.` : "";
  return `<code style={{ fontWeight: 'normal' }}>${escapeMDX(parentName)}<b>${escapeMDX(name)}</b></code>` as MDXString;
};

export const formatMDXLink = ({ text, url }: TypeLink): TypeLink => {
  return {
    text,
    url: `${url}${LINK_MDX_EXTENSION}`,
  };
};
