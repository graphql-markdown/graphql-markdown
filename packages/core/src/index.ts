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

// Event constant exports
export { SchemaEvents } from "./events/schema-events";
export { DiffEvents } from "./events/diff-events";
export { RenderRootTypesEvents } from "./events/render-root-types-events";
export { RenderHomepageEvents } from "./events/render-homepage-events";
export { RenderTypeEntitiesEvents } from "./events/render-type-entities-events";
export { GenerateIndexMetafileEvents } from "./events/generate-index-metafile-events";
export { FormatEvents } from "./events/format-events";

// Event types exports
export type { CancellableEvent } from "./events/base";
export type { SchemaEvent as SchemaLoadEvent } from "./events/schema-load";
export type { DiffCheckEvent } from "./events/diff-check";
export type { RenderRootTypesEvent } from "./events/render-root-types";
export type { RenderHomepageEvent } from "./events/render-homepage";
export type { RenderTypeEntitiesEvent } from "./events/render-type-entities";
export type { GenerateIndexMetafileEvent } from "./events/generate-index-metafile";

// Event class exports (as values for instantiation)
export {
  FormatBadgeEvent,
  FormatAdmonitionEvent,
  FormatBulletEvent,
  FormatDetailsEvent,
  FormatFrontmatterEvent,
  FormatLinkEvent,
  FormatNameEntityEvent,
  FormatSpecifiedByLinkEvent,
} from "./events/format";
