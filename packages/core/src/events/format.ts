/**
 * MDX formatting event classes.
 *
 * @packageDocumentation
 */

import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Generic format event with typed data and result.
 *
 * @category Events
 */
export class FormatEvent<U, V> extends CancellableEvent {
  /** The event data */
  readonly data: U;
  /** The formatted result. Set by event handlers. */
  result?: V;

  constructor(data: U, options: CancellableEventOptions) {
    super(options);
    this.data = data;
  }
}
