/**
 * Render homepage event class.
 *
 * @packageDocumentation
 */

import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

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
