/**
 * Generate index metafile event constants.
 *
 * @packageDocumentation
 */

/**
 * Event names for generating index metafile.
 */
export const GenerateIndexMetafileEvents = {
  /** Emitted before generating index metafile */
  BEFORE_GENERATE: "render:beforeGenerateIndexMetafile",
  /** Emitted after generating index metafile */
  AFTER_GENERATE: "render:afterGenerateIndexMetafile",
} as const;
