import { GraphQLArgument, GraphQLEnumValue, GraphQLField, GraphQLNamedType } from "graphql";

import {
  isDeprecated,
  getConstDirectiveMap,
  hasProperty,
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
import { Options } from "./const/options";
import { MDXString } from "./const/mdx";

export const printCustomDirectives = (type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue, options: Options): string => {
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

export const formatDescription = (type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue, replacement: string = NO_DESCRIPTION_TEXT): string | MDXString => {
  const description =
    hasProperty(type, "description") && typeof type.description === "string"
      ? escapeMDX(type.description)
      : replacement;
  return `${MARKDOWN_EOP}${description}`;
};

export const printDeprecation = (type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue): string => {
  if (isDeprecated(type) === false) {
    return "";
  }

  const reason = "deprecationReason" in type &&
    typeof type.deprecationReason === "string"
      ? type.deprecationReason + MARKDOWN_EOL
      : "";

  return `${MARKDOWN_EOP}:::caution ${DEPRECATED.toUpperCase()}${MARKDOWN_EOL}${reason}:::`;
};

export const printDescription = (type: GraphQLNamedType | GraphQLArgument | GraphQLField<any, any, any> | GraphQLEnumValue, options: Options, noText?: string): string | MDXString => {
  const description = formatDescription(type, noText);
  const customDirectives = printCustomDirectives(type, options);
  const deprecation = printDeprecation(type);
  return `${deprecation}${description}${customDirectives}`;
};
