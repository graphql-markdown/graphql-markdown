import type {
  Badge,
  GraphQLType,
  MDXString,
  PrintTypeOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
} from "@graphql-markdown/types";

import {
  escapeMDX,
  getNamedType,
  isDeprecated,
  isListType,
  isNonNullType,
} from "@graphql-markdown/utils";

import { getLinkCategory } from "./link";
import { getGroup } from "./group";

export const DEFAULT_CSS_CLASSNAME = "badge--secondary";

export const getTypeBadges = (
  type: unknown,
  groups?: SchemaEntitiesGroupMap,
): Badge[] => {
  const badges: Badge[] = [];

  if (typeof type !== "object" || type === null) {
    return badges;
  }

  const rootType = ("type" in type ? type.type : type) as GraphQLType;

  if (isDeprecated(type) === true) {
    badges.push({
      text: "deprecated",
      classname: "badge--deprecated badge--secondary",
    } as Badge);
  }

  if (isNonNullType(rootType) === true) {
    badges.push({
      text: "non-null",
      classname: DEFAULT_CSS_CLASSNAME,
    } as Badge);
  }

  if (isListType(rootType) === true) {
    badges.push({ text: "list", classname: DEFAULT_CSS_CLASSNAME } as Badge);
  }

  const category = getLinkCategory(getNamedType(rootType));
  if (typeof category !== "undefined") {
    badges.push({ text: category, classname: DEFAULT_CSS_CLASSNAME } as Badge);
  }

  if (typeof groups !== "undefined") {
    const typeCategory = (
      typeof category === "string" ? category : category?.plural
    ) as SchemaEntity;
    const group = getGroup(rootType, groups, typeCategory);
    if (typeof group !== "undefined" && group !== "") {
      badges.push({ text: group, classname: DEFAULT_CSS_CLASSNAME } as Badge);
    }
  }

  return badges;
};

export const printBadges = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!("typeBadges" in options) || options.typeBadges !== true) {
    return "";
  }

  const badges = getTypeBadges(type, options.groups);

  if (badges.length === 0) {
    return "";
  }

  return badges.map((badge) => printBadge(badge)).join(" ") as MDXString;
};

export const printBadge = ({ text, classname }: Badge): MDXString => {
  const textString = typeof text === "string" ? text : text.singular;
  const formattedText = escapeMDX(textString);
  return `<Badge class="badge ${classname}" text="${formattedText}"/>` as MDXString;
};
