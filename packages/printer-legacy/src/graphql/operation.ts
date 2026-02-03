/**
 * Module for handling GraphQL operation printing functionality.
 * Provides utilities to print operation types, metadata, and code representations.
 * @module
 */

import type { PrintTypeOptions, MDXString } from "@graphql-markdown/types";
import { getTypeName, isOperation } from "@graphql-markdown/graphql";
import { printSection, printMetadataSection } from "../section";

/**
 * Prints the operation type information.
 * @param type - The operation type to print
 * @param options - Print type options for customizing output
 * @returns Formatted string representation of the operation type or empty string if invalid
 */
export const printOperationType = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isOperation(type)) {
    return "";
  }

  const queryType = getTypeName(type.type).replaceAll(/[![\]]*/g, "");
  return printSection([options.schema!.getType(queryType)], "Type", {
    ...options,
    parentTypePrefix: false,
  });
};

/**
 * Prints the operation metadata including arguments and type information.
 * @param type - The operation type to print metadata for
 * @param options - Print type options for customizing output
 * @returns Formatted string containing operation metadata or empty string if invalid
 */
export const printOperationMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isOperation(type)) {
    return "";
  }

  const response = printOperationType(type, options);
  const metadata = printMetadataSection(type, type.args, "Arguments", options);

  return `${metadata}${response}` as MDXString;
};

/**
 * Prints the code representation of an operation.
 * @see printCodeField
 */
export { printCodeField as printCodeOperation } from "../code";
