/**
 * Diff checking event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after checking schema differences.
 *
 * @category Events
 */
export class DiffCheckEvent extends CancellableEvent {
  /** Current schema being checked */
  readonly schema: unknown;
  /** Path to output directory for diff results */
  readonly outputDir: string;

  constructor(data: {
    schema: unknown;
    outputDir: string;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.schema = data.schema;
    this.outputDir = data.outputDir;
  }
}
