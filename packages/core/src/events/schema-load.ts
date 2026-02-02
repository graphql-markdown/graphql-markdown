/**
 * Schema loading event class.
 *
 * @packageDocumentation
 */

import type { GraphQLSchema, Maybe, SchemaMap } from "@graphql-markdown/types";
import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Event emitted before/after loading a GraphQL schema.
 *
 * @category Events
 */
export class SchemaEvent extends CancellableEvent {
  /** Event data containing schema location, schema, and root types */
  readonly data: {
    schemaLocation?: string;
    schema?: Maybe<GraphQLSchema>;
    rootTypes?: Maybe<SchemaMap>;
  };

  constructor(
    data: {
      schemaLocation?: string;
      schema?: Maybe<GraphQLSchema>;
      rootTypes?: Maybe<SchemaMap>;
    },
    options?: CancellableEventOptions,
  ) {
    super(options);
    this.data = data;
  }
}
