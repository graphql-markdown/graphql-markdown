import type {
  PrintTypeOptions,
  MDXString,
  Maybe,
} from "@graphql-markdown/types";

import { isEmpty, escapeMDX } from "@graphql-markdown/utils";

import { isDeprecated, getConstDirectiveMap } from "@graphql-markdown/graphql";

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
  const constDirectiveMap = getConstDirectiveMap(
    type,
    options?.customDirectives,
  );

  if (!constDirectiveMap || isEmpty(constDirectiveMap)) {
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
  replacement: Maybe<string> = NO_DESCRIPTION_TEXT,
): MDXString | string => {
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
  if (typeof type !== "object" || type === null || !isDeprecated(type)) {
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
): MDXString | string => {
  const description = formatDescription(type, noText);
  const customDirectives = printCustomDirectives(type, options);
  const deprecation = printDeprecation(type);
  return `${deprecation}${description}${customDirectives}`;
};
