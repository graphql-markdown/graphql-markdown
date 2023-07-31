import { GraphQLArgument, GraphQLNamedType, GraphQLType } from "graphql/type/definition";

import {
  toSlug,
  getNamedType,
  SchemaEntitiesGroupMap,
  SchemaEntities,
} from "@graphql-markdown/utils";

export const getGroup = (type: GraphQLNamedType | GraphQLArgument, groups: SchemaEntitiesGroupMap | undefined, typeCategory: SchemaEntities): string => {
  if (typeof groups === "undefined") {
    return "";
  }
  const graphLQLNamedType = getNamedType(type as unknown as GraphQLType);
  const typeName = graphLQLNamedType.name || graphLQLNamedType.toString();
  return typeCategory in groups && typeof groups[typeCategory] !== "undefined" && typeName in groups[typeCategory]! && typeof groups[typeCategory]![typeName] !== "undefined"
    ? toSlug(groups[typeCategory]![typeName]!)
    : "";
};
