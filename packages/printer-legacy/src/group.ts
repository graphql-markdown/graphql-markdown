import type {
  SchemaEntitiesGroupMap,
  SchemaEntity,
  GraphQLType,
  Maybe,
} from "@graphql-markdown/types";

import { getNamedType } from "@graphql-markdown/graphql";

import { slugify } from "@graphql-markdown/utils";

/**
 *
 */
export const getGroup = (
  type: unknown,
  groups: Maybe<SchemaEntitiesGroupMap>,
  typeCategory: Maybe<SchemaEntity>,
): string => {
  if (
    typeof type !== "object" ||
    type === null ||
    typeof groups !== "object" ||
    groups === null ||
    !typeCategory
  ) {
    return "";
  }

  const graphQLNamedType = getNamedType(type as Maybe<GraphQLType>);

  if (!graphQLNamedType) {
    return "";
  }

  const typeName =
    "name" in graphQLNamedType
      ? graphQLNamedType.name
      : String(graphQLNamedType);

  if (!(typeCategory in groups && typeName in groups[typeCategory]!)) {
    return "";
  }

  return slugify(groups[typeCategory]![typeName]);
};
