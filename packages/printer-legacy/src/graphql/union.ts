import {
  isUnionType,
  getTypeName,
  GraphQLUnionType,
} from "@graphql-markdown/utils";

import { printSection } from "../section";
import { PrintTypeOptions } from "../const/options";

export const printUnionMetadata = (
  type: unknown,
  options: PrintTypeOptions,
) => {
  if (!isUnionType(type)) {
    return "";
  }

  return printSection((<GraphQLUnionType>type).getTypes(), "Possible types", {
    ...options,
    parentType: (<GraphQLUnionType>type).name,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const printCodeUnion = (type: unknown, options?: PrintTypeOptions) => {
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
