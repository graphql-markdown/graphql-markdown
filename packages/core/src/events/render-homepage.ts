/**
 * Render homepage event and constants.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event names for rendering homepage.
 */
export const RenderHomepageEvents = {
  /** Emitted before rendering homepage */
  BEFORE_RENDER: "beforeRenderHomepage",
  /** Emitted after rendering homepage */
  AFTER_RENDER: "afterRenderHomepage",
} as const;

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
