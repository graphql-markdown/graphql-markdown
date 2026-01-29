/**
 * Regular expressions and string patterns used throughout the core package.
 *
 * This module centralizes all regex patterns and constants to ensure consistency
 * and simplify maintenance when patterns need to be updated.
 *
 * @packageDocumentation
 */

/**
 * Central repository of regex patterns used for configuration parsing and string transformation.
 *
 * @example
 * ```typescript
 * import { PATTERNS } from "@graphql-markdown/core/const/patterns";
 *
 * const match = PATTERNS.DIRECTIVE_NAME.exec("@myDirective");
 * ```
 */
export const PATTERNS = {
  /**
   * Matches directive names with named capture groups.
   * Captures the directive name after the @ symbol.
   *
   * @pattern `^@(?<directive>\w+)$`
   * @example
   * - "@tag" matches → directive: "tag"
   * - "@myDirective" matches → directive: "myDirective"
   * - "@" does not match
   * - "tag" does not match
   */
  DIRECTIVE_NAME: /^@(?<directive>\w+)$/, // NOSONAR: S5843

  /**
   * Matches group-by directive format with directive name, field, and optional fallback.
   * Groups: (1) directive name, (2) field name, (3) optional fallback
   *
   * @pattern `^@(\w+)\((\w+)(?:\|=(\w+))?\)$`
   * @example
   * - "@tag(name)" matches → ["@tag(name)", "tag", "name", undefined]
   * - "@category(type|=Other)" matches → ["@category(type|=Other)", "category", "type", "Other"]
   * - "@tag()" does not match
   * - "tag(name)" does not match
   */
  GROUP_BY_DIRECTIVE: /^@(\w+)\((\w+)(?:\|=(\w+))?\)$/, // NOSONAR: S5843

  /**
   * Matches word boundaries (non-alphanumeric characters) for string splitting.
   * Used globally to split strings on any non-alphanumeric character.
   *
   * @pattern `[^0-9A-Za-z]+`
   * @example
   * - "hello-world" split → ["hello", "world"]
   * - "hello_world" split → ["hello", "world"]
   * - "hello world" split → ["hello", "world"]
   */
  WORD_BOUNDARY: /[^0-9A-Za-z]+/g, // NOSONAR: S5843

  /**
   * Matches transitions between lowercase/digits and uppercase letters.
   * Used to insert spaces in camelCase strings (e.g., "userId" → "user Id").
   *
   * @pattern `([a-z]+|\d+)([A-Z])`
   * @example
   * - "userId" matches → insert space between "id" and "U" → "user Id"
   * - "HTTPServer" does not match (no lowercase/digit before uppercase)
   * - "get2Users" matches → insert space between "2" and "U" → "get 2 Users"
   */
  CASE_TRANSITION: /([a-z]+|\d+)([A-Z])/g, // NOSONAR: S5843

  /**
   * Matches transitions from letters to digits.
   * Used to insert spaces between letters and numbers (e.g., "user1" → "user 1").
   *
   * @pattern `([a-z]+)(\d)`
   * @example
   * - "user1" matches → "user 1"
   * - "abc123" matches → "abc 123"
   * - "U1" does not match (U is uppercase)
   */
  LETTER_DIGIT_TRANSITION: /([a-z]+)(\d)/g, // NOSONAR: S5843

  /**
   * Matches transitions from digits to letters.
   * Used to insert spaces between numbers and letters (e.g., "2k" → "2 k").
   *
   * @pattern `(\d+)([a-z])`
   * @example
   * - "2k" matches → "2 k"
   * - "123abc" matches → "123 abc"
   * - "2K" does not match (K is uppercase)
   */
  DIGIT_LETTER_TRANSITION: /(\d+)([a-z])/g, // NOSONAR: S5843

  /**
   * Matches numeric prefix for sorted categories (e.g., "01-query" → "query").
   * Used to extract category names from numbered folder names.
   *
   * Pattern: `^\d{2}-`
   *
   * @example
   * ```typescript
   * - "01-query" matches → remove "01-" → "query"
   * - "02-mutations" matches → remove "02-" → "mutations"
   * - "query" does not match
   * - "1-query" does not match (only 1 digit)
   * ```
   */
  NUMERIC_PREFIX: /^\d{2}-/, // NOSONAR: S5843
} as const;

/**
 * String constants used for configuration parsing and defaults.
 */
export const CONFIG_CONSTANTS = {
  /**
   * Default fallback group name used when groupByDirective is configured.
   * Items without the grouping directive are assigned to this group.
   */
  DEFAULT_GROUP: "Miscellaneous" as const,
} as const;
