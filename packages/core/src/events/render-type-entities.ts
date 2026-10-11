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
  /** Root for documentation links, as used when printing them. */
  linkRoot?: string;
  name: string;
  filePath: string;
  outputDir: string;
  /** Destination the page was written to; use it to read the page back. */
  outputAdapter?: OutputAdapter;
  /** Root-level generated doc paths, known before concurrent pages are written. */
  knownDocPaths?: ReadonlySet<string>;
}> {
  constructor(
    data: {
      baseURL: string;
      linkRoot?: string;
      name: string;
      filePath: string;
      outputDir: string;
      outputAdapter?: OutputAdapter;
      knownDocPaths?: ReadonlySet<string>;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
