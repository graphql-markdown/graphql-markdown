/**
 * Common printer utility functions for handling descriptions, directives, and warnings.
 * @module
 */

import type {
  CustomDirectiveMap,
  CustomDirectiveMapItem,
  Maybe,
  MDXString,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import { isEmpty, escapeMDX } from "@graphql-markdown/utils";

import { isDeprecated, getConstDirectiveMap } from "@graphql-markdown/graphql";

import { DEPRECATED, MARKDOWN_EOP, NO_DESCRIPTION_TEXT } from "./const/strings";
import { getCustomDirectiveResolver } from "./directive";

/**
 * Prints documentation for custom directives applied to a type.
 *
 * @param type - GraphQL type to get directives from
 * @param options - Printer configuration options
 * @returns Formatted directive documentation string
 */
export const printCustomDirectives = (
  type: unknown,
  options?: PrintTypeOptions,
): string => {
  const constDirectiveMap = getConstDirectiveMap(
    type,
    options?.customDirectives,
  );

  if (isEmpty<CustomDirectiveMap>(constDirectiveMap)) {
    return "";
  }

  const content = Object.values<CustomDirectiveMapItem>(constDirectiveMap)
    .map((constDirectiveOption) => {
      return getCustomDirectiveResolver(
        "descriptor",
        type,
        constDirectiveOption,
        "",
      );
    })
    .filter((text) => {
      return typeof text === "string" && text.length > 0;
    })
    .map((text) => {
      return escapeMDX(text);
    })
    .join(MARKDOWN_EOP);

  return `${MARKDOWN_EOP}${content}`;
};

/**
 * Formats a GraphQL type description or falls back to a default message.
 *
 * @param type - GraphQL type to get description from
 * @param replacement - Optional fallback text if no description exists
 * @returns Formatted description string or MDX content
 */
export const formatDescription = (
  type: unknown,
  replacement: Maybe<string> = NO_DESCRIPTION_TEXT,
): MDXString | string => {
  if (typeof type !== "object" || type === null) {
    return `${MARKDOWN_EOP}${escapeMDX(replacement)}`;
  }

  const description =
    "description" in type && typeof type.description === "string"
      ? type.description
      : replacement;
  return `${MARKDOWN_EOP}${escapeMDX(description)}`;
};

/**
 * Generates a warning message block in MDX format.
 * @param param0 - Warning configuration object
 * @param param0.text - The warning message text
 * @param param0.title - Optional title for the warning block
 * @param options - Configuration options for printing
 * @returns Formatted warning message as MDX string
 */
export const printWarning = (
  { text, title }: { text?: string; title?: string },
  options: PrintTypeOptions,
): string => {
  const formattedText =
    typeof text !== "string" || text.trim() === ""
      ? MARKDOWN_EOP
      : `${MARKDOWN_EOP}${text}${MARKDOWN_EOP}`;

  return options.formatMDXAdmonition!(
    { text: formattedText, type: "warning", icon: "⚠️", title },
    options.meta,
  ) as string;
};

/**
 * Prints deprecation information for a GraphQL type if it is deprecated.
 * @param type - The GraphQL type to check for deprecation
 * @param options - Configuration options for printing
 * @returns Formatted deprecation warning as MDX string, or empty string if not deprecated
 */
export const printDeprecation = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  if (typeof type !== "object" || type === null || !isDeprecated(type)) {
    return "";
  }

  const reason =
    "deprecationReason" in type && typeof type.deprecationReason === "string"
      ? escapeMDX(type.deprecationReason)
      : "";

  return printWarning(
    { text: reason, title: DEPRECATED.toUpperCase() },
    options,
  );
};

/**
 * Prints the complete description for a GraphQL type, including deprecation warnings and custom directives.
 * @param type - The GraphQL type to document
 * @param options - Configuration options for printing
 * @param noText - Optional text to display when no description exists
 * @returns Combined description, deprecation notices, and custom directives as MDX content
 */
export const printDescription = (
  type: unknown,
  options: PrintTypeOptions,
  noText?: string,
): MDXString | string => {
  const description = formatDescription(type, noText);
  const customDirectives = printCustomDirectives(type, options);
  const deprecation = printDeprecation(type, options);
  return `${deprecation}${description}${customDirectives}`;
};
