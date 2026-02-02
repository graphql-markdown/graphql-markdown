/**
 * Schema loading event constants.
 *
 * @packageDocumentation
 */

/**
 * Event names for schema loading lifecycle.
 */
export const SchemaEvents = {
  /** Emitted before loading GraphQL schema */
  BEFORE_LOAD: "schema:beforeLoad",
  /** Emitted after loading GraphQL schema */
  AFTER_LOAD: "schema:afterLoad",
  /** Emitted before mapping GraphQL schema */
  BEFORE_MAP: "schema:beforeMap",
  /** Emitted after mapping GraphQL schema */
  AFTER_MAP: "schema:afterMap",
} as const;
