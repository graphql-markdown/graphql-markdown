/**
 * Provides utility functions for handling GraphQL scalar types in markdown generation.
 * @module
 */
import type { PrintTypeOptions, MDXString } from "@graphql-markdown/types";

import { getTypeName } from "@graphql-markdown/graphql";

import { MARKDOWN_EOP } from "../const/strings";
import { SectionLevels } from "../const/options";

/**
 * Generates markdown documentation for a scalar type's specification URL.
 * @param type - The GraphQL scalar type object
 * @param options - Options for printing type information
 * @returns Markdown string containing the specification link, or empty string if no URL exists
 */
export const printSpecification = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("specifiedByURL" in type) ||
    typeof type.specifiedByURL !== "string"
  ) {
    return "";
  }

  const url = type.specifiedByURL;

  // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
  return `${SectionLevels.LEVEL.repeat(3)} ${options.formatMDXSpecifiedByLink!(url)}${MARKDOWN_EOP}` as MDXString;
};

/**
 * Prints metadata information for a scalar type.
 * Currently only includes the specification URL if available.
 * @param type - The GraphQL scalar type object
 * @param options - Options for printing type information
 * @returns Markdown string containing the scalar metadata
 */
export const printScalarMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  return printSpecification(type, options);
};

/**
 * Generates the GraphQL SDL representation of a scalar type.
 * @param type - The GraphQL scalar type object
 * @param options - Options for printing type information (unused)
 * @returns SDL string representation of the scalar type
 */
export const printCodeScalar = (
  type: unknown,
  options?: PrintTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): string => {
  return `scalar ${getTypeName(type)}`;
};
