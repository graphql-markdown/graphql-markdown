/**
 * Render root types event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

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
