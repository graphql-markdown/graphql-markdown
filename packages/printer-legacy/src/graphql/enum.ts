import type {
  GraphQLEnumType,
  MDXString,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import {
  isEnumType,
  getTypeName,
  isDeprecated,
  hasDirective,
} from "@graphql-markdown/graphql";

import { MARKDOWN_EOL, DEPRECATED } from "../const/strings";
import { printMetadataSection } from "../section";

export const printEnumMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): MDXString | string => {
  if (!isEnumType(type)) {
    return "";
  }

  return printMetadataSection(
    type,
    (type as GraphQLEnumType).getValues(),
    "Values",
    options,
  );
};

export const printCodeEnum = (
  type: unknown,
  options: PrintTypeOptions,
): string => {
  if (!isEnumType(type)) {
    return "";
  }

  let code = `enum ${getTypeName(type)} {${MARKDOWN_EOL}`;
  code += (type as GraphQLEnumType)
    .getValues()
    .map((value) => {
      const skipDirective =
        "skipDocDirective" in options &&
        hasDirective(value, options.skipDocDirective);
      const skipDeprecated =
        "deprecated" in options &&
        options.deprecated === "skip" &&
        isDeprecated(value);
      if (skipDirective || skipDeprecated) {
        return "";
      }
      const v = getTypeName(value);
      const d = isDeprecated(value) ? ` @${DEPRECATED}` : "";
      return `  ${v}${d}`;
    })
    .filter((value) => value.length > 0)
    .join(MARKDOWN_EOL);
  code += `${MARKDOWN_EOL}}`;

  return code;
};
