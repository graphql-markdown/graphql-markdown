/**
 * @typedef {object} SwizzleEntry
 * @property {string} id
 * @property {string} description
 * @property {string} sourcePath
 * @property {string} targetPath
 */

/**
 * Builds a manifest entry. Swizzled files land at the same relative path in
 * the consumer's project, so `targetPath` mirrors `sourcePath`.
 *
 * @param {string} id
 * @param {string} path
 * @param {string} description
 * @returns {SwizzleEntry}
 */
const entry = (id, path, description) => {
  return { id, sourcePath: path, targetPath: path, description };
};

/**
 * Builds an entry for a component living at `app/components/<id>.vue`.
 *
 * @param {string} id
 * @param {string} description
 * @returns {SwizzleEntry}
 */
const component = (id, description) => {
  return entry(id, `app/components/${id}.vue`, description);
};

/**
 * Single source of truth for the swizzle manifest — loaded directly by
 * `bin/swizzle.mjs` (plain JS, no TypeScript loader required at runtime so
 * the CLI works on any Node >=22.12 without relying on experimental type
 * stripping) and re-exported with types by `swizzle.manifest.ts` for
 * everything else in this package. Do not duplicate this array anywhere —
 * edit it here only.
 *
 * @type {SwizzleEntry[]}
 */
export const swizzleManifest = [
  component("SiteHeader", "Top navigation bar"),
  component("SiteFooter", "Bottom attribution bar"),
  component(
    "SchemaCodeCard",
    "Highlighted code panel (schema definitions and examples)",
  ),
  component(
    "ApiOverviewGrid",
    "Card grid for displaying API reference overview and namespace sections",
  ),
  component(
    "ApiNamespaceLanding",
    "Header and grid for API reference landing pages and namespace chooser",
  ),
  component(
    "ApiDocumentContent",
    "Document content with collapsible sections for API reference pages",
  ),
  component(
    "ApiCodeColumn",
    "Code column sidebar with highlighted schema definitions and examples",
  ),
  component(
    "ApiSinglePageSection",
    "Bucket heading + entries for the single-page reference view",
  ),
  component(
    "ApiSinglePageEntry",
    "One query/mutation/type's content on the single-page reference view",
  ),
  entry(
    "ReferenceLayout",
    "app/layouts/reference.vue",
    "Sidebar + header chrome around the reference page",
  ),
  entry(
    "ReferencePage",
    "app/pages/api-reference/[...slug].vue",
    "The two-column reference page itself",
  ),
];
