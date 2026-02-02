/**
 * Event callback mapping configuration.
 *
 * This module defines the mappings between event names and their corresponding
 * callback names in MDX modules. Kept separate to avoid circular dependencies.
 *
 * @packageDocumentation
 */
import { SchemaEvents } from "./events/schema-events";
import { DiffEvents } from "./events/diff-events";
import { RenderRootTypesEvents } from "./events/render-root-types-events";
import { RenderHomepageEvents } from "./events/render-homepage-events";
import { RenderTypeEntitiesEvents } from "./events/render-type-entities-events";
import { GenerateIndexMetafileEvents } from "./events/generate-index-metafile-events";

/**
 * Event callback mapping configuration.
 * Maps event names to their corresponding callback names in mdxModule.
 *
 * Note: Format functions (formatMDXBadge, formatMDXAdmonition, etc.) are NOT included here.
 * They are pure transformations handled via the Formatter interface, not events.
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
