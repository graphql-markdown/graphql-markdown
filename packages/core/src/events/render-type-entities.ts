/**
 * Render type entities event class.
 *
 * @packageDocumentation
 */

import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Event emitted before/after rendering type entities.
 *
 * @category Events
 */
export class RenderTypeEntitiesEvent extends CancellableEvent {
  /** Event data containing name and file path */
  readonly data: {
    name: string;
    filePath: string;
  };

  constructor(
    data: {
      name: string;
      filePath: string;
    },
    options?: CancellableEventOptions,
  ) {
    super(options);
    this.data = data;
  }
}
