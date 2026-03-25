/**
 * Module for handling GraphQL operation printing functionality.
 * Provides utilities to print operation types, metadata, and code representations.
 * @module
 */

import type { PrintTypeOptions, MDXString } from "@graphql-markdown/types";
import { getTypeName, isOperation } from "@graphql-markdown/graphql";
import { MARKDOWN_CODE_INDENTATION, MARKDOWN_EOL } from "../const/strings";
import { printCodeField } from "../code";
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
 * Wraps a GraphQL operation snippet in one or more namespace blocks.
 */
const wrapOperationCodeWithNamespaces = (
  operationCode: string,
  operationNamespaceParts: string[],
): string => {
  if (operationNamespaceParts.length === 0 || operationCode.trim() === "") {
    return operationCode;
  }

  let lines = operationCode
    .trimEnd()
    .split(MARKDOWN_EOL)
    .filter((line) => {
      return line.length > 0;
    });

  for (let i = operationNamespaceParts.length - 1; i >= 0; i -= 1) {
    const namespace = operationNamespaceParts[i];
    lines = [
      `${namespace} {`,
      ...lines.map((line) => {
        return `${MARKDOWN_CODE_INDENTATION}${line}`;
      }),
      `}`,
    ];
  }

  return `${lines.join(MARKDOWN_EOL)}${MARKDOWN_EOL}`;
};

/**
 * Prints the code representation of an operation.
 */
export const printCodeOperation = (
  type: unknown,
  options?: PrintTypeOptions,
): MDXString | string => {
  const code = printCodeField(type, options);

  if (
    !Array.isArray(options?.operationNamespaceParts) ||
    options.operationNamespaceParts.length === 0
  ) {
    return code;
  }

  return wrapOperationCodeWithNamespaces(code, options.operationNamespaceParts);
};
