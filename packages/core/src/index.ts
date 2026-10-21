/**
 * @primaryExport
 */

export { generateDocFromSchema } from "./generator.js";
export { buildConfig } from "./config.js";

// Event system exports
export {
  getEvents,
  resetEvents,
  type CancellableEventEmitter,
  type EmitResult,
} from "./event-emitter.js";
export { registerMDXEventHandlers } from "./event-handlers.js";
export { EVENT_CALLBACK_MAP } from "./event-map.js";

// Event constant exports
export { SchemaEvents } from "./events/schema-events.js";
export { DiffEvents } from "./events/diff-events.js";
export { RenderRootTypesEvents } from "./events/render-root-types-events.js";
export { RenderHomepageEvents } from "./events/render-homepage-events.js";
export { RenderTypeEntitiesEvents } from "./events/render-type-entities-events.js";
export { GenerateIndexMetafileEvents } from "./events/generate-index-metafile-events.js";
export { PrintTypeEvents } from "./events/print-type-events.js";

// Event types exports
export type { SchemaEvent as SchemaLoadEvent } from "./events/schema-load.js";
export type { DiffCheckEvent } from "./events/diff-check.js";
export type { RenderRootTypesEvent } from "./events/render-root-types.js";
export type { RenderHomepageEvent } from "./events/render-homepage.js";
export type { RenderTypeEntitiesEvent } from "./events/render-type-entities.js";
export type { GenerateIndexMetafileEvent } from "./events/generate-index-metafile.js";
export type {
  ComposePageTypeEventData,
  IPrintCodeEvent,
  IPrintTypeEvent,
  PageSection,
  PageSections,
  PrintCodeEventData,
  PrintTypeEventData,
} from "@graphql-markdown/types";

export { CancellableEvent } from "@graphql-markdown/utils";
