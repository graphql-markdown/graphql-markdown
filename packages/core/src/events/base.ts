/**
 * Base event class and utilities for GraphQL-Markdown events.
 *
 * @packageDocumentation
 */

import type { DefaultAction, ICancellableEvent } from "@graphql-markdown/types";

/**
 * Deep freezes an object to make it immutable at runtime.
 * Recursively freezes all nested objects and arrays.
 *
 * @param obj - The object to freeze
 * @returns The frozen object (same reference)
 *
 * @example
 * ```typescript
 * const data = { user: { name: 'John' } };
 * deepFreeze(data);
 * data.user.name = 'Jane'; // Throws error in strict mode
 * ```
 */
export const deepFreeze = <T extends Record<PropertyKey, any>>(obj: T): T => {
  // Get all property names including symbols
  const propNames = Reflect.ownKeys(obj);

  // Freeze properties before freezing self
  for (const name of propNames) {
    const value = obj[name];

    if ((value && typeof value === "object") || typeof value === "function") {
      deepFreeze(value);
    }
  }

  return Object.freeze(obj);
};

export interface CancellableEventOptions {
  defaultAction?: DefaultAction;
  cancellable?: boolean;
}

/**
 * Base class for all cancellable events in GraphQL-Markdown.
 *
 * Provides common functionality:
 * - preventDefault() to cancel default actions
 * - stopPropagation() to halt handler chain
 * - Configurable cancellability
 * - Optional default action function
 *
 * @category Events
 */
export abstract class CancellableEvent implements ICancellableEvent {
  /**
   * Whether the default action has been prevented.
   * Set to true when preventDefault() is called.
   */
  private _defaultPrevented = false;

  /**
   * Whether propagation to remaining handlers has been stopped.
   * Set to true when stopPropagation() is called.
   */
  private _propagationStopped = false;

  /**
   * Whether this event can be cancelled.
   * If false, preventDefault() has no effect.
   */
  private readonly _cancellable: boolean;

  /**
   * Optional function to execute as the default action.
   * Only runs if preventDefault() was not called.
   */
  private readonly _defaultAction?: DefaultAction;

  /**
   * Creates a new CancellableEvent.
   *
   * @param options - Configuration options for the event
   * @param options.cancellable - Whether this event can be cancelled (default: true)
   * @param options.defaultAction - Optional function to execute as default action
   */
  constructor(options?: CancellableEventOptions) {
    this._cancellable = options?.cancellable ?? true;
    this._defaultAction = options?.defaultAction;
  }

  /**
   * Gets whether the default action has been prevented.
   */
  get defaultPrevented(): boolean {
    return this._defaultPrevented;
  }

  /**
   * Gets whether propagation has been stopped.
   */
  get propagationStopped(): boolean {
    return this._propagationStopped;
  }

  /**
   * Gets the default action function if one was provided.
   */
  get defaultAction(): DefaultAction | undefined {
    return this._defaultAction;
  }

  /**
   * Prevents the default action from executing.
   * Only works if the event is cancellable.
   *
   * @example
   * ```typescript
   * events.on('beforeLoadSchema', (event) => {
   *   if (shouldUseCustomLoader) {
   *     event.preventDefault(); // Stops default schema loading
   *     // Custom logic here
   *   }
   * });
   * ```
   */
  preventDefault(): void {
    if (this._cancellable) {
      this._defaultPrevented = true;
    }
  }

  /**
   * Stops propagation to remaining event handlers.
   * Handlers registered after the current one will not execute.
   *
   * @example
   * ```typescript
   * events.on('beforeLoadSchema', (event) => {
   *   if (criticalError) {
   *     event.stopPropagation(); // No more handlers run
   *   }
   * });
   * ```
   */
  stopPropagation(): void {
    this._propagationStopped = true;
  }

  /**
   * Executes the default action for an event if it hasn't been prevented.
   *
   * @returns A promise that resolves when the default action completes, or void if the action was prevented or no default action is defined
   *
   * @remarks
   * This method will only execute the `_defaultAction` if:
   * - The event's default has not been prevented (`_defaultPrevented` is false)
   * - A default action function has been defined (`_defaultAction` is a function)
   */
  async runDefaultAction(): Promise<void> {
    if (!this._defaultPrevented && typeof this._defaultAction === "function") {
      return this._defaultAction();
    }
    return void 0;
  }
}
