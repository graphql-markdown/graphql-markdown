import type { PrintTypeOptions, MDXString } from "@graphql-markdown/types";

import { getTypeName } from "@graphql-markdown/graphql";

import { MARKDOWN_EOP } from "../const/strings";
import { SectionLevels } from "../const/options";
import { formatMDXSpecifiedByLink } from "../mdx";

export const printSpecification = (type: unknown): MDXString | string => {
  if (
    typeof type !== "object" ||
    type === null ||
    !("specifiedByURL" in type) ||
    typeof type.specifiedByURL !== "string"
  ) {
    return "";
  }

  const url = type.specifiedByURL;

  // Needs newline between "export const specifiedByLinkCss" and markdown header to prevent compilation error in docusaurus
  return `${SectionLevels.LEVEL_3} ${formatMDXSpecifiedByLink(url)}${MARKDOWN_EOP}` as MDXString;
};

export const printScalarMetadata = (
  type: unknown,
  options?: PrintTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): MDXString | string => {
  return printSpecification(type);
};

export const printCodeScalar = (
  type: unknown,
  options?: PrintTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): string => {
  return `scalar ${getTypeName(type)}`;
};
