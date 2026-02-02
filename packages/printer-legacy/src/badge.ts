/**
 * Module for handling GraphQL type badges in MDX documentation.
 * Provides functionality to generate and format badges for different GraphQL types
 * and their properties like deprecation status, nullability, and relationships.
 * @module
 */

import type {
  Badge,
  GraphQLType,
  MDXString,
  Maybe,
  PrintTypeOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
} from "@graphql-markdown/types";

import { escapeMDX } from "@graphql-markdown/utils";

import {
  getNamedType,
  isDeprecated,
  isListType,
  isNonNullType,
} from "@graphql-markdown/graphql";

import { getCategoryLocale } from "./link";
import { getGroup } from "./group";
import { createDefaultFormatter } from "./formatter";
import { DEPRECATED, NON_NULL } from "./const/strings";

export const CSS_BADGE_CLASSNAME = {
  DEPRECATED: "DEPRECATED",
  RELATION: "RELATION",
  NON_NULL: "NON_NULL",
};

/**
 * Gets an array of badges for a given GraphQL type.
 * @param type - The GraphQL type to generate badges for
 * @param groups - Optional map of schema entities to their groups
 * @returns Array of Badge objects containing text and optional classnames
 */
export const getTypeBadges = (
  type: unknown,
  groups?: Maybe<SchemaEntitiesGroupMap>,
): Badge[] => {
  if (typeof type !== "object" || type === null) {
    return [];
  }

  const badges: Badge[] = [];
  const rootType = ("type" in type ? type.type : type) as Maybe<GraphQLType>;

  if (isDeprecated(type)) {
    badges.push({
      text: DEPRECATED,
      classname: CSS_BADGE_CLASSNAME.DEPRECATED,
    } as Badge);
  }

  if (isNonNullType(rootType)) {
    badges.push({
      text: NON_NULL,
      classname: CSS_BADGE_CLASSNAME.NON_NULL,
    } as Badge);
  }

  if (isListType(rootType)) {
    badges.push({ text: "list" } as Badge);
  }

  const category = getCategoryLocale(getNamedType(rootType));
  if (category) {
    badges.push({ text: category } as Badge);
  }

  if (groups) {
    const typeCategory = (
      typeof category === "string" ? category : category?.plural
    ) as SchemaEntity;
    const group = getGroup(rootType, groups, typeCategory);
    if (group && group !== "") {
      badges.push({ text: group } as Badge);
    }
  }

  return badges;
};

/**
 * Formats a single badge into MDX string format.
 * @param badge - The badge object containing text and optional classname
 * @param options - Options containing the formatter for badges
 * @returns Formatted MDX string representation of the badge
 */
export const printBadge = (
  { text, classname }: Badge,
  options: PrintTypeOptions,
): MDXString => {
  const textString = escapeMDX(typeof text === "object" ? text.singular : text);
  const badge = { text: textString, classname } as Badge;

  // Use the formatter from options (either custom or default)
  if (options.formatMDXBadge) {
    return options.formatMDXBadge(badge);
  }

  // Fallback to default formatter (should not happen if Printer.init was called)
  return createDefaultFormatter().formatMDXBadge(badge);
};

/**
 * Generates and formats all applicable badges for a GraphQL type.
 * @param type - The GraphQL type to generate badges for
 * @param options - Options for printing/formatting the badges
 * @returns Formatted MDX string containing all badges, or empty string if no badges or badges disabled
 */
export const printBadges = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (
    !("typeBadges" in options) ||
    typeof options.typeBadges !== "boolean" ||
    !options.typeBadges
  ) {
    return "";
  }

  const badges = getTypeBadges(type, options.groups);

  if (badges.length === 0) {
    return "";
  }

  const formattedBadges = badges.map((badge) => {
    return printBadge(badge, options);
  });
  return formattedBadges.join(" ") as MDXString;
};
