/**
 * Schema loading event class.
 *
 * @packageDocumentation
 */

import type { GraphQLSchema, Maybe, SchemaMap } from "@graphql-markdown/types";
import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted before/after loading a GraphQL schema.
 *
 * @category Events
 */
export class SchemaEvent extends DataEvent<{
  schemaLocation?: string;
  schema?: Maybe<GraphQLSchema>;
  rootTypes?: Maybe<SchemaMap>;
}> {
  constructor(
    data: {
      schemaLocation?: string;
      schema?: Maybe<GraphQLSchema>;
      rootTypes?: Maybe<SchemaMap>;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
