/**
 * Module for handling GraphQL directive printing and formatting.
 * Provides utilities to generate string representations of GraphQL directives
 * including their metadata, arguments, and locations.
 *
 * @module
 */

import type {
  PrintDirectiveOptions,
  GraphQLDirective,
  MDXString,
} from "@graphql-markdown/types";

import { getTypeName } from "@graphql-markdown/graphql";

import { printMetadataSection } from "../section";
import { printCodeArguments } from "../code";

/**
 * Generates a string representation of directive locations.
 *
 * @param type - The GraphQL directive to process
 * @returns A formatted string of directive locations or empty string if no locations defined
 */
const printCodeDirectiveLocation = (type: GraphQLDirective): string => {
  if (typeof type.locations === "undefined" || type.locations.length === 0) {
    return "";
  }

  let code = ` on `;
  const separator = `\r\n  | `;
  if (type.locations.length > 1) {
    code += separator;
  }
  code += type.locations.join(separator).trim();

  return code;
};

/**
 * Prints metadata information for a GraphQL directive, focusing on its arguments.
 *
 * @param type - The GraphQL directive to process
 * @param options - Configuration options for printing directive metadata
 * @returns Formatted metadata string in MDX format or empty string if no arguments
 */
export const printDirectiveMetadata = (
  type: GraphQLDirective,
  options: PrintDirectiveOptions,
): MDXString | string => {
  if (!("args" in type)) {
    return "";
  }

  return printMetadataSection(type, type.args, "Arguments", options);
};

/**
 * Generates a string representation of a complete GraphQL directive definition.
 *
 * @param type - The GraphQL directive to process
 * @param options - Configuration options for printing the directive (optional)
 * @returns A formatted string containing the complete directive definition
 */
export const printCodeDirective = (
  type: GraphQLDirective,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: PrintDirectiveOptions,
): string => {
  let code = `directive @${getTypeName(type)}`;
  code += printCodeArguments(type);
  code += printCodeDirectiveLocation(type);

  return code;
};
