/**
 * Render files event class.
 *
 * @packageDocumentation
 */

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
}> {
  constructor(
    data: {
      baseURL: string;
      outputDir: string;
      rootDir: string;
      pages: unknown;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
