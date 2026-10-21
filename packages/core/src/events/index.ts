/**
 * Event system for GraphQL-Markdown.
 *
 * @packageDocumentation
 */

// Event constants
export { ConfigBuildEvents } from "./config-build-events.ts";
export { SchemaEvents } from "./schema-events.ts";
export { DiffEvents } from "./diff-events.ts";
export { RenderRootTypesEvents } from "./render-root-types-events.ts";
export { RenderHomepageEvents } from "./render-homepage-events.ts";
export { RenderFilesEvents } from "./render-files-events.ts";
export { RenderTypeEntitiesEvents } from "./render-type-entities-events.ts";
export { GenerateIndexMetafileEvents } from "./generate-index-metafile-events.ts";
// Re-export used only by unit tests via the events barrel.
export { PrintTypeEvents } from "./print-type-events.ts";

// Event classes
export { ConfigBuildEvent } from "./config-build.ts";
export { SchemaEvent } from "./schema-load.ts";
export { DiffCheckEvent } from "./diff-check.ts";
export { RenderRootTypesEvent } from "./render-root-types.ts";
export { RenderHomepageEvent } from "./render-homepage.ts";
export { RenderFilesEvent } from "./render-files.ts";
export { RenderTypeEntitiesEvent } from "./render-type-entities.ts";
export { GenerateIndexMetafileEvent } from "./generate-index-metafile.ts";
