/**
 * @primaryExport
 */
/* istanbul ignore file */

export { generateDocFromSchema } from "./generator";
export { buildConfig } from "./config";

// Event system exports
export { getEvents, resetEvents, type EmitResult } from "./event-emitter";
export {
  CancellableEvent,
  deepFreeze,
  SchemaEvents,
  DiffEvents,
  SchemaLoadEvent,
  DiffCheckEvent,
  RenderRootTypesEvent,
  RenderRootTypesEvents,
  RenderHomepageEvent,
  RenderHomepageEvents,
  RenderTypeEntitiesEvent,
  RenderTypeEntitiesEvents,
  GenerateIndexMetafileEvent,
  GenerateIndexMetafileEvents,
} from "./events";
