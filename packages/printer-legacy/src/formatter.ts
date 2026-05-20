/**
 * Formatter factories for GraphQL documentation output.
 *
 * Provides factory functions to create formatters for different output targets.
 * The default formatter produces HTML-like markup suitable for most Markdown processors.
 *
 * @packageDocumentation
 */

import type { Formatter } from "@graphql-markdown/types";

import {
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
} from "@graphql-markdown/formatters/defaults";

/**
 * Creates a default formatter for documentation output.
 *
 * The default formatter produces HTML-like markup with CSS classes
 * that can be styled with custom CSS. This is suitable for most
 * Markdown processors that support inline HTML.
 *
 * @returns A complete Formatter implementation
 *
 * @example
 * ```typescript
 * import { createDefaultFormatter } from '@graphql-markdown/printer-legacy';
 *
 * const formatter = createDefaultFormatter();
 * const badge = formatter.formatMDXBadge({ text: 'Required' });
 * ```
 */
export const createDefaultFormatter = (): Formatter => {
  return {
    formatMDXAdmonition,
    formatMDXBadge,
    formatMDXBullet,
    formatMDXDetails,
    formatMDXFrontmatter,
    formatMDXLink,
    formatMDXNameEntity,
    formatMDXSpecifiedByLink,
  };
};
