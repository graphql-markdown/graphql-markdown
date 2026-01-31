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
} as const;
