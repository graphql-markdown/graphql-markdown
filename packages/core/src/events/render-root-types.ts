/**
 * Render root types event and constants.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event names for rendering root types.
 */
export const RenderRootTypesEvents = {
  /** Emitted before rendering root types */
  BEFORE_RENDER: "beforeRenderRootTypes",
  /** Emitted after rendering root types */
  AFTER_RENDER: "afterRenderRootTypes",
} as const;

/**
 * Event emitted before/after rendering root types.
 *
 * @category Events
 */
export class RenderRootTypesEvent extends CancellableEvent {
  /** Root types to render */
  readonly rootTypes: unknown;

  constructor(data: {
    rootTypes: unknown;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.rootTypes = data.rootTypes;
  }
}
