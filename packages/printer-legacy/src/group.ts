/**
 * Utility module for handling GraphQL schema entity grouping.
 * @module
 */
import type {
  SchemaEntitiesGroupMap,
  SchemaEntity,
  GraphQLType,
  Maybe,
} from "@graphql-markdown/types";

import { getNamedType } from "@graphql-markdown/graphql";

import { slugify } from "@graphql-markdown/utils";

/**
 * Retrieves the group name for a given GraphQL type based on its category and group mapping.
 *
 * @param type - The GraphQL type to get the group for
 * @param groups - Mapping of schema entities to their group names
 * @param typeCategory - The category of the schema entity
 * @returns The slugified group name or empty string if no group is found
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
