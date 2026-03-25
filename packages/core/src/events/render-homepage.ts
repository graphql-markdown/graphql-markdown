/**
 * Render homepage event class.
 *
 * @packageDocumentation
 */

import { CancellableEventOptions, DataEvent } from "./base";

/**
 * Event emitted before/after rendering homepage.
 *
 * @category Events
 */
export class RenderHomepageEvent extends DataEvent<{
  outputDir: string;
}> {
  constructor(
    data: {
      outputDir: string;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
