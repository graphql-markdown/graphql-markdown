import type {
  Badge,
  PrintTypeOptions,
  MDXString,
  CustomDirectiveMapItem,
  CustomDirectiveResolver,
  Maybe,
} from "@graphql-markdown/types";

import { getConstDirectiveMap } from "@graphql-markdown/utils";

import { MARKDOWN_EOL, MARKDOWN_EOP } from "./const/strings";
import { SectionLevels } from "./const/options";
import { printLink } from "./link";
import { printBadge } from "./badge";

export const printCustomDirectives = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  const constDirectiveMap = getConstDirectiveMap(
    type,
    options.customDirectives,
  );

  if (!constDirectiveMap || Object.keys(constDirectiveMap).length < 1) {
    return "";
  }

  const directives = Object.values<CustomDirectiveMapItem>(constDirectiveMap)
    .map(
      (constDirectiveOption): Maybe<string> =>
        printCustomDirective(type, constDirectiveOption, options),
    )
    .filter((value): boolean => typeof value !== "undefined");

  if (directives.length === 0) {
    return "";
  }

  const content = directives.join(MARKDOWN_EOP);

  return `${SectionLevels.LEVEL_3} Directives${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
};

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

  return `${SectionLevels.LEVEL_4} ${typeNameLink}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
};

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
    !Object.keys(constDirectiveMap).length
  ) {
    return [];
  }

  return Object.values<CustomDirectiveMapItem>(constDirectiveMap)
    .map(
      (constDirectiveOption): Maybe<string> =>
        getCustomDirectiveResolver("tag", type, constDirectiveOption),
    )
    .filter(
      (value): boolean => typeof value !== "undefined",
    ) as unknown as Badge[];
};

export const printCustomTags = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  const badges = getCustomTags(type, options);

  if (badges.length === 0) {
    return "";
  }

  return badges
    .map((badge): MDXString => printBadge(badge))
    .join(" ") as MDXString;
};

export const getCustomDirectiveResolver = (
  resolver: CustomDirectiveResolver,
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  fallback?: Maybe<string>,
): Maybe<string> => {
  if (
    typeof constDirectiveOption === "undefined" ||
    typeof constDirectiveOption.type !== "object" ||
    typeof constDirectiveOption[resolver] !== "function"
  ) {
    return fallback;
  }

  return constDirectiveOption[resolver]!(constDirectiveOption.type, type);
};
