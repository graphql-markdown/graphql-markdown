/**
 * @primaryExport
 */
/* istanbul ignore file */

export { generateDocFromSchema } from "./generator";
export { buildConfig } from "./config";

// Event system exports
export { getEvents, resetEvents, type EmitResult } from "./event-emitter";
export { registerMDXEventHandlers } from "./event-handlers";
export { EVENT_CALLBACK_MAP } from "./event-map";

// Event types exports
export type { CancellableEvent } from "./events/base";
export type { SchemaEvent as SchemaLoadEvent } from "./events/schema-load";
export type { DiffCheckEvent } from "./events/diff-check";
export type { RenderRootTypesEvent } from "./events/render-root-types";
export type { RenderHomepageEvent } from "./events/render-homepage";
export type { RenderTypeEntitiesEvent } from "./events/render-type-entities";
export type { GenerateIndexMetafileEvent } from "./events/generate-index-metafile";
