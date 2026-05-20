/**
 * Event system for GraphQL-Markdown.
 *
 * @packageDocumentation
 */

// Event constants
export { SchemaEvents } from "./schema-events";
export { DiffEvents } from "./diff-events";
export { RenderRootTypesEvents } from "./render-root-types-events";
export { RenderHomepageEvents } from "./render-homepage-events";
export { RenderFilesEvents } from "./render-files-events";
export { RenderTypeEntitiesEvents } from "./render-type-entities-events";
export { GenerateIndexMetafileEvents } from "./generate-index-metafile-events";
// Needed by tests/unit/events.test.ts; core/index.ts re-exports this directly
// from source, making the barrel entry appear unused in production mode.
// fallow-ignore-next-line unused-export
export { PrintTypeEvents } from "./print-type-events";

// Event classes
export { SchemaEvent } from "./schema-load";
export { DiffCheckEvent } from "./diff-check";
export { RenderRootTypesEvent } from "./render-root-types";
export { RenderHomepageEvent } from "./render-homepage";
export { RenderFilesEvent } from "./render-files";
export { RenderTypeEntitiesEvent } from "./render-type-entities";
export { GenerateIndexMetafileEvent } from "./generate-index-metafile";
