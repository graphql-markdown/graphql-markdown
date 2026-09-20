/**
 * Config build event constants.
 *
 * @packageDocumentation
 */

/**
 * Event name fired once after the final configuration has been resolved.
 */
export const ConfigBuildEvents = {
  /** Emitted after the final Options object has been resolved, before generation starts */
  AFTER_BUILD: "config:afterBuild",
} as const;
