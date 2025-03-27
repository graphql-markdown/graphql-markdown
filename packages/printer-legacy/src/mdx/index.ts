import type {
  AdmonitionType,
  Badge,
  CollapsibleOption,
  FrontMatterOptions,
  Maybe,
  MDXString,
  MDXSupportType,
  MetaOptions,
  TypeLink,
} from "@graphql-markdown/types";

import {
  FRONT_MATTER_DELIMITER,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "../const/strings";

/**
 * Formats a badge into an MDX string.
 *
 * @param badge - The badge object containing text to display.
 * @returns An MDX string representing the badge.
 *
 * @example
 * ```typescript
 * const badge = { text: "Beta" };
 * formatMDXBadge(badge);
 * // '<mark class="gqlmd-mdx-badge">Beta</mark>'
 * ```
 * @see {@link mdxModule.formatMDXBadge} for the equivalent function in the MDX module.
 * @see {@link printer.formatBadge} for usage in the printer module.
 */
const formatMDXBadge = (badge: Badge): MDXString => {
  return `<mark class="gqlmd-mdx-badge">${badge.text as string}</mark>` as MDXString;
};

/**
 * Formats an admonition into an MDX string.
 *
 * @param admonition - The admonition object containing text, title, type, and optional icon.
 * @param _meta - Optional metadata for the admonition.
 * @returns An MDX string representing the admonition.
 *
 * @example
 * ```typescript
 * const admonition = { text: "Be careful!", title: "Warning", type: "warning", icon: "⚠️" };
 * formatMDXAdmonition(admonition, null);
 * // '<fieldset class="gqlmd-mdx-admonition-fieldset">...</fieldset>'
 * ```
 * @see {@link mdxModule.formatMDXAdmonition} for the equivalent function in the MDX module.
 * @see {@link printer.formatAdmonition} for usage in the printer module.
 */
const formatMDXAdmonition = (
  { text, title, type, icon }: AdmonitionType,
  _meta: Maybe<MetaOptions>,
): MDXString => {
  return `${MARKDOWN_EOP}<fieldset class="gqlmd-mdx-admonition-fieldset">${MARKDOWN_EOL}<legend class="gqlmd-mdx-admonition-legend"><span class="gqlmd-mdx-admonition-legend-type gqlmd-mdx-admonition-legend-type-${type.toLocaleLowerCase()}">${icon ?? type.toUpperCase()} ${title}</span></legend>${MARKDOWN_EOL}<span>${text}</span>${MARKDOWN_EOL}</fieldset>` as MDXString;
};

/**
 * Formats a bullet point into an MDX string.
 *
 * @param text - The text to display next to the bullet. Defaults to an empty string.
 * @returns An MDX string representing the bullet point.
 *
 * @example
 * ```typescript
 * formatMDXBullet("Item 1");
 * // '<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>Item 1'
 * ```
 * @see {@link mdxModule.formatMDXBullet} for the equivalent function in the MDX module.
 * @see {@link printer.formatBullet} for usage in the printer module.
 */
const formatMDXBullet = (text: string = ""): MDXString => {
  return `<span class="gqlmd-mdx-bullet">&nbsp;●&nbsp;</span>${text}` as MDXString;
};

/**
 * Formats a collapsible details section into an MDX string.
 *
 * @param options - The collapsible options containing the `dataOpen` text.
 * @returns An MDX string representing the collapsible details section.
 *
 * @example
 * ```typescript
 * const options = { dataOpen: "More Info" };
 * formatMDXDetails(options);
 * // '\n\n<details class="gqlmd-mdx-details">\n<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">MORE INFO</span></summary>\n</details>\n\n'
 * ```
 * @see {@link mdxModule.formatMDXDetails} for the equivalent function in the MDX module.
 * @see {@link printer.formatDetails} for usage in the printer module.
 */
const formatMDXDetails = ({ dataOpen }: CollapsibleOption): MDXString => {
  return `${MARKDOWN_EOP}<details class="gqlmd-mdx-details">${MARKDOWN_EOL}<summary class="gqlmd-mdx-details-summary"><span className="gqlmd-mdx-details-summary-open">${dataOpen.toUpperCase()}</span></summary>${MARKDOWN_EOL}</details>${MARKDOWN_EOP}` as MDXString;
};

/**
 * Formats a "Specified By" link into an MDX string.
 *
 * @param url - The URL of the specification.
 * @returns An MDX string representing the "Specified By" link.
 *
 * @example
 * ```typescript
 * formatMDXSpecifiedByLink("https://example.com");
 * // '<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="https://example.com" title="Specified by https://example.com">⎘</a></span>'
 * ```
 * @see {@link mdxModule.formatMDXSpecifiedByLink} for the equivalent function in the MDX module.
 * @see {@link printer.formatSpecifiedByLink} for usage in the printer module.
 */
const formatMDXSpecifiedByLink = (url: string): MDXString => {
  return `<span class="gqlmd-mdx-specifiedby">Specification<a class="gqlmd-mdx-specifiedby-link" target="_blank" href="${url}" title="Specified by ${url}">⎘</a></span>` as MDXString;
};

/**
 * Formats an entity name into an MDX string.
 *
 * @param name - The name of the entity.
 * @param parentType - Optional parent type of the entity.
 * @returns An MDX string representing the entity name.
 *
 * @example
 * ```typescript
 * formatMDXNameEntity("User", "Query");
 * // '<span class="gqlmd-mdx-entity"><code class="gqlmd-mdx-entity-parent">Query</code>.<code class="gqlmd-mdx-entity-name">User</code></span>'
 * ```
 * @see {@link mdxModule.formatMDXNameEntity} for the equivalent function in the MDX module.
 * @see {@link printer.formatNameEntity} for usage in the printer module.
 */
const formatMDXNameEntity = (
  name: string,
  parentType?: Maybe<string>,
): MDXString => {
  const parentName = parentType
    ? `<code class="gqlmd-mdx-entity-parent">${parentType}</code>.`
    : "";
  return `<span class="gqlmd-mdx-entity">${parentName}<code class="gqlmd-mdx-entity-name">${name}</code></span>` as MDXString;
};

/**
 * Formats a TypeLink object for MDX format.
 *
 * Currently, this function returns the link as is without modification.
 * This may serve as a placeholder for future formatting logic.
 *
 * @param link - The TypeLink object to format
 * @returns The formatted TypeLink object
 */
const formatMDXLink = (link: TypeLink): TypeLink => {
  return link;
};

/**
 * Formats a front matter section into an MDX string.
 *
 * @param _props - The front matter options.
 * @param formatted - The formatted front matter as an array of strings.
 * @returns An MDX string representing the front matter.
 *
 * @example
 * ```typescript
 * const formatted = ["title: My Title", "tags: [tag1, tag2]"];
 * formatMDXFrontmatter(null, formatted);
 * // '---\ntitle: My Title\ntags: [tag1, tag2]\n---'
 * ```
 * @see {@link mdxModule.formatMDXFrontmatter} for the equivalent function in the MDX module.
 * @see {@link printer.formatFrontmatter} for usage in the printer module.
 */
const formatMDXFrontmatter = (
  _props: Maybe<FrontMatterOptions>,
  formatted: Maybe<string[]>,
): MDXString => {
  return formatted
    ? ([FRONT_MATTER_DELIMITER, ...formatted, FRONT_MATTER_DELIMITER].join(
        MARKDOWN_EOL,
      ) as MDXString)
    : ("" as MDXString);
};

export const mdxDeclaration = "";

const defaultModule = {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxDeclaration,
} as MDXSupportType;

export const mdxModule = async (
  mdxPackage?: Record<string, unknown>,
): Promise<Readonly<MDXSupportType>> => {
  if (!mdxPackage) {
    return defaultModule;
  }

  const module = (mdxPackage.default ?? mdxPackage) as Record<string, unknown>;
  return {
    formatMDXAdmonition: module.formatMDXAdmonition ?? formatMDXAdmonition,
    formatMDXBadge: module.formatMDXBadge ?? formatMDXBadge,
    formatMDXBullet: module.formatMDXBullet ?? formatMDXBullet,
    formatMDXDetails: module.formatMDXDetails ?? formatMDXDetails,
    formatMDXFrontmatter: module.formatMDXFrontmatter ?? formatMDXFrontmatter,
    formatMDXLink: module.formatMDXLink ?? formatMDXLink,
    formatMDXNameEntity: module.formatMDXNameEntity ?? formatMDXNameEntity,
    formatMDXSpecifiedByLink:
      module.formatMDXSpecifiedByLink ?? formatMDXSpecifiedByLink,
    mdxDeclaration: module.mdxDeclaration ?? mdxDeclaration,
  } as MDXSupportType;
};

export default defaultModule;
