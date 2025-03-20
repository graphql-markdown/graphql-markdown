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

export const DEFAULT_CSS_CLASSNAME = "badge--secondary" as const;

export const getTypeBadges = (
  type: unknown,
  groups?: Maybe<SchemaEntitiesGroupMap>,
): Badge[] => {
  const badges: Badge[] = [];

  if (typeof type !== "object" || type === null) {
    return badges;
  }

  const rootType = ("type" in type ? type.type : type) as Maybe<GraphQLType>;

  if (isDeprecated(type)) {
    badges.push({
      text: "deprecated",
      classname: "badge--deprecated badge--secondary",
    } as Badge);
  }

  if (isNonNullType(rootType)) {
    badges.push({
      text: "non-null",
      classname: DEFAULT_CSS_CLASSNAME,
    } as Badge);
  }

  if (isListType(rootType)) {
    badges.push({ text: "list", classname: DEFAULT_CSS_CLASSNAME } as Badge);
  }

  const category = getCategoryLocale(getNamedType(rootType));
  if (category) {
    badges.push({ text: category, classname: DEFAULT_CSS_CLASSNAME } as Badge);
  }

  if (groups) {
    const typeCategory = (
      typeof category === "string" ? category : category?.plural
    ) as SchemaEntity;
    const group = getGroup(rootType, groups, typeCategory);
    if (group && group !== "") {
      badges.push({ text: group, classname: DEFAULT_CSS_CLASSNAME } as Badge);
    }
  }

  return badges;
};

export const printBadge = (
  { text, classname }: Badge,
  options: PrintTypeOptions,
): MDXString => {
  const textString = typeof text === "object" ? text.singular : text;
  const formattedText = escapeMDX(textString);
  return options.formatMDXBadge!({
    text: formattedText,
    classname,
  }) as MDXString;
};

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

  return badges
    .map((badge): MDXString => {
      return printBadge(badge, options);
    })
    .join(" ") as MDXString;
};
