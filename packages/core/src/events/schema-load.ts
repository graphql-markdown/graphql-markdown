/**
 * Schema loading event class.
 *
 * @packageDocumentation
 */

import type { GraphQLSchema, SchemaMap } from "@graphql-markdown/types";
import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted before/after loading a GraphQL schema.
 *
 * @category Events
 */
export class SchemaEvent extends DataEvent<{
  schemaLocation?: string;
  schema?: GraphQLSchema | null;
  rootTypes?: SchemaMap;
}> {
  constructor(
    data: {
      schemaLocation?: string;
      schema?: GraphQLSchema | null;
      rootTypes?: SchemaMap;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
