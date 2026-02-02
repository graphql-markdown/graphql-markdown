/**
 * Formatter interface for GraphQL documentation output.
 *
 * Defines the contract for formatting various documentation elements.
 * Implementations can provide custom formatting for different output targets
 * (e.g., plain Markdown, MDX, HTML).
 *
 * @packageDocumentation
 */

import type { Maybe, MDXString } from "./utils";
import type { AdmonitionType, Badge, MetaOptions, TypeLink } from "./printer";
import type { CollapsibleOption, FrontMatterOptions } from "./core";

/**
 * Formatter interface defining all formatting methods for documentation output.
 *
 * Each method transforms input data into formatted output strings.
 * Implementations should be pure functions with no side effects.
 *
 * The method names use the `formatMDX*` convention for backward compatibility
 * with existing code that expects the MDXSupportType interface.
 *
 * @example
 * ```typescript
 * const customFormatter: Formatter = {
 *   formatMDXBadge: (badge) => `<Badge>${badge.text}</Badge>`,
 *   formatMDXAdmonition: (admonition, meta) => `<Admonition type="${admonition.type}">${admonition.text}</Admonition>`,
 *   // ... other methods
 * };
 * ```
 */
export interface Formatter {
  /**
   * Formats a badge element.
   *
   * @param badge - Badge data containing text and optional classname
   * @returns Formatted badge string
   */
  formatMDXBadge: (badge: Badge) => MDXString;

  /**
   * Formats an admonition/callout block.
   *
   * @param admonition - Admonition data with text, title, type, and optional icon
   * @param meta - Optional metadata for additional context
   * @returns Formatted admonition string
   */
  formatMDXAdmonition: (
    admonition: AdmonitionType,
    meta: Maybe<MetaOptions>,
  ) => MDXString;

  /**
   * Formats a bullet point separator.
   *
   * @param text - Optional text to append after the bullet
   * @returns Formatted bullet string
   */
  formatMDXBullet: (text?: string) => MDXString;

  /**
   * Formats a collapsible details/disclosure element.
   *
   * @param option - Configuration for open/close states
   * @returns Formatted details element string
   */
  formatMDXDetails: (option: CollapsibleOption) => MDXString;

  /**
   * Formats frontmatter for documentation pages.
   *
   * @param props - Frontmatter properties or false to disable
   * @param formatted - Pre-formatted frontmatter lines
   * @returns Formatted frontmatter block
   */
  formatMDXFrontmatter: (
    props: Maybe<FrontMatterOptions>,
    formatted: Maybe<string[]>,
  ) => MDXString;

  /**
   * Formats a type link.
   *
   * @param link - Link data with URL and text
   * @returns Formatted link (may be transformed or passed through)
   */
  formatMDXLink: (link: TypeLink) => TypeLink;

  /**
   * Formats a named entity reference.
   *
   * @param name - Entity name
   * @param parentType - Optional parent type name for qualified references
   * @returns Formatted entity reference string
   */
  formatMDXNameEntity: (name: string, parentType?: Maybe<string>) => MDXString;

  /**
   * Formats a "specified by" link for scalars.
   *
   * @param url - URL to the specification
   * @returns Formatted specification link string
   */
  formatMDXSpecifiedByLink: (url: string) => MDXString;
}
