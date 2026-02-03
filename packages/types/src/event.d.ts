/**
 * Event system type declarations for GraphQL-Markdown.
 *
 * This module contains types for the cancellable event system, including
 * the base event interface and all hook callback types.
 *
 * @packageDocumentation
 */

/**
 * Type for default action function that can be executed by events.
 * Returns a Promise to support both sync and async actions.
 */
export type DefaultAction = () => Promise<void>;

/**
 * Base interface for cancellable events in GraphQL-Markdown.
 *
 * This interface defines the contract for events that can be cancelled
 * and can stop propagation to remaining handlers. Implementations should
 * extend this interface with event-specific data and output properties.
 *
 * @category Events
 */
export interface ICancellableEvent {
  /** Whether the default action has been prevented */
  readonly defaultPrevented: boolean;
  /** Whether propagation to remaining handlers has been stopped */
  readonly propagationStopped: boolean;
  /** The default action function if one was provided */
  readonly defaultAction: DefaultAction | undefined;
  /** Prevents the default action from executing */
  preventDefault: () => void;
  /** Stops propagation to remaining event handlers */
  stopPropagation: () => void;
  /** Executes the default action if not prevented */
  runDefaultAction: () => Promise<void>;
}

/**
 * Hook callback for schema loading events.
 */
export type SchemaLoadHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for diff check events.
 */
export type DiffCheckHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for render root types events.
 */
export type RenderRootTypesHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for render homepage events.
 */
export type RenderHomepageHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for render type entities events.
 */
export type RenderTypeEntitiesHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for generate index metafile events.
 */
export type GenerateIndexMetafileHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for print code events.
 * Receives an event with mutable `output` property for modifying generated code.
 */
export type PrintCodeHook = (event: unknown) => Promise<void> | void;

/**
 * Hook callback for print type events.
 * Receives an event with mutable `output` property for modifying generated documentation.
 */
export type PrintTypeHook = (event: unknown) => Promise<void> | void;
