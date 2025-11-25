/**
 * Directive name normalization and processing utilities.
 *
 * This module consolidates utilities for handling directive names from multiple
 * sources (CLI, config file, etc.) ensuring consistent normalization across
 * the application.
 *
 * @packageDocumentation
 */

import type { DirectiveName, Maybe } from "@graphql-markdown/types";

/**
 * Normalizes directive names from multiple sources into a single deduplicated array.
 *
 * This function:
 * 1. Accepts multiple directive name arrays from different sources
 * 2. Flattens them into a single array
 * 3. Removes null/undefined values
 * 4. Returns the normalized array
 *
 * Useful when combining directives from CLI, config file, and environment sources.
 *
 * @param sources - Multiple arrays of directive names or undefined/null values
 * @returns A single array of normalized directive names
 *
 * @example
 * ```typescript
 * import { normalizeDirectiveNames } from "@graphql-markdown/core/directives/normalize";
 *
 * const cliDirectives = ["@example", "@internal"];
 * const configDirectives = ["@auth"];
 *
 * const all = normalizeDirectiveNames(cliDirectives, configDirectives);
 * // Result: ["@example", "@internal", "@auth"]
 *
 * // Safely handles undefined:
 * const safe = normalizeDirectiveNames(cliDirectives, undefined, configDirectives);
 * // Result: ["@example", "@internal", "@auth"]
 * ```
 */
export const normalizeDirectiveNames = (
  ...sources: (DirectiveName[] | Maybe<DirectiveName[]>)[]
): DirectiveName[] => {
  return sources
    .filter((s): s is DirectiveName[] => Array.isArray(s) && s.length > 0)
    .flat();
};

/**
 * Removes duplicate directive names from an array while preserving order.
 *
 * @param directives - Array of directive names that may contain duplicates
 * @returns A new array with duplicate directive names removed
 *
 * @example
 * ```typescript
 * import { uniqueDirectiveNames } from "@graphql-markdown/core/directives/normalize";
 *
 * const directives = ["@auth", "@example", "@auth", "@internal"];
 * const unique = uniqueDirectiveNames(directives);
 * // Result: ["@auth", "@example", "@internal"]
 * ```
 */
export const uniqueDirectiveNames = (
  directives: DirectiveName[],
): DirectiveName[] => {
  return Array.from(new Set(directives));
};

/**
 * Combines and deduplicates directive names from multiple sources in one step.
 *
 * This is a convenience function that combines normalizeDirectiveNames
 * with uniqueDirectiveNames for the common case where you need both
 * normalization and deduplication.
 *
 * @param sources - Multiple arrays of directive names or undefined/null values
 * @returns A single array of deduplicated directive names
 *
 * @example
 * ```typescript
 * import { combineDirectiveNames } from "@graphql-markdown/core/directives/normalize";
 *
 * const cliDirectives = ["@example", "@internal"];
 * const configDirectives = ["@auth", "@example"]; // @example is duplicate
 *
 * const all = combineDirectiveNames(cliDirectives, configDirectives);
 * // Result: ["@example", "@internal", "@auth"]
 * ```
 */
export const combineDirectiveNames = (
  ...sources: (DirectiveName[] | Maybe<DirectiveName[]>)[]
): DirectiveName[] => {
  return uniqueDirectiveNames(normalizeDirectiveNames(...sources));
};
