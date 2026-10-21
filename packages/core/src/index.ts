/**
 * @primaryExport
 */

export { generateDocFromSchema } from "./generator.ts";
export { buildConfig } from "./config.ts";

// Event system exports
export {
  getEvents,
  resetEvents,
  type CancellableEventEmitter,
  type EmitResult,
} from "./event-emitter.ts";
export { registerMDXEventHandlers } from "./event-handlers.ts";
export { EVENT_CALLBACK_MAP } from "./event-map.ts";

// Event constant exports
export { SchemaEvents } from "./events/schema-events.ts";
export { DiffEvents } from "./events/diff-events.ts";
export { RenderRootTypesEvents } from "./events/render-root-types-events.ts";
export { RenderHomepageEvents } from "./events/render-homepage-events.ts";
export { RenderTypeEntitiesEvents } from "./events/render-type-entities-events.ts";
export { GenerateIndexMetafileEvents } from "./events/generate-index-metafile-events.ts";
export { PrintTypeEvents } from "./events/print-type-events.ts";

// Event types exports
export type { SchemaEvent as SchemaLoadEvent } from "./events/schema-load.ts";
export type { DiffCheckEvent } from "./events/diff-check.ts";
export type { RenderRootTypesEvent } from "./events/render-root-types.ts";
export type { RenderHomepageEvent } from "./events/render-homepage.ts";
export type { RenderTypeEntitiesEvent } from "./events/render-type-entities.ts";
export type { GenerateIndexMetafileEvent } from "./events/generate-index-metafile.ts";
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
