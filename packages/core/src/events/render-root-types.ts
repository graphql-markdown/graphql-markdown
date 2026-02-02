/**
 * Render root types event class.
 *
 * @packageDocumentation
 */

import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Event emitted before/after rendering root types.
 *
 * @category Events
 */
export class RenderRootTypesEvent extends CancellableEvent {
  /** Event data containing root types */
  readonly data: {
    rootTypes: unknown;
  };

  constructor(
    data: {
      rootTypes: unknown;
    },
    options?: CancellableEventOptions,
  ) {
    super(options);
    this.data = data;
  }
}
