import { GraphQLNamedType, GraphQLType } from "graphql/type/definition";

import {
  toSlug,
  getNamedType,
  SchemaEntitiesGroupMap,
  SchemaEntities,
} from "@graphql-markdown/utils";

export const getGroup = (
  type: unknown,
  groups: SchemaEntitiesGroupMap | undefined,
  typeCategory: SchemaEntities | undefined,
): string => {
  if (
    typeof type !== "object" ||
    typeof groups === "undefined" ||
    typeof typeCategory == "undefined"
  ) {
    return "";
  }
  const graphLQLNamedType = getNamedType(
    type as GraphQLType,
  ) as GraphQLNamedType;
  const typeName = graphLQLNamedType.name || graphLQLNamedType.toString();
  return typeCategory in groups &&
    typeof groups[typeCategory] !== "undefined" &&
    typeName in groups[typeCategory]! &&
    typeof groups[typeCategory]![typeName] !== "undefined"
    ? toSlug(groups[typeCategory]![typeName]!)
    : "";
};
