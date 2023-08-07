import type {
  PrintTypeOptions,
  GraphQLUnionType,
  MDXString,
} from "@graphql-markdown/types";

import { isUnionType, getTypeName } from "@graphql-markdown/utils";

import { printSection } from "../section";

export const printUnionMetadata = (
  type: unknown,
  options: PrintTypeOptions,
): string | MDXString => {
  if (!isUnionType(type)) {
    return "";
  }

  return printSection((<GraphQLUnionType>type).getTypes(), "Possible types", {
    ...options,
    parentType: (<GraphQLUnionType>type).name,
  });
};

export const printCodeUnion = (
  type: unknown,
  options?: PrintTypeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): string => {
  if (!isUnionType(type)) {
    return "";
  }

  let code = `union ${getTypeName(type)} = `;
  code += (<GraphQLUnionType>type)
    .getTypes()
    .map((v) => getTypeName(v))
    .join(" | ");

  return code;
};
