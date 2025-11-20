/**
 * Contains utilities for printing GraphQL interface types as Markdown documentation.
 * @module
 */

import type { PrintTypeOptions } from "@graphql-markdown/types";

import { printCodeType } from "./object";

/**
 * Prints metadata for a GraphQL interface type.
 * This is an alias for {@link printObjectMetadata}.
 */
export { printObjectMetadata as printInterfaceMetadata } from "./object";

/**
 * Generates a code block representation of a GraphQL interface type.
 *
 * @param type - The GraphQL interface type to print
 * @param options - Configuration options for printing the type
 * @returns A string containing the Markdown code block representation
 */
export const printCodeInterface = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  return printCodeType(type, "interface", options);
};
