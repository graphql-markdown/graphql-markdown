/**
 * Module for handling GraphQL operation printing functionality.
 * Provides utilities to print operation types, metadata, and code representations.
 * @module
 */

import type {
  PrintTypeOptions,
  MDXString,
  Maybe,
  PageSection,
} from "@graphql-markdown/types";
import { getTypeName, isOperation } from "@graphql-markdown/graphql";
import { MARKDOWN_CODE_INDENTATION, MARKDOWN_EOL } from "../const/strings";
import { printCodeField } from "../code";
import { printSection, printMetadataSection } from "../section";

/**
 * Prints the operation type information.
 * @param type - The operation type to print
 * @param options - Print type options for customizing output
 * @returns A "Type" PageSection, or undefined when `type` is not an operation
 */
export const printOperationType = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<PageSection> => {
  if (!isOperation(type)) {
    return undefined;
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
 * @returns Ordered operation metadata sections, or undefined when `type` is not an operation
 */
export const printOperationMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<PageSection[]> => {
  if (!isOperation(type)) {
    return undefined;
  }

  const response = printOperationType(type, options);
  const metadata = printMetadataSection(type, type.args, "Arguments", options);

  return [metadata, response].filter(Boolean) as PageSection[];
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
