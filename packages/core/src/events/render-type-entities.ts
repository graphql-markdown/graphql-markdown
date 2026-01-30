/**
 * Render type entities event and constants.
 *
 * @packageDocumentation
 */

import type { DefaultAction } from "@graphql-markdown/types";
import { CancellableEvent } from "./base";

/**
 * Event names for rendering type entities.
 */
export const RenderTypeEntitiesEvents = {
  /** Emitted before rendering type entities */
  BEFORE_RENDER: "beforeRenderTypeEntities",
  /** Emitted after rendering type entities */
  AFTER_RENDER: "afterRenderTypeEntities",
} as const;

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
