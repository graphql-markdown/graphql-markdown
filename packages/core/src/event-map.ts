/**
 * Event callback mapping configuration.
 *
 * This module defines the mappings between event names and their corresponding
 * callback names in MDX modules. Kept separate to avoid circular dependencies.
 *
 * @packageDocumentation
 */

/**
 * Event callback mapping configuration.
 * Maps event names to their corresponding callback names in mdxModule.
 *
 * Note: Format functions (formatMDXBadge, formatMDXAdmonition, etc.) are NOT included here.
 * They are pure transformations handled via the Formatter interface, not events.
 */
export const EVENT_CALLBACK_MAP = {
  "config:afterBuild": "afterConfigBuildHook",
  "schema:beforeLoad": "beforeLoadSchemaHook",
  "schema:afterLoad": "afterLoadSchemaHook",
  "diff:beforeCheck": "beforeCheckDiffHook",
  "diff:afterCheck": "afterCheckDiffHook",
  "render:beforeRenderRootTypes": "beforeRenderRootTypesHook",
  "render:afterRenderRootTypes": "afterRenderRootTypesHook",
  "render:beforeRenderHomepage": "beforeRenderHomepageHook",
  "render:afterRenderHomepage": "afterRenderHomepageHook",
  "render:beforeRenderTypeEntities": "beforeRenderTypeEntitiesHook",
  "render:afterRenderTypeEntities": "afterRenderTypeEntitiesHook",
  "render:beforeGenerateIndexMetafile": "beforeGenerateIndexMetafileHook",
  "render:afterGenerateIndexMetafile": "afterGenerateIndexMetafileHook",
  "render:afterRenderFiles": "afterRenderFilesHook",
  "print:beforePrintCode": "beforePrintCodeHook",
  "print:afterPrintCode": "afterPrintCodeHook",
  "print:beforePrintType": "beforePrintTypeHook",
  "print:afterPrintType": "afterPrintTypeHook",
  "print:beforeComposePageType": "beforeComposePageTypeHook",
} as const;
