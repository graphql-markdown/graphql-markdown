import type {
  SchemaEntitiesGroupMap,
  SchemaEntity,
  GraphQLType,
  GraphQLNamedType,
  Maybe,
} from "@graphql-markdown/types";

import { toSlug, getNamedType } from "@graphql-markdown/utils";

export const getGroup = (
  type: unknown,
  groups: Maybe<SchemaEntitiesGroupMap>,
  typeCategory: Maybe<SchemaEntity>,
): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    typeof groups === "undefined" ||
    groups === null ||
    typeof typeCategory === "undefined" ||
    typeCategory === null
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
