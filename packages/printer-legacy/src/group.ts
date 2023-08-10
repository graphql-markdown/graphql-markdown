import type {
  SchemaEntitiesGroupMap,
  SchemaEntity,
  GraphQLType,
  Maybe,
  GraphQLNamedType,
} from "@graphql-markdown/types";

import { toSlug, getNamedType } from "@graphql-markdown/utils";

export const getGroup = (
  type: unknown,
  groups: Maybe<SchemaEntitiesGroupMap>,
  typeCategory: Maybe<SchemaEntity>,
): string => {
  if (typeof type !== "object" || type === null || !groups || !typeCategory) {
    return "";
  }

  const graphLQLNamedType: GraphQLNamedType = getNamedType(
    type as Maybe<GraphQLType>,
  )!;
  const typeName = graphLQLNamedType.name || graphLQLNamedType.toString();

  return typeCategory in groups &&
    groups[typeCategory] &&
    typeName in groups[typeCategory]! &&
    groups[typeCategory]![typeName]
    ? toSlug(groups[typeCategory]![typeName]!)
    : "";
};
