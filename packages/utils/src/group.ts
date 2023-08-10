import type {
  SchemaMap,
  GroupByDirectiveOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
  Maybe,
} from "@graphql-markdown/types";

import { hasAstNode } from "./graphql";

export function getGroups(
  rootTypes: SchemaMap,
  groupByDirective: Maybe<GroupByDirectiveOptions>,
): Maybe<SchemaEntitiesGroupMap> {
  const groups: SchemaEntitiesGroupMap = {};

  if (!groupByDirective) {
    return undefined;
  }

  Object.keys(rootTypes).forEach((typeName) => {
    const rootType = rootTypes[typeName as SchemaEntity];
    if (rootType) {
      if (typeof groups[typeName as SchemaEntity] === "undefined") {
        groups[typeName as SchemaEntity] = {};
      }
      Object.keys(rootType).forEach((type) => {
        groups[typeName as SchemaEntity]![type] = getGroupName(
          rootType[type],
          groupByDirective,
        );
      });
    }
  });

  return groups;
}

export function getGroupName(
  type: unknown,
  groupByDirective: Maybe<GroupByDirectiveOptions>,
): Maybe<string> {
  if (!type || !groupByDirective) {
    return undefined;
  }

  if (!hasAstNode(type)) {
    return groupByDirective.fallback;
  }

  const allDirectives = type.astNode.directives;

  if (!Array.isArray(allDirectives)) {
    return groupByDirective.fallback;
  }

  for (const directive of allDirectives) {
    if (directive.name.value !== groupByDirective.directive) {
      continue;
    }
    const field = directive.arguments.find(
      ({ name }: { name: Record<string, string> }) =>
        name.value === groupByDirective.field,
    );
    return field.value.value;
  }

  return groupByDirective.fallback;
}
