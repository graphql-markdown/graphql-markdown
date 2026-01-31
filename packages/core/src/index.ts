/**
 * @primaryExport
 */
/* istanbul ignore file */

export { generateDocFromSchema } from "./generator";
export { buildConfig } from "./config";

// Event system exports
export { getEvents, resetEvents, type EmitResult } from "./event-emitter";
export { EVENT_CALLBACK_MAP, registerMDXEventHandlers } from "./event-handlers";
