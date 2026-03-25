/**
 * Diff checking event class.
 *
 * @packageDocumentation
 */

import { CancellableEventOptions, DataEvent } from "./base";

/**
 * Event emitted before/after checking schema differences.
 *
 * @category Events
 */
export class DiffCheckEvent extends DataEvent<{
  schema?: unknown;
  outputDir?: string;
  schemaHasChanges?: boolean;
}> {
  constructor(
    data: {
      schema?: unknown;
      outputDir?: string;
      schemaHasChanges?: boolean;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
