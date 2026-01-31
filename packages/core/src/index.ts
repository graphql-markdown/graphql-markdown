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
