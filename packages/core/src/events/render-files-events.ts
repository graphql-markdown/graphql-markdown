/**
 * Render files event constants.
 *
 * @packageDocumentation
 */

/**
 * Event names fired once after all output files (entities + homepage) are written.
 */
export const RenderFilesEvents = {
  /** Emitted after all files have been written */
  AFTER_RENDER: "render:afterRenderFiles",
} as const;
