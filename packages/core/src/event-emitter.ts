import { EventEmitter } from "node:events";
import type { CancellableEvent } from "./events/base";

/**
 * Result object returned when emitting a cancellable event.
 *
 * @category Events
 */
export interface EmitResult {
  /**
   * Array of errors that occurred during handler execution.
   * Handlers continue executing even if previous handlers throw errors.
   */
  errors: Error[];

  /**
   * Whether any handler called preventDefault() on the event.
   * Only applicable if the event is cancellable.
   */
  defaultPrevented: boolean;
}

/**
 * Custom EventEmitter that supports cancellable events with sequential handler execution.
 *
 * Features:
 * - Executes async handlers sequentially (one after another)
 * - Collects errors without stopping handler execution
 * - Supports stopPropagation to halt handler chain
 * - Returns execution results to emitters
 *
 * @category Events
 */
class CancellableEventEmitter extends EventEmitter {
  /**
   * Emit an event asynchronously with cancellable event support.
   *
   * Handlers are executed sequentially in registration order.
   * If a handler throws an error, it's collected but execution continues.
   * If event.propagationStopped becomes true, remaining handlers are skipped.
   *
   * After all handlers execute, if the event has a defaultAction function and
   * preventDefault() was not called, the default action is automatically executed.
   *
   * @param eventName - Name of the event to emit
   * @param event - Cancellable event object with preventDefault() and stopPropagation() methods
   * @returns Promise resolving to EmitResult with errors and cancellation status
   *
   * @example
   * ```typescript
   * const events = getEvents();
   * const event = new SchemaLoadEvent({
   *   schemaLocation: '/path/to/schema',
   *   defaultAction: async () => {
   *     // This runs automatically if not prevented
   *     await loadSchema('/path/to/schema');
   *   }
   * });
   *
   * const { errors, defaultPrevented } = await events.emitAsync('beforeLoadSchema', event);
   *
   * if (errors.length > 0) {
   *   console.error('Errors occurred:', errors);
   * }
   * ```
   */
  async emitAsync(
    eventName: string,
    event: CancellableEvent,
  ): Promise<EmitResult> {
    const errors: Error[] = [];

    // Get all registered listeners for this event
    const listeners = this.listeners(eventName);

    // Execute each handler sequentially
    for (const listener of listeners) {
      try {
        // Call the handler - await to support async handlers
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        await listener(event);

        // Check if handler stopped propagation to remaining handlers
        if (event.propagationStopped) {
          break; // Exit the loop, skipping remaining handlers
        }
      } catch (error) {
        // Collect error but continue executing remaining handlers
        errors.push(error instanceof Error ? error : new Error(String(error)));
      }
    }

    // Execute default action if not prevented and event has one
    try {
      // Call defaultAction - await to support async
      await event.runDefaultAction();
    } catch (error) {
      // Collect error from default action
      errors.push(error instanceof Error ? error : new Error(String(error)));
    }

    return { errors, defaultPrevented: event.defaultPrevented };
  }
}

/**
 * Singleton instance of the CancellableEventEmitter.
 * Shared across the entire application.
 */
let instance: CancellableEventEmitter | null = null;

/**
 * Get the singleton event emitter instance.
 *
 * Creates the instance on first call, then returns the same instance on subsequent calls.
 * This ensures all parts of the application share the same event bus.
 *
 * @returns The singleton CancellableEventEmitter instance
 *
 * @example
 * ```typescript
 * // In generator.ts
 * const events = getEvents();
 * events.on('beforeLoadSchema', handler);
 *
 * // In renderer.ts - same instance!
 * const events = getEvents();
 * await events.emitAsync('beforeLoadSchema', event);
 * ```
 *
 * @category Events
 */
export const getEvents = (): CancellableEventEmitter => {
  instance ??= new CancellableEventEmitter();
  return instance;
};

/**
 * Reset the event emitter singleton.
 *
 * Removes all event listeners and clears the instance.
 * The next call to getEvents() will create a fresh instance.
 *
 * **Important:** This should only be used in tests to ensure test isolation.
 *
 * @example
 * ```typescript
 * // In test setup
 * afterEach(() => {
 *   resetEvents();
 *   jest.restoreAllMocks();
 * });
 * ```
 *
 * @category Events
 */
export const resetEvents = (): void => {
  if (instance) {
    instance.removeAllListeners();
  }
  instance = null;
};
