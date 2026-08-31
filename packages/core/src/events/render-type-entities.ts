/**
 * Render type entities event class.
 *
 * @packageDocumentation
 */

import type { OutputAdapter } from "@graphql-markdown/types";
import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted before/after rendering type entities.
 *
 * @category Events
 */
export class RenderTypeEntitiesEvent extends DataEvent<{
  baseURL: string;
  name: string;
  filePath: string;
  outputDir: string;
  /** Destination the page was written to; use it to read the page back. */
  outputAdapter?: OutputAdapter;
}> {
  constructor(
    data: {
      baseURL: string;
      name: string;
      filePath: string;
      outputDir: string;
      outputAdapter?: OutputAdapter;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
