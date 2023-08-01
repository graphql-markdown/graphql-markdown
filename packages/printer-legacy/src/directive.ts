import {
  CustomDirectiveMapItem,
  CustomDirectiveResolver,
  getConstDirectiveMap,
} from "@graphql-markdown/utils";

import {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "./const/strings";
import { Link } from "./link";
import { Badge, printBadge } from "./badge";
import { Options } from "./const/options";
import { MDXString } from "./const/mdx";

export const printCustomDirectives = (type: unknown, options: Options) => {
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

  return `${HEADER_SECTION_LEVEL} Directives${MARKDOWN_EOP}${content}${MARKDOWN_EOP}`;
};

export const printCustomDirective = (
  type: unknown,
  constDirectiveOption: CustomDirectiveMapItem,
  options: Options,
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

  return `${HEADER_SECTION_SUB_LEVEL} ${typeNameLink}${MARKDOWN_EOL}> ${description}${MARKDOWN_EOL}> `;
};

export const getCustomTags = (type: unknown, options: Options): Badge[] => {
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
  options: Options,
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

  return constDirectiveOption[resolver]!(constDirectiveOption.type, type);
};
