/**
 * MDX event handler registration functionality.
 *
 * This module provides utilities for registering MDX module event handlers
 * with the event emitter system. It maps event names to callback names and
 * automatically detects and registers matching callbacks from MDX modules.
 *
 * @packageDocumentation
 */
import { log, LogLevel } from "@graphql-markdown/logger";

import { getEvents, resetEvents } from "./event-emitter";
import { EVENT_CALLBACK_MAP } from "./event-map";
import { FormatEvents } from "./events/format-events";

/**
 * Set of format event names that require special handling.
 * Format events wrap the formatter function to extract event.data and set event.result.
 */
const FORMAT_EVENT_NAMES = new Set<string>(Object.values(FormatEvents));

/**
 * Registers MDX module event handlers with the event emitter.
 *
 * Automatically detects and registers any event callback functions defined in the mdxModule
 * that match the event callback naming convention. Logs registered handlers at debug level.
 *
 * @param mdxModule - The MDX module that may contain event callback functions
 *
 * @example
 * ```typescript
 * const mdxModule = {
 *   beforeLoadSchemaHook: async (event) => { console.log('Loading schema...'); },
 *   afterRenderTypeEntitiesHook: async (event) => { console.log('Rendered:', event.data.name); }
 * };
 * registerMDXEventHandlers(mdxModule);
 * ```
 */
export const registerMDXEventHandlers = (mdxModule: unknown): void => {
  if (!mdxModule || typeof mdxModule !== "object") {
    return;
  }

  resetEvents(); // reset event to avoid duplicate registrations

  const events = getEvents();
  const registeredHandlers = new Set<string>();

  // Iterate through event callback mappings
  for (const [eventName, callbackName] of Object.entries(EVENT_CALLBACK_MAP)) {
    // Check if mdxModule has this callback function
    if (
      callbackName in mdxModule &&
      typeof (mdxModule as Record<string, unknown>)[callbackName] === "function"
    ) {
      const mdxFunction = (
        mdxModule as Record<string, (...args: any[]) => any>
      )[callbackName];

      // For format events, wrap the formatter to handle event.data
      if (FORMAT_EVENT_NAMES.has(eventName)) {
        events.on(eventName, (event: any) => {
          try {
            event.result = mdxFunction(event.data);
          } catch (error) {
            log(
              `Error in format function ${callbackName}: ${error instanceof Error ? error.message : String(error)}`,
              LogLevel.error,
            );
            throw error;
          }
        });
      } else {
        // For regular hooks, pass the event directly
        events.on(eventName, mdxFunction);
      }
      registeredHandlers.add(callbackName);
    }
  }

  if (registeredHandlers.size > 0) {
    log(
      `Registered MDX event handlers: ${[...registeredHandlers].join(", ")}`,
      LogLevel.debug,
    );
  }
};
