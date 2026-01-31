/**
 * Generate index metafile event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after generating index metafile.
 *
 * @category Events
 */
export class GenerateIndexMetafileEvent extends CancellableEvent {
  /** Directory path for the index file */
  readonly dirPath: string;
  /** Category name */
  readonly category: string;
  /** Optional configuration options */
  readonly options?: Record<string, unknown>;

  constructor(data: {
    dirPath: string;
    category: string;
    options?: Record<string, unknown>;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.dirPath = data.dirPath;
    this.category = data.category;
    this.options = data.options;
  }
}
