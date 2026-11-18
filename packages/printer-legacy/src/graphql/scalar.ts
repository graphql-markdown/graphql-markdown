/**
 * Provides utility functions for handling GraphQL scalar types in markdown generation.
 * @module
 */
import type {
  PrintTypeOptions,
  PageSection,
  Maybe,
} from "@graphql-markdown/types";

import { getTypeName } from "@graphql-markdown/graphql";

const SPECIFIED_BY_PROTOCOLS = new Set(["http:", "https:"]);

/**
 * Generates markdown documentation for a scalar type's specification URL.
 * Only absolute http(s) URLs are printed; the URL is normalized (`URL#href`, which
 * percent-encodes characters such as `"`, `<`, `>` and spaces). Any other value
 * prints no specification section.
 * @param type - The GraphQL scalar type object
 * @param options - Options for printing type information
 * @returns A specification PageSection, or undefined when no valid http(s) URL exists
 */
// Exported for direct unit testing; reached in production through printScalarMetadata.
export const printSpecification = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("specifiedByURL" in type) ||
    typeof type.specifiedByURL !== "string"
  ) {
    return undefined;
  }

  let href: string;
  try {
    const parsed = new URL(type.specifiedByURL);
    if (!SPECIFIED_BY_PROTOCOLS.has(parsed.protocol)) {
      return undefined;
    }
    href = parsed.href;
  } catch {
    return undefined;
  }

  return {
    title: options.formatMDXSpecifiedByLink!(href),
    level: 3,
  };
};

/**
 * Prints metadata information for a scalar type.
 * Currently only includes the specification URL if available.
 * @param type - The GraphQL scalar type object
 * @param options - Options for printing type information
 * @returns A scalar metadata PageSection, or undefined when not available
 */
export const printScalarMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
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
