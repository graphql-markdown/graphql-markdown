/**
 * Provides utility functions for generating code representations of GraphQL types
 * in Markdown format. This module handles the formatting of arguments and fields
 * with proper indentation and deprecation notices.
 * @module
 *
 */

import type { MDXString, PrintTypeOptions } from "@graphql-markdown/types";

import {
  getFormattedDefaultValue,
  getTypeName,
  isDeprecated,
} from "@graphql-markdown/graphql";

import {
  MARKDOWN_EOL,
  DEPRECATED,
  MARKDOWN_CODE_INDENTATION,
} from "./const/strings";
import { hasPrintableDirective } from "./link";

/**
 * Generates a string representation of GraphQL arguments with proper formatting and indentation.
 *
 * @param type - The GraphQL type object containing arguments to print
 * @param indentationLevel - The level of indentation to apply (default: 1)
 * @returns A formatted string of arguments or an empty string if no arguments exist
 * @example
 * ```
 * printCodeArguments({ args: [{ name: 'id', type: 'ID!' }] })
 * // Returns:
 * // (
 * //   id: ID!
 * // )
 * ```
 */
export const printCodeArguments = (
  type: unknown,
  indentationLevel: number = 1,
): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("args" in type) ||
    !Array.isArray(type.args) ||
    type.args.length === 0
  ) {
    return "";
  }

  const argIndentation = MARKDOWN_CODE_INDENTATION.repeat(indentationLevel);
  const parentIndentation =
    indentationLevel === 1 ? "" : MARKDOWN_CODE_INDENTATION;
  const argLines = type.args.map((v) => {
    const defaultValue = getFormattedDefaultValue(v);
    const hasDefaultValue = defaultValue !== undefined && defaultValue !== null;
    const printedDefault = hasDefaultValue
      ? ` = ${getFormattedDefaultValue(v)}`
      : "";
    const propType = String(v.type);
    const propName = String(v.name);
    return `${argIndentation}${propName}: ${propType}${printedDefault}`;
  });

  return [`(`, ...argLines, `${parentIndentation})`].join(MARKDOWN_EOL);
};

/**
 * Generates a string representation of a GraphQL field including its arguments,
 * return type, and deprecation status.
 *
 * @param type - The GraphQL field type object to print
 * @param options - Optional configuration for printing the type
 * @param indentationLevel - The level of indentation to apply (default: 0)
 * @returns A formatted string representing the field or an empty string if the field should not be printed
 * @example
 * ```
 * printCodeField({ name: 'user', type: 'User!', args: [{ name: 'id', type: 'ID!' }] })
 * // Returns: user(
 * //   id: ID!
 * // ): User!
 * ```
 */
export const printCodeField = (
  type: unknown,
  options?: PrintTypeOptions,
  indentationLevel: number = 0,
): MDXString | string => {
  if (typeof type !== "object" || type === null || !("type" in type)) {
    return "";
  }

  if (!hasPrintableDirective(type, options)) {
    return "";
  }

  const parts = [
    getTypeName(type),
    printCodeArguments(type, indentationLevel + 1),
    `: ${getTypeName(type.type)}`,
  ];

  if (isDeprecated(type)) {
    parts.push(` @${DEPRECATED}`);
  }

  return parts.join("") + MARKDOWN_EOL;
};
