/**
 * Common printer utility functions for handling descriptions, directives, and warnings.
 * @module
 */

import type {
  Maybe,
  MDXString,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import {
  escapeMDX,
  isTypeObject,
  hasStringProperty,
} from "@graphql-markdown/utils";

import { isDeprecated } from "@graphql-markdown/graphql";

import { DEPRECATED, MARKDOWN_EOP, NO_DESCRIPTION_TEXT } from "./const/strings";
import { printSlotDecorators } from "./decorator";

/**
 * Formats a GraphQL type description or falls back to a default message.
 *
 * @param type - GraphQL type to get description from
 * @param replacement - Optional fallback text if no description exists
 * @returns Formatted description string or MDX content
 */
const formatDescription = (
  type: unknown,
  replacement: Maybe<string> = NO_DESCRIPTION_TEXT,
): MDXString | string => {
  if (!isTypeObject(type)) {
    return `${MARKDOWN_EOP}${escapeMDX(replacement)}`;
  }

  const description = hasStringProperty(type, "description")
    ? type.description
    : replacement;
  return `${MARKDOWN_EOP}${escapeMDX(description)}`;
};

/**
 * Generates a warning message block in MDX format.
 * @param warningConfig - Warning configuration object with `text` and optional `title` properties
 * @param options - Configuration options for printing
 * @returns Formatted warning message as MDX string
 */
// Used only by unit tests for direct whitebox coverage; not part of the production public API.
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
  );
};

/**
 * Prints deprecation information for a GraphQL type if it is deprecated.
 * @param type - The GraphQL type to check for deprecation
 * @param options - Configuration options for printing
 * @returns Formatted deprecation warning as MDX string, or empty string if not deprecated
 */
// Used only by unit tests for direct whitebox coverage; not part of the production public API.
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
  const deprecation = printDeprecation(type, options);
  // `customDirective`'s `descriptor` handlers reach this line via the
  // decorators pipeline (`printSlotDecorators`), not a dedicated call — see
  // `buildCustomDirectiveDecorators` in `./decorator`.
  const decoratorContent = printSlotDecorators("description", type, options);
  const decorators =
    decoratorContent.length > 0
      ? `${MARKDOWN_EOP}${decoratorContent.join(MARKDOWN_EOP)}`
      : "";
  return `${deprecation}${description}${decorators}`;
};
