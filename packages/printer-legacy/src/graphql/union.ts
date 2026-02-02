/**
 * Module for handling GraphQL Union type printing operations.
 * @module
 */

import type {
  PrintTypeOptions,
  MDXString,
  GraphQLObjectType,
} from "@graphql-markdown/types";

import { isUnionType, getTypeName } from "@graphql-markdown/graphql";

import { printSection } from "../section";

/**
 * Generates metadata documentation for a GraphQL Union type.
 * @param type - The GraphQL type to process
 * @param options - Configuration options for printing
 * @returns Formatted MDX string containing the union type's possible types
 */
export const printUnionMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isUnionType(type)) {
    return "";
  }

  return printSection(type.getTypes(), "Possible types", {
    ...options,
    parentType: type.name,
  });
};

/**
 * Generates GraphQL SDL code representation of a Union type.
 * @param type - The GraphQL type to process
 * @param options - Configuration options for printing (unused)
 * @returns SDL string representation of the union type
 */
export const printCodeUnion = (
  type: unknown,
  options?: PrintTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): string => {
  if (!isUnionType(type)) {
    return "";
  }

  let code = `union ${getTypeName(type)} = `;
  code += type
    .getTypes()
    .map((v: GraphQLObjectType<unknown, unknown>): string => {
      return getTypeName(v);
    })
    .join(" | ");

  return code;
};
