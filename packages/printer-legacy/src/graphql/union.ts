import { GraphQLObjectType, GraphQLUnionType } from "graphql";

import { isUnionType, getTypeName } from "@graphql-markdown/utils";

import { printSection } from "../section";
import { Options } from "../const/options";

export const printUnionMetadata = (type: GraphQLUnionType, options: Options) => {
  return printSection(type.getTypes() as GraphQLObjectType<any, any>[], "Possible types", {
    ...options,
    parentType: type.name,
  });
};

export const printCodeUnion = (type: GraphQLUnionType, options?: Options) => {
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
