/**
 * Render root types event class.
 *
 * @packageDocumentation
 */

import { CancellableEventOptions, DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted before/after rendering root types.
 *
 * @category Events
 */
export class RenderRootTypesEvent extends DataEvent<{
  rootTypes: unknown;
}> {
  constructor(
    data: {
      rootTypes: unknown;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
