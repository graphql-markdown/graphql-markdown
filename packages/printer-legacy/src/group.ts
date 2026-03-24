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

import { hasStringProperty, slugify } from "@graphql-markdown/utils";

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
  const typeName = hasStringProperty(graphQLNamedType, "name")
    ? graphQLNamedType.name
    : "";
  if (!typeName) {
    return "";
  }

  const categoryGroups = groups[typeCategory];
  if (!categoryGroups || !(typeName in categoryGroups)) {
    return "";
  }

  return slugify(categoryGroups[typeName]);
};
