import { getConstDirectiveMap } from "@graphql-markdown/utils";

import { MARKDOWN_EOL, MARKDOWN_EOP } from "./const/strings";
import { SectionLevels } from "./const/options";
import { Link } from "./link";
import { printBadge } from "./badge";
import {
  Badge,
  PrintTypeOptions,
  MDXString,
  CustomDirectiveMapItem,
  CustomDirectiveResolver,
  CustomDirectiveFunction,
} from "@graphql-markdown/types";

export const printCustomDirectives = (
  type: unknown,
  options: PrintTypeOptions,
) => {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  if (
    typeof constDirectiveMap === "undefined" ||
    Object.keys(constDirectiveMap).length < 1
  ) {
    return "";
  }

  const directives = Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      printCustomDirective(type, constDirectiveOption, options),
    )
    .filter((value) => typeof value !== "undefined");

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
): string | undefined => {
  const typeNameLink = Link.printLink(constDirectiveOption.type, {
    ...options,
    withAttributes: false,
  });
  const description = getCustomDirectiveResolver(
    "descriptor",
    type,
    constDirectiveOption,
  );

  if (typeof description === "undefined") {
    return undefined;
  }

  return `${SectionLevels.LEVEL_4} ${typeNameLink}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
};

export const getCustomTags = (
  type: unknown,
  options: PrintTypeOptions,
): Badge[] => {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  if (
    typeof constDirectiveMap !== "object" ||
    !Object.keys(constDirectiveMap).length
  ) {
    return [];
  }

  return Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      getCustomDirectiveResolver("tag", type, constDirectiveOption),
    )
    .filter((value) => typeof value !== "undefined") as unknown as Badge[];
};

export const printCustomTags = (
  type: unknown,
  options: PrintTypeOptions,
): string | MDXString => {
  const badges = getCustomTags(type, options);

  if (badges.length === 0) {
    return "";
  }

  return badges.map((badge) => printBadge(badge)).join(" ") as MDXString;
};

export const getCustomDirectiveResolver = (
  resolver: CustomDirectiveResolver,
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  fallback: string | undefined = undefined,
): string | undefined => {
  if (
    typeof constDirectiveOption === "undefined" ||
    typeof constDirectiveOption.type !== "object" ||
    typeof constDirectiveOption[resolver] !== "function"
  ) {
    return fallback;
  }

  return (constDirectiveOption[resolver] as CustomDirectiveFunction)!(
    constDirectiveOption.type,
    type,
  );
};
