/**
 * Legacy printer helpers for rendering GraphQL input types.
 *
 * @packageDocumentation
 */
import type { PrintTypeOptions } from "@graphql-markdown/types";

import { printCodeType } from "./object";

export { printObjectMetadata as printInputMetadata } from "./object";

/**
 * Renders the Markdown code snippet for a GraphQL `input` type by delegating
 * to the generic object printer while forcing the `input` kind.
 *
 * @param type - The GraphQL input definition or SDL node to print.
 * @param options - Printer options controlling headings, examples, and badges.
 * @returns Markdown code block representing the input signature.
 */
export const printCodeInput = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  return printCodeType(type, "input", options);
};
