/**
 * Diff checking event class.
 *
 * @packageDocumentation
 */

import type { Maybe } from "@graphql-markdown/types";
import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Event emitted before/after checking schema differences.
 *
 * @category Events
 */
export class DiffCheckEvent extends CancellableEvent {
  /** Event data containing schema, output directory, and change status */
  readonly data: {
    schema?: unknown;
    outputDir?: string;
    schemaHasChanges?: boolean;
  };

  constructor(
    data: {
      schema?: unknown;
      outputDir?: string;
      schemaHasChanges?: boolean;
    },
    options?: CancellableEventOptions,
  ) {
    super(options);
    this.data = data;
  }
}
