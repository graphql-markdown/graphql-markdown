/**
 * Render type entities event class.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event emitted before/after rendering type entities.
 *
 * @category Events
 */
export class RenderTypeEntitiesEvent extends CancellableEvent {
  /** Name of the type entity */
  readonly name: string;
  /** File path where entity will be rendered */
  readonly filePath: string;

  constructor(data: {
    name: string;
    filePath: string;
    defaultAction?: DefaultAction;
    cancellable?: boolean;
  }) {
    super(data.cancellable, data.defaultAction);
    this.name = data.name;
    this.filePath = data.filePath;
  }
}
