/**
 * Library supporting `groupByDirective` for grouping GraphQL schema entities.
 *
 * @see [Option `groupByDirective`](https://graphql-markdown.dev/docs/advanced/group-by-directive)
 *
 * @packageDocumentation
 */

import type {
  ConstArgumentNode,
  ConstDirectiveNode,
  StringValueNode,
} from "graphql/language";
import { Kind } from "graphql/language";

import type {
  SchemaMap,
  GroupByDirectiveOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
  Maybe,
} from "@graphql-markdown/types";

import { hasAstNode } from "./introspection";

/**
 * Gets the group name for a schema type based on the directive information.
 *
 * @param type - a GraphQL schema named type
 * @param groupByDirective - the `groupByDirective` option.
 *
 * @returns the group name matching the type, or `groupByDirective.fallback` if no match found.
 *
 * @example
 * ```js
 * import { buildSchema } from "graphql";
 * import { getGroupName } from "@graphql-markdown/utils/groups";
 *
 * const schema = buildSchema(`
 *   directive @doc(
 *     category: String
 *   ) on OBJECT | INPUT_OBJECT | UNION | ENUM | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION
 *   type Unicorn {
 *     name: String!
 *   }
 *   type Bird @doc(category: "animal") {
 *     name: String!
 *   }
 *   type Fish {
 *     name: String!
 *   }
 *   type Elf @doc(category: "fantasy") {
 *     name: String!
 *   }
 *   type Query {
 *     Fish: [Fish!]! @doc(category: "animal")
 *   }
 * `);
 *
 * const groupOptions = {
 *   fallback: "common",
 *   directive: "doc",
 *   field: "category",
 * }
 *
 * getGroupName(schema.getType("Bird"), groupOptions); // Expected result: "animal"
 *
 * getGroupName(schema.getType("Unicorn"), groupOptions); // Expected result: "common"
 *
 * ```
 */
export const getGroupName = <T>(
  type: T,
  groupByDirective: Maybe<GroupByDirectiveOptions>,
): Maybe<string> => {
  if (!type || !groupByDirective) {
    return undefined;
  }

  if (!hasAstNode(type)) {
    return groupByDirective.fallback;
  }

  const allDirectives = type.astNode.directives as Maybe<ConstDirectiveNode[]>;

  if (!Array.isArray(allDirectives)) {
    return groupByDirective.fallback;
  }

  for (const directive of allDirectives) {
    if (
      !directive.arguments ||
      directive.name.value !== groupByDirective.directive
    ) {
      continue;
    }
    const field = directive.arguments.find(({ name, value }): boolean => {
      return (
        name.value === groupByDirective.field && value.kind === Kind.STRING
      );
    }) as Maybe<ConstArgumentNode & { value: StringValueNode }>;
    return field?.value.value;
  }

  return groupByDirective.fallback;
};

/**
 * Parses a GraphQL schema to build a map of entities with matching `groupByDirective` option.
 *
 * @param schemaMap - the GraphQL schema map returned by {@link introspection!getSchemaMap}
 * @param groupByDirective - the `groupByDirective` option.
 *
 * @returns a map of entities with matching group name.
 *
 * @example
 * ```js
 * import { buildSchema } from "graphql";
 * import { getGroups } from "@graphql-markdown/utils/groups";
 *
 * const schema = buildSchema(`
 *   directive @doc(
 *     category: String
 *   ) on OBJECT | INPUT_OBJECT | UNION | ENUM | INTERFACE | FIELD_DEFINITION | ARGUMENT_DEFINITION
 *   type Unicorn {
 *     name: String!
 *   }
 *   type Bird @doc(category: "animal") {
 *     name: String!
 *   }
 *   type Fish {
 *     name: String!
 *   }
 *   type Elf @doc(category: "fantasy") {
 *     name: String!
 *   }
 *   type Query {
 *     Fish: [Fish!]! @doc(category: "animal")
 *   }
 * `);
 *
 *
 * const schemaMap = {
 *   objects: schema.getTypeMap(),
 *   queries: schema.getQueryType()?.getFields(),
 * };
 *
 * const groupOptions = {
 *   fallback: "common",
 *   directive: "doc",
 *   field: "category",
 * }
 *
 * const groupsMap = getGroups(schemaMap, groupOptions);
 *
 * // Expected result: {
 * //   "objects": {
 * //     "Bird": "animal",
 * //     "Boolean": "common",
 * //     "Elf": "fantasy",
 * //     "Fish": "common",
 * //     "Query": "common",
 * //     "String": "common",
 * //     "Unicorn": "common",
 * //   },
 * //   "queries": {
 * //     "Fish": "animal",
 * //   },
 * // }
 * ```
 *
 */
export const getGroups = (
  schemaMap: SchemaMap,
  groupByDirective: Maybe<GroupByDirectiveOptions>,
): Maybe<SchemaEntitiesGroupMap> => {
  const groups: SchemaEntitiesGroupMap = {};

  if (!groupByDirective) {
    return undefined;
  }

  Object.keys(schemaMap).forEach((typeName) => {
    const rootType = schemaMap[typeName as SchemaEntity];
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
};
