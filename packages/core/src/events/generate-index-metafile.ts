/**
 * Generate index metafile event and constants.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event names for generating index metafile.
 */
export const GenerateIndexMetafileEvents = {
  /** Emitted before generating index metafile */
  BEFORE_GENERATE: "beforeGenerateIndexMetafile",
  /** Emitted after generating index metafile */
  AFTER_GENERATE: "afterGenerateIndexMetafile",
} as const;

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
