/**
 * Generate index metafile event class.
 *
 * @packageDocumentation
 */

import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted before/after generating index metafile.
 *
 * @category Events
 */
export class GenerateIndexMetafileEvent extends DataEvent<{
  dirPath: string;
  category: string;
  options?: Record<string, unknown>;
}> {
  constructor(
    data: {
      dirPath: string;
      category: string;
      options?: Record<string, unknown>;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
