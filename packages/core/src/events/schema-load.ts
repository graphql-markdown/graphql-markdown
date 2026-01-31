/**
 * Schema loading event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after loading a GraphQL schema.
 *
 * @category Events
 */
export class SchemaLoadEvent extends CancellableEvent {
  /** Path or pointer to the schema location */
  readonly schemaLocation: string;

  constructor(data: {
    schemaLocation: string;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.schemaLocation = data.schemaLocation;
  }
}
