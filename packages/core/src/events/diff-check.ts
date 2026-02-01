/**
 * Diff checking event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction, Maybe } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after checking schema differences.
 *
 * @category Events
 */
export class DiffCheckEvent extends CancellableEvent {
  /** Current schema being checked */
  readonly schema: Maybe<unknown>;
  /** Path to output directory for diff results */
  readonly outputDir: Maybe<string>;
  /**
   * Indicates whether changes have been detected in the diff check.
   * Returns `true` if changes exist, `false` if no changes, or `null`/`undefined` if the check hasn't been performed or is unavailable.
   */
  readonly hasChanges: Maybe<boolean>;

  constructor(data: {
    schema?: unknown;
    outputDir?: string;
    schemaHasChanges?: boolean;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.schema = data.schema;
    this.outputDir = data.outputDir;
    this.hasChanges = data.schemaHasChanges;
  }
}
