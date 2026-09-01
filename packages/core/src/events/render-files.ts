/**
 * Render files event class.
 *
 * @packageDocumentation
 */

import type { OutputAdapter } from "@graphql-markdown/types";
import type { CancellableEventOptions } from "@graphql-markdown/utils";
import { DataEvent } from "@graphql-markdown/utils";

/**
 * Event emitted after all output files (entities + homepage) have been written.
 *
 * @category Events
 */
export class RenderFilesEvent extends DataEvent<{
  baseURL: string;
  outputDir: string;
  rootDir: string;
  pages: unknown;
  /** Destination the pages were written to; use it for any summary file. */
  outputAdapter?: OutputAdapter | null;
}> {
  constructor(
    data: {
      baseURL: string;
      outputDir: string;
      rootDir: string;
      pages: unknown;
      outputAdapter?: OutputAdapter | null;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
