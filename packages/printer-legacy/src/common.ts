import type {
  CustomDirectiveMap,
  CustomDirectiveMapItem,
  Maybe,
  MDXString,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import { isEmpty, escapeMDX } from "@graphql-markdown/utils";

import { isDeprecated, getConstDirectiveMap } from "@graphql-markdown/graphql";

import { DEPRECATED, MARKDOWN_EOP, NO_DESCRIPTION_TEXT } from "./const/strings";
import { getCustomDirectiveResolver } from "./directive";

export const printCustomDirectives = (
  type: unknown,
  options?: PrintTypeOptions,
): string => {
  const constDirectiveMap = getConstDirectiveMap(
    type,
    options?.customDirectives,
  );

  if (isEmpty<CustomDirectiveMap>(constDirectiveMap)) {
    return "";
  }

  const content = Object.values<CustomDirectiveMapItem>(constDirectiveMap)
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
    .map((text) => {
      return escapeMDX(text);
    })
    .join(MARKDOWN_EOP);

  return `${MARKDOWN_EOP}${content}`;
};

export const formatDescription = (
  type: unknown,
  replacement: Maybe<string> = NO_DESCRIPTION_TEXT,
): MDXString | string => {
  if (typeof type !== "object" || type === null) {
    return `${MARKDOWN_EOP}${escapeMDX(replacement)}`;
  }

  const description =
    "description" in type && typeof type.description === "string"
      ? type.description
      : replacement;
  return `${MARKDOWN_EOP}${escapeMDX(description)}`;
};

export const printWarning = (
  { text, title }: { text?: string; title?: string },
  options: PrintTypeOptions,
): string => {
  const formattedText =
    typeof text !== "string" || text.trim() === ""
      ? MARKDOWN_EOP
      : `${MARKDOWN_EOP}${text}${MARKDOWN_EOP}`;

  return options.formatMDXAdmonition!(
    { text: formattedText, type: "warning", icon: "⚠️", title },
    options.meta,
  );
};

export const printDeprecation = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  if (typeof type !== "object" || type === null || !isDeprecated(type)) {
    return "";
  }

  const reason =
    "deprecationReason" in type && typeof type.deprecationReason === "string"
      ? escapeMDX(type.deprecationReason)
      : "";

  return printWarning(
    { text: reason, title: DEPRECATED.toUpperCase() },
    options,
  );
};

export const printDescription = (
  type: unknown,
  options: PrintTypeOptions,
  noText?: string,
): MDXString | string => {
  const description = formatDescription(type, noText);
  const customDirectives = printCustomDirectives(type, options);
  const deprecation = printDeprecation(type, options);
  return `${deprecation}${description}${customDirectives}`;
};
