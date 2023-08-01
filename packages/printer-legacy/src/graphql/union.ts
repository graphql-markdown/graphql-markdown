import { isUnionType, getTypeName } from "@graphql-markdown/utils";

import { printSection } from "../section";
import { Options } from "../const/options";

export const printUnionMetadata = (type: unknown, options: Options) => {
  if (!isUnionType(type)) {
    return "";
  }

  return printSection(type.getTypes(), "Possible types", {
    ...options,
    parentType: type.name,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const printCodeUnion = (type: unknown, options?: Options) => {
  if (!isUnionType(type)) {
    return "";
  }

  let code = `union ${getTypeName(type)} = `;
  code += type
    .getTypes()
    .map((v) => getTypeName(v))
    .join(" | ");

  return code;
};
