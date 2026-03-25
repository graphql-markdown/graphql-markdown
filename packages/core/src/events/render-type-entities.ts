/**
 * Render type entities event class.
 *
 * @packageDocumentation
 */

import { CancellableEventOptions, DataEvent } from "./base";

/**
 * Event emitted before/after rendering type entities.
 *
 * @category Events
 */
export class RenderTypeEntitiesEvent extends DataEvent<{
  name: string;
  filePath: string;
}> {
  constructor(
    data: {
      name: string;
      filePath: string;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
