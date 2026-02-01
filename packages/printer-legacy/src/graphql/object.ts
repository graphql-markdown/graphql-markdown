/**
 * GraphQL Object Type printing utilities
 * @module
 */

import type { PrintTypeOptions } from "@graphql-markdown/types";

import { getTypeName, getFields } from "@graphql-markdown/graphql";

import { printSection, printMetadataSection } from "../section";
import { printCodeField } from "../code";
import { MARKDOWN_EOL, MARKDOWN_CODE_INDENTATION } from "../const/strings";

/**
 * Prints the metadata section for interfaces implemented by a GraphQL type
 * @param type - The GraphQL type object to process
 * @param options - Printing options
 * @returns Markdown formatted string of implemented interfaces
 */
const printImplementedInterfaceMetadata = async (
  type: unknown,
  options: PrintTypeOptions,
): Promise<string> => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("getInterfaces" in type) ||
    typeof type.getInterfaces !== "function"
  ) {
    return "";
  }

  return await printSection(type.getInterfaces(), "Interfaces", options);
};

/**
 * Prints the complete metadata section for a GraphQL object type
 * @param type - The GraphQL type object to process
 * @param options - Printing options
 * @returns Markdown formatted string containing fields and interfaces metadata
 */
export const printObjectMetadata = async (
  type: unknown,
  options: PrintTypeOptions,
): Promise<string> => {
  const interfaceMeta = await printImplementedInterfaceMetadata(type, options);
  const metadata = await printMetadataSection(
    type,
    getFields(type),
    "Fields",
    options,
  );

  return `${metadata}${interfaceMeta}`;
};

/**
 * Prints the GraphQL type definition as a code block
 * @param type - The GraphQL type object to process
 * @param entity - The entity type identifier (e.g., "type", "interface")
 * @param options - Printing options
 * @returns GraphQL type definition as a code block string
 */
export const printCodeType = (
  type: unknown,
  entity: string,
  options: PrintTypeOptions,
): string => {
  if (typeof type !== "object" || type === null) {
    return "";
  }

  const name = getTypeName(type);
  const extendsInterface =
    "getInterfaces" in type &&
    typeof type.getInterfaces === "function" &&
    type.getInterfaces().length > 0
      ? ` implements ${type
          .getInterfaces()
          .map((field: unknown): string => {
            return getTypeName(field);
          })
          .join(", ")}`
      : "";
  const typeFields = getFields(type)
    .map((field: unknown): string => {
      const f = printCodeField(field, options, 1);
      return f.length > 0 ? `${MARKDOWN_CODE_INDENTATION}${f}` : "";
    })
    .filter((field) => {
      return field.length > 0;
    })
    .join("");

  return `${entity} ${name}${extendsInterface} {${MARKDOWN_EOL}${typeFields}}`;
};

/**
 * Prints a GraphQL object type definition as a code block
 * @param type - The GraphQL type object to process
 * @param options - Printing options
 * @returns GraphQL object type definition as a code block string
 */
export const printCodeObject = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  return printCodeType(type, "type", options);
};
