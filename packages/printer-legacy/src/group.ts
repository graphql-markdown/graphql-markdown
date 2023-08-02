import type {
  SchemaEntitiesGroupMap,
  SchemaEntity,
  GraphQLType,
  GraphQLNamedType,
} from "@graphql-markdown/types";

import { toSlug, getNamedType } from "@graphql-markdown/utils";

export const getGroup = (
  type: unknown,
  groups: SchemaEntitiesGroupMap | undefined,
  typeCategory: SchemaEntity | undefined,
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
