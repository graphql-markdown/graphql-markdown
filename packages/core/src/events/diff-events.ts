/**
 * Diff checking event constants.
 *
 * @packageDocumentation
 */

/**
 * Event names for diff checking lifecycle.
 */
export const DiffEvents = {
  /** Emitted before checking schema differences */
  BEFORE_CHECK: "diff:beforeCheck",
  /** Emitted after checking schema differences */
  AFTER_CHECK: "diff:afterCheck",
} as const;
