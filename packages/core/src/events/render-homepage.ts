/**
 * Render homepage event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after rendering homepage.
 *
 * @category Events
 */
export class RenderHomepageEvent extends CancellableEvent {
  /** Output directory for homepage */
  readonly outputDir: string;

  constructor(data: {
    outputDir: string;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.outputDir = data.outputDir;
  }
}
