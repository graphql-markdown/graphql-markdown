/**
 * Print type event constants.
 *
 * Events emitted during the printing phase of type documentation generation.
 * These events allow interception and modification of the generated code output.
 *
 * @packageDocumentation
 */

/**
 * Event names for printing type documentation.
 *
 * @example
 * ```typescript
 * import { getEvents, PrintTypeEvents, PrintTypeEvent } from "@graphql-markdown/core";
 *
 * const events = getEvents();
 * events.on(PrintTypeEvents.AFTER_PRINT_CODE, (event: PrintTypeEvent) => {
 *   // Modify the generated code
 *   event.output = event.output.toUpperCase();
 * });
 * ```
 */
export const PrintTypeEvents = {
  /** Emitted before generating the code block for a type */
  BEFORE_PRINT_CODE: "print:beforePrintCode",
  /** Emitted after generating the code block for a type (output can be modified) */
  AFTER_PRINT_CODE: "print:afterPrintCode",
  /** Emitted before generating the full type documentation */
  BEFORE_PRINT_TYPE: "print:beforePrintType",
  /** Emitted after generating the full type documentation (output can be modified) */
  AFTER_PRINT_TYPE: "print:afterPrintType",
} as const;
