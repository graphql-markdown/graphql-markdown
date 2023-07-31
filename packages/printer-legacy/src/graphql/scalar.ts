import { GraphQLScalarType } from "graphql";

import { getTypeName } from "@graphql-markdown/utils";

import { HEADER_SECTION_LEVEL, MARKDOWN_EOP } from "../const/strings";
import { Options } from "../const/options";
import { MDXString } from "../const/mdx";

export const printSpecification = (type: GraphQLScalarType): string | MDXString => {
  if (!type.specifiedByURL) {
    return "";
  }

  const url = type.specifiedByURL;

  // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
  return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}` as MDXString;
};

export const printScalarMetadata = (type: GraphQLScalarType): string | MDXString => {
  return printSpecification(type);
};

export const printCodeScalar = (type: GraphQLScalarType, options?: Options): string => {
  return `scalar ${getTypeName(type)}`;
};

