/**
 * Provides utilities for handling and printing GraphQL directives in Markdown format
 * @module
 */

import type {
  Badge,
  PrintTypeOptions,
  MDXString,
  CustomDirectiveMapItem,
  CustomDirectiveResolver,
  Maybe,
} from "@graphql-markdown/types";

import { getConstDirectiveMap } from "@graphql-markdown/graphql";

import { MARKDOWN_EOL, MARKDOWN_EOP } from "./const/strings";
import { SectionLevels } from "./const/options";
import { printLink } from "./link";
import { printBadge } from "./badge";

/**
 * Resolves a custom directive using the provided resolver function
 * @param resolver - The resolver function name to execute
 * @param type - The GraphQL type to resolve the directive for
 * @param constDirectiveOption - The directive configuration options
 * @param fallback - Optional fallback value if resolution fails
 * @returns The resolved directive value or fallback/undefined
 */
export const getCustomDirectiveResolver = (
  resolver: CustomDirectiveResolver,
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  fallback?: Maybe<string>,
): Maybe<string> => {
  if (
    typeof constDirectiveOption.type !== "object" ||
    typeof constDirectiveOption[resolver] !== "function"
  ) {
    return fallback;
  }

  return constDirectiveOption[resolver]!(
    constDirectiveOption.type,
    type,
  ) as Maybe<string>;
};

/**
 * Prints a custom directive as a Markdown string
 * @param type - The GraphQL type to print the directive for
 * @param constDirectiveOption - The directive configuration options
 * @param options - General printing options
 * @returns Formatted Markdown string for the directive or undefined
 */
export const printCustomDirective = (
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  options: PrintTypeOptions,
): Maybe<string> => {
  const typeNameLink = printLink(constDirectiveOption.type, {
    ...options,
    withAttributes: false,
  });
  const description = getCustomDirectiveResolver(
    "descriptor",
    type,
    constDirectiveOption,
  );

  if (typeof description !== "string") {
    return undefined;
  }

  return `${SectionLevels.LEVEL.repeat(4)} ${typeNameLink}${MARKDOWN_EOL} ${description}${MARKDOWN_EOL} `;
};

/**
 * Prints all custom directives for a type as a Markdown section
 * @param type - The GraphQL type to print directives for
 * @param options - General printing options
 * @returns Markdown string containing all formatted directives
 */
export const printCustomDirectives = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  const constDirectiveMap = getConstDirectiveMap(
    type,
    options.customDirectives,
  );

  if (!constDirectiveMap || Object.keys(constDirectiveMap).length === 0) {
    return "";
  }

  const directives = Object.values(constDirectiveMap)
    .map((constDirectiveOption): Maybe<string> => {
      return printCustomDirective(type, constDirectiveOption, options);
    })
    .filter((value): boolean => {
      return value !== undefined;
    });

  if (directives.length === 0) {
    return "";
  }

  const content = directives.join(MARKDOWN_EOP);

  return `${SectionLevels.LEVEL.repeat(3)} Directives${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
};

/**
 * Extracts custom tags from directives for a given type
 * @param type - The GraphQL type to get tags for
 * @param options - General printing options
 * @returns Array of badge configurations from directive tags
 */
export const getCustomTags = (
  type: unknown,
  options: PrintTypeOptions,
): Badge[] => {
  const constDirectiveMap = getConstDirectiveMap(
    type,
    options.customDirectives,
  );

  if (
    typeof constDirectiveMap !== "object" ||
    constDirectiveMap === null ||
    Object.keys(constDirectiveMap).length === 0
  ) {
    return [];
  }

  return Object.values(constDirectiveMap)
    .map((constDirectiveOption): Maybe<string> => {
      return getCustomDirectiveResolver("tag", type, constDirectiveOption);
    })
    .filter((value): boolean => {
      return value !== undefined;
    }) as unknown as Badge[];
};

/**
 * Prints custom directive tags as Markdown badges
 * @param type - The GraphQL type to print tags for
 * @param options - General printing options
 * @returns Formatted Markdown string of badges or empty string
 */
export const printCustomTags = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  const badges = getCustomTags(type, options);

  if (badges.length === 0) {
    return "";
  }

  return badges
    .map((badge): MDXString => {
      return printBadge(badge, options);
    })
    .join(" ") as MDXString;
};
