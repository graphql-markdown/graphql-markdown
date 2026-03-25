/**
 * Module for handling GraphQL Union type printing operations.
 * @module
 */

import type {
  PrintTypeOptions,
  GraphQLObjectType,
  PageSection,
  Maybe,
} from "@graphql-markdown/types";

import { isUnionType, getTypeName } from "@graphql-markdown/graphql";

import { printSection } from "../section";

/**
 * Generates metadata documentation for a GraphQL Union type.
 * @param type - The GraphQL type to process
 * @param options - Configuration options for printing
 * @returns A "Possible types" PageSection, or undefined when `type` is not a union
 */
export const printUnionMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
  if (!isUnionType(type)) {
    return undefined;
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
