/**
 * Provides utilities for printing GraphQL enum types to Markdown/MDX format
 * @module
 */

import type { MDXString, PrintTypeOptions } from "@graphql-markdown/types";

import {
  isEnumType,
  getTypeName,
  isDeprecated,
} from "@graphql-markdown/graphql";

import { MARKDOWN_EOL, DEPRECATED } from "../const/strings";
import { printMetadataSection } from "../section";
import { hasPrintableDirective } from "../link";

/**
 * Prints the metadata section for a GraphQL enum type.
 *
 * @param type - The GraphQL enum type to process
 * @param options - Options for printing the type
 * @returns A string containing the metadata section in MDX format, or empty string if type is not an enum
 */
export const printEnumMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isEnumType(type)) {
    return "";
  }

  return printMetadataSection(type, type.getValues(), "Values", options);
};

/**
 * Generates a GraphQL SDL code block for an enum type.
 *
 * @param type - The GraphQL enum type to process
 * @param options - Optional printing options that control directive handling
 * @returns A string containing the enum type definition in GraphQL SDL, or empty string if type is not an enum
 */
export const printCodeEnum = (
  type: unknown,
  options?: PrintTypeOptions,
): string => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += type
    .getValues()
    .map((value): string => {
      if (!hasPrintableDirective(value, options)) {
        return "";
      }
      const v = getTypeName(value);
      const d = isDeprecated(value) ? ` @${DEPRECATED}` : "";
      return `  ${v}${d}`;
    })
    .filter((value): boolean => {
      return value.length > 0;
    })
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};
