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

import { getEvents } from "./event-emitter";
import {
  SchemaEvents,
  DiffEvents,
  RenderRootTypesEvents,
  RenderHomepageEvents,
  RenderTypeEntitiesEvents,
  GenerateIndexMetafileEvents,
} from "./events";

/**
 * Event callback mapping configuration.
 * Maps event names to their corresponding callback names in mdxModule.
 */
export const EVENT_CALLBACK_MAP = {
  [SchemaEvents.BEFORE_LOAD]: "beforeLoadSchemaHook",
  [SchemaEvents.AFTER_LOAD]: "afterLoadSchemaHook",
  [DiffEvents.BEFORE_CHECK]: "beforeCheckDiffHook",
  [DiffEvents.AFTER_CHECK]: "afterCheckDiffHook",
  [RenderRootTypesEvents.BEFORE_RENDER]: "beforeRenderRootTypesHook",
  [RenderRootTypesEvents.AFTER_RENDER]: "afterRenderRootTypesHook",
  [RenderHomepageEvents.BEFORE_RENDER]: "beforeRenderHomepageHook",
  [RenderHomepageEvents.AFTER_RENDER]: "afterRenderHomepageHook",
  [RenderTypeEntitiesEvents.BEFORE_RENDER]: "beforeRenderTypeEntitiesHook",
  [RenderTypeEntitiesEvents.AFTER_RENDER]: "afterRenderTypeEntitiesHook",
  [GenerateIndexMetafileEvents.BEFORE_GENERATE]:
    "beforeGenerateIndexMetafileHook",
  [GenerateIndexMetafileEvents.AFTER_GENERATE]:
    "afterGenerateIndexMetafileHook",
} as const;

export const LEGACY_EVENT_CALLBACK_MAP = {
  [GenerateIndexMetafileEvents.BEFORE_GENERATE]: "generateIndexMetafile",
} as const;

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
 *   afterRenderTypeEntitiesHook: async (event) => { console.log('Rendered:', event.name); }
 * };
 * registerMDXEventHandlers(mdxModule);
 * ```
 */
export const registerMDXEventHandlers = (mdxModule: unknown): void => {
  if (!mdxModule || typeof mdxModule !== "object") {
    return;
  }

  const events = getEvents();
  const registeredHandlers = new Set<string>();

  const combinedEventMap = {
    ...EVENT_CALLBACK_MAP,
    ...LEGACY_EVENT_CALLBACK_MAP,
  };

  // Iterate through event callback mappings
  for (const [eventName, callbackName] of Object.entries(combinedEventMap)) {
    // Check if mdxModule has this callback function
    if (
      callbackName in mdxModule &&
      typeof (mdxModule as Record<string, unknown>)[callbackName] === "function"
    ) {
      const handler = (mdxModule as Record<string, (...args: any[]) => void>)[
        callbackName
      ];
      events.on(eventName, handler);
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
