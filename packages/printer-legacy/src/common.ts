import type {
  PrintTypeOptions,
  MDXString,
  Maybe,
} from "@graphql-markdown/types";

import { isEmpty, escapeMDX } from "@graphql-markdown/utils";

import {
  isDeprecated,
  getConstDirectiveMap,
  hasDirective,
} from "@graphql-markdown/graphql";

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
    .map((constDirectiveOption) => {
      return getCustomDirectiveResolver(
        "descriptor",
        type,
        constDirectiveOption,
        "",
      );
    })
    .filter((text) => {
      return typeof text === "string" && text.length > 0;
    })
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

export const hasPrintableDirective = (
  type: unknown,
  options?: Pick<
    PrintTypeOptions,
    "deprecated" | "onlyDocDirectives" | "skipDocDirectives"
  >,
): boolean => {
  if (!options) {
    return true;
  }

  const skipDirective =
    "skipDocDirectives" in options &&
    options.skipDocDirectives &&
    options.skipDocDirectives.length > 0
      ? hasDirective(type, options.skipDocDirectives)
      : false;

  const skipDeprecated =
    "deprecated" in options &&
    options.deprecated === "skip" &&
    isDeprecated(type);

  const onlyDirective =
    "onlyDocDirectives" in options &&
    options.onlyDocDirectives &&
    options.onlyDocDirectives.length > 0
      ? hasDirective(type, options.onlyDocDirectives, true)
      : true;

  return !(skipDirective || skipDeprecated) && onlyDirective;
};
