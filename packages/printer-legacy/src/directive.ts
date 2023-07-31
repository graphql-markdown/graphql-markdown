import { getConstDirectiveMap } from "@graphql-markdown/utils";

import {
  HEADER_SECTION_LEVEL,
  HEADER_SECTION_SUB_LEVEL,
  MARKDOWN_EOL,
  MARKDOWN_EOP,
} from "./const/strings";
import { Link } from "./link";
import { Badge, printBadge } from "./badge";
import { GraphQLArgument, GraphQLEnumValue, GraphQLField, GraphQLNamedType } from "graphql";
import { Options } from "./const/options";
import { MDXString } from "./const/mdx";

export const printCustomDirectives = (type: GraphQLNamedType, options: Options) => {
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
}

export const printCustomDirective = (type: GraphQLNamedType, constDirectiveOption: { type: GraphQLNamedType } & Record<string, Function>, options: Options): string | undefined => {
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
}

export const getCustomTags = (type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue, options: Options): Badge[] => {
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
}

export const printCustomTags = (type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue, options: Options): string | MDXString => {
  const badges = getCustomTags(type, options);

  if (badges.length === 0) {
    return "";
  }

  return badges.map((badge) => printBadge(badge)).join(" ") as MDXString;
};

export const getCustomDirectiveResolver = (
  resolver: string,
  type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue,
  constDirectiveOption: { type: GraphQLNamedType } & Record<string, Function>,
  fallback: string | undefined = undefined,
): string | undefined => {
  if (
    typeof constDirectiveOption === "undefined" ||
    typeof constDirectiveOption[resolver] !== "function"
  ) {
    return fallback;
  }

  return constDirectiveOption[resolver](constDirectiveOption.type, type);
}
