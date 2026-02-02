/**
 * Generate index metafile event class.
 *
 * @packageDocumentation
 */

import { CancellableEvent, CancellableEventOptions } from "./base";

/**
 * Event emitted before/after generating index metafile.
 *
 * @category Events
 */
export class GenerateIndexMetafileEvent extends CancellableEvent {
  /** Event data containing directory path, category, and options */
  readonly data: {
    dirPath: string;
    category: string;
    options?: Record<string, unknown>;
  };

  constructor(
    data: {
      dirPath: string;
      category: string;
      options?: Record<string, unknown>;
    },
    options?: CancellableEventOptions,
  ) {
    super(options);
    this.data = data;
  }
}
