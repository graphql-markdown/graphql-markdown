/**
 * Render homepage event class.
 *
 * @packageDocumentation
 */

import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Event emitted before/after rendering homepage.
 *
 * @category Events
 */
export class RenderHomepageEvent extends CancellableEvent {
  /** Event data containing output directory */
  readonly data: {
    outputDir: string;
  };

  constructor(
    data: {
      outputDir: string;
    },
    options?: CancellableEventOptions,
  ) {
    super(options);
    this.data = data;
  }
}
