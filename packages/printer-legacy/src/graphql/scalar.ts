import { getTypeName } from "@graphql-markdown/utils";

import { HEADER_SECTION_LEVEL, MARKDOWN_EOP } from "../const/strings";
import { Options } from "../const/options";
import { MDXString } from "../const/mdx";

export const printSpecification = (type: unknown): string | MDXString => {
  if (typeof type !== "object" || type === null || !("specifiedByURL" in type) || !type.specifiedByURL) {
    return "";
  }

  const url = type.specifiedByURL;

  // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
  return `${HEADER_SECTION_LEVEL} <SpecifiedBy url="${url}"/>${MARKDOWN_EOP}` as MDXString;
};

export const printScalarMetadata = (type: unknown): string | MDXString => {
  return printSpecification(type);
};

export const printCodeScalar = (type: unknown, options?: Options): string => {
  return `scalar ${getTypeName(type)}`;
};

