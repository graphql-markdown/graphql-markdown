import type { PrintTypeOptions, MDXString } from "@graphql-markdown/types";

import {
  isDeprecated,
  getConstDirectiveMap,
  isEmpty,
  escapeMDX,
} from "@graphql-markdown/utils";

import { getCustomDirectiveResolver } from "./directive";

import {
  DEPRECATED,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
  NO_DESCRIPTION_TEXT,
} from "./const/strings";

export const printCustomDirectives = (
  type: unknown,
  options?: PrintTypeOptions,
): string => {
  const constDirectiveMap = getConstDirectiveMap(type, options);

  if (typeof constDirectiveMap === "undefined" || isEmpty(constDirectiveMap)) {
    return "";
  }

  const content = Object.values(constDirectiveMap)
    .map((constDirectiveOption) =>
      getCustomDirectiveResolver("descriptor", type, constDirectiveOption, ""),
    )
    .filter((text) => typeof text === "string" && text.length > 0)
    .join(MARKDOWN_EOP);

  return `${MARKDOWN_EOP}${content}`;
};

export const formatDescription = (
  type: unknown,
  replacement: string = NO_DESCRIPTION_TEXT,
): string | MDXString => {
  if (typeof type !== "object" || type === null) {
    return `${MARKDOWN_EOP}${replacement}`;
  }

  const description =
    "description" in type && typeof type.description === "string"
      ? escapeMDX(type.description)
      : replacement;
  return `${MARKDOWN_EOP}${description}`;
};

export const printDeprecation = (type: unknown): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    isDeprecated(type) === false
  ) {
    return "";
  }

  const reason =
    "deprecationReason" in type && typeof type.deprecationReason === "string"
      ? type.deprecationReason + MARKDOWN_EOL
      : "";

  return `${MARKDOWN_EOP}:::caution ${DEPRECATED.toUpperCase()}${MARKDOWN_EOL}${reason}:::`;
};

export const printDescription = (
  type: unknown,
  options?: PrintTypeOptions,
  noText?: string,
): string | MDXString => {
  const description = formatDescription(type, noText);
  const customDirectives = printCustomDirectives(type, options);
  const deprecation = printDeprecation(type);
  return `${deprecation}${description}${customDirectives}`;
};
