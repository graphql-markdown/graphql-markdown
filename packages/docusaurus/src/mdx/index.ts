/**
 * @module mdx
 * This module provides utilities for generating MDX content in Docusaurus format.
 * Formatter implementation lives in \@graphql-markdown/formatters/docusaurus.
 *
 * @primaryExport
 * @packageDocumentation
 */

export {
  createMDXFormatter,
  formatMDXAdmonition,
  formatMDXBadge,
  formatMDXBullet,
  formatMDXDetails,
  formatMDXFrontmatter,
  formatMDXLink,
  formatMDXNameEntity,
  formatMDXSpecifiedByLink,
  mdxDeclaration,
} from "@graphql-markdown/formatters/docusaurus";

export { beforeGenerateIndexMetafileHook } from "./category";
