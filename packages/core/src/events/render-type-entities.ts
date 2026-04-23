/**
 * Render type entities event class.
 *
 * @packageDocumentation
 */

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
}> {
  constructor(
    data: {
      baseURL: string;
      name: string;
      filePath: string;
      outputDir: string;
    },
    options?: CancellableEventOptions,
  ) {
    super(data, options);
  }
}
