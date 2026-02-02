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

/**
 * Registers MDX module lifecycle event handlers with the event emitter.
 *
 * Automatically detects and registers any lifecycle hook functions defined in the mdxModule
 * that match the event callback naming convention. Logs registered handlers at debug level.
 *
 * Note: Format functions (formatMDXBadge, etc.) are NOT registered as events.
 * They are pure transformations handled via the Formatter interface directly.
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

  // Iterate through event callback mappings (lifecycle hooks only)
  for (const [eventName, callbackName] of Object.entries(EVENT_CALLBACK_MAP)) {
    // Check if mdxModule has this callback function
    if (
      callbackName in mdxModule &&
      typeof (mdxModule as Record<string, unknown>)[callbackName] === "function"
    ) {
      const mdxFunction = (
        mdxModule as Record<string, (...args: any[]) => any>
      )[callbackName];

      events.on(eventName, mdxFunction);
      registeredHandlers.add(callbackName);
    }
  }

  if (registeredHandlers.size > 0) {
    log(
      `Registered MDX lifecycle handlers: ${[...registeredHandlers].join(", ")}`,
      LogLevel.debug,
    );
  }
};
