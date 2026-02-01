/**
 * Schema loading event class.
 *
 * @packageDocumentation
 */

import type {
  DefaultAction,
  GraphQLSchema,
  Maybe,
  SchemaMap,
} from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after loading a GraphQL schema.
 *
 * @category Events
 */
export class SchemaEvent extends CancellableEvent {
  /** Path or pointer to the schema location */
  readonly schemaLocation?: string;
  /**
   * The GraphQL schema object.
   *
   * @remarks
   * This property holds the loaded GraphQL schema instance. It may be undefined if the schema
   * has not been loaded yet or if schema loading failed.
   */
  readonly schema: Maybe<GraphQLSchema>;

  constructor(data: {
    schemaLocation?: string;
    schema?: Maybe<GraphQLSchema>;
    rootTypes?: Maybe<SchemaMap>;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.schemaLocation = data.schemaLocation;
    this.schema = data.schema;
  }
}
