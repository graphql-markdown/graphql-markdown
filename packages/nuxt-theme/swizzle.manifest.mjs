/**
 * @typedef {object} SwizzleEntry
 * @property {string} id
 * @property {string} description
 * @property {string} sourcePath
 * @property {string} targetPath
 */

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
  {
    id: "SiteHeader",
    sourcePath: "app/components/SiteHeader.vue",
    targetPath: "app/components/SiteHeader.vue",
    description: "Top navigation bar",
  },
  {
    id: "SiteFooter",
    sourcePath: "app/components/SiteFooter.vue",
    targetPath: "app/components/SiteFooter.vue",
    description: "Bottom attribution bar",
  },
  {
    id: "SchemaCodeCard",
    sourcePath: "app/components/SchemaCodeCard.vue",
    targetPath: "app/components/SchemaCodeCard.vue",
    description: "Highlighted code panel (schema definitions and examples)",
  },
  {
    id: "ApiOverviewGrid",
    sourcePath: "app/components/ApiOverviewGrid.vue",
    targetPath: "app/components/ApiOverviewGrid.vue",
    description: "Card grid for displaying API reference overview and namespace sections",
  },
  {
    id: "ApiNamespaceLanding",
    sourcePath: "app/components/ApiNamespaceLanding.vue",
    targetPath: "app/components/ApiNamespaceLanding.vue",
    description: "Header and grid for API reference landing pages and namespace chooser",
  },
  {
    id: "ApiDocumentContent",
    sourcePath: "app/components/ApiDocumentContent.vue",
    targetPath: "app/components/ApiDocumentContent.vue",
    description: "Document content with collapsible sections for API reference pages",
  },
  {
    id: "ApiCodeColumn",
    sourcePath: "app/components/ApiCodeColumn.vue",
    targetPath: "app/components/ApiCodeColumn.vue",
    description: "Code column sidebar with highlighted schema definitions and examples",
  },
  {
    id: "ApiSinglePageSection",
    sourcePath: "app/components/ApiSinglePageSection.vue",
    targetPath: "app/components/ApiSinglePageSection.vue",
    description: "Bucket heading + entries for the single-page reference view",
  },
  {
    id: "ApiSinglePageEntry",
    sourcePath: "app/components/ApiSinglePageEntry.vue",
    targetPath: "app/components/ApiSinglePageEntry.vue",
    description: "One query/mutation/type's content on the single-page reference view",
  },
  {
    id: "ReferenceLayout",
    sourcePath: "app/layouts/reference.vue",
    targetPath: "app/layouts/reference.vue",
    description: "Sidebar + header chrome around the reference page",
  },
  {
    id: "ReferencePage",
    sourcePath: "app/pages/api-reference/[...slug].vue",
    targetPath: "app/pages/api-reference/[...slug].vue",
    description: "The two-column reference page itself",
  },
];
