import type { GraphQLSchema } from "graphql";
import {
  getDirectiveValues,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  isNamedType,
  OperationTypeNode,
} from "graphql";

import type {
  ASTNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  GraphQLFieldMap,
  GraphQLInputFieldMap,
  GraphQLNamedType,
  Maybe,
  ObjectTypeDefinitionNode,
  SchemaEntity,
  SchemaMap,
} from "@graphql-markdown/types";

import { convertArrayToMapObject } from "../array";
import { instanceOf } from "./guard";

export { getDirectiveValues, getNamedType, printSchema } from "graphql";

/**
 * Returns a map of GraphQL named types from a schema for a defined GraphQL type.
 * When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.
 *
 * @see {@link getSchemaMap}
 *
 * @internal
 *
 * @param schema - a GraphQL schema.
 * @param type - a GraphQL type, eg `GraphQLObjectType`.
 *
 * @returns a map of GraphQL named types for the matching GraphQL type, or undefined if no match.
 *
 */
export function getTypeFromSchema<T>(
  schema: Maybe<GraphQLSchema>,
  type: unknown,
): Maybe<Record<string, T>> {
  if (!schema) {
    return undefined;
  }

  const operationKinds: string[] = [];
  Object.values(OperationTypeNode).forEach((operationTypeNode) => {
    const operationType = schema.getRootType(
      operationTypeNode as OperationTypeNode,
    );
    if (operationType) {
      operationKinds.push(operationType.name);
    }
  });

  const filterOperationFragmentRegExp =
    operationKinds.length > 0 ? [...operationKinds, ""].join("$|") : "";
  const excludeListRegExp = new RegExp(
    `^(?!${filterOperationFragmentRegExp}__.+$).*$`,
  );

  const typeMap = schema.getTypeMap();

  return Object.keys(typeMap)
    .filter((key) => excludeListRegExp.test(key))
    .filter((key) => instanceOf(typeMap[key], type as never))
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
}

/**
 * Type guard for type with an AST node property.
 *
 * @internal
 *
 * @param node - a GraphQL schema named type.
 *
 * @returns `true` if the entity has an AST node property, else `false`.
 *
 */
export function hasAstNode<T>(
  node: T,
): node is Required<{ astNode: ObjectTypeDefinitionNode }> & T {
  return typeof (node as Record<string, unknown>)["astNode"] === "object";
}

/**
 * Checks if a schema entity as a directive belonging to a defined set.
 *
 * @param entity - a GraphQL schema entity.
 * @param directives - a directive name or a list of directive names.
 *
 * @returns `true` if the entity has at least one directive matching, else `false`.
 *
 */
export function hasDirective(
  entity: unknown,
  directives: Maybe<string[] | string>,
): boolean {
  if (
    !hasAstNode(entity) ||
    !directives ||
    !Array.isArray(entity.astNode.directives)
  ) {
    return false;
  }

  const directiveList = Array.isArray(directives) ? directives : [directives]; // backward_compatibility

  return (
    entity.astNode.directives.findIndex((directiveNode: DirectiveNode) =>
      directiveList.includes(directiveNode.name.value),
    ) > -1
  );
}

/**
 * Returns a schema entity's list of directives matching a defined set.
 *
 * @param entity - a GraphQL schema entity.
 * @param directives - a directive name or a list of directive names.
 *
 * @returns a list of GraphQL directives matching the set, else `false`.
 *
 */
export function getDirective(
  entity: unknown,
  directives: Maybe<string[] | string>,
): GraphQLDirective[] {
  if (
    !hasAstNode(entity) ||
    !directives ||
    !Array.isArray(entity.astNode.directives)
  ) {
    return [];
  }

  const directiveList = Array.isArray(directives) ? directives : [directives]; // backward_compatibility

  return entity.astNode.directives
    .filter((directiveNode: DirectiveDefinitionNode) =>
      directiveList.includes(directiveNode.name.value),
    )
    .map(
      (directiveNode: DirectiveDefinitionNode) =>
        new GraphQLDirective({
          name: directiveNode.name.value,
          description: directiveNode.description?.value,
          locations: [],
          extensions: undefined,
          astNode: directiveNode,
        }),
    );
}

/**
 *
 */
export function getTypeDirectiveArgValue(
  directive: GraphQLDirective,
  node: unknown,
  argName: string,
): Maybe<Record<string, unknown>> {
  const args = getTypeDirectiveValues(directive, node);

  if (!args || !args[argName]) {
    throw new Error(`Directive argument '${argName}' not found!`);
  }

  return args[argName] as Maybe<Record<string, unknown>>;
}

/**
 *
 * @param directive
 * @param type
 * @returns
 */
export function getTypeDirectiveValues(
  directive: GraphQLDirective,
  type: unknown,
): Maybe<Record<string, unknown>> {
  if (hasAstNode(type)) {
    return getDirectiveValues(
      directive,
      (type as GraphQLNamedType).astNode as {
        readonly directives?: readonly DirectiveNode[];
      },
    );
  }
  return getDirectiveValues(
    directive,
    type as ASTNode as {
      readonly directives?: readonly DirectiveNode[];
    },
  );
}

/**
 *
 * @internal
 *
 * @param type
 * @param processor
 * @param fallback
 *
 * @returns
 */
export function __getFields<T, V>(
  type: T,
  processor?: (fieldMap: Record<string, unknown>) => V,
  fallback?: V,
): GraphQLFieldMap<unknown, unknown> | GraphQLInputFieldMap | V {
  if (
    !(
      typeof type === "object" &&
      type !== null &&
      "getFields" in type &&
      isNamedType(type)
    )
  ) {
    return fallback as V;
  }

  const fieldMap = type.getFields();

  if (typeof processor !== "undefined") {
    return processor(fieldMap);
  }

  return fieldMap;
}

export function getIntrospectionFieldsList(
  queryType?: unknown,
): Record<string, unknown> {
  return __getFields(
    queryType,
    (fieldMap) =>
      Object.keys(fieldMap).reduce(
        (res, key) => ({ ...res, [key]: fieldMap[key] }),
        {},
      ),
    {},
  ) as Record<string, unknown>;
}

export function getFields(type: unknown): unknown[] {
  return __getFields(
    type,
    (fieldMap) => {
      const res: unknown[] = [];
      Object.keys(fieldMap).forEach((name: string) => res.push(fieldMap[name]));
      return res;
    },
    [],
  ) as unknown[];
}

export function getTypeName(type: unknown, defaultName: string = ""): string {
  if (!(typeof type === "object" && type !== null)) {
    return defaultName;
  }

  if ("name" in type) {
    return String(type.name);
  }

  if ("toString" in type && typeof type.toString === "function") {
    return String(type);
  }

  return defaultName;
}

export function getSchemaMap(schema: Maybe<GraphQLSchema>): SchemaMap {
  return {
    ["queries" as SchemaEntity]: getIntrospectionFieldsList(
      schema?.getQueryType() ?? undefined,
    ),
    ["mutations" as SchemaEntity]: getIntrospectionFieldsList(
      schema?.getMutationType() ?? undefined,
    ),
    ["subscriptions" as SchemaEntity]: getIntrospectionFieldsList(
      schema?.getSubscriptionType() ?? undefined,
    ),
    ["directives" as SchemaEntity]: convertArrayToMapObject<GraphQLDirective>(
      schema?.getDirectives() as GraphQLDirective[],
    ),
    ["objects" as SchemaEntity]: getTypeFromSchema<GraphQLObjectType>(
      schema,
      GraphQLObjectType,
    ),
    ["unions" as SchemaEntity]: getTypeFromSchema<GraphQLUnionType>(
      schema,
      GraphQLUnionType,
    ),
    ["interfaces" as SchemaEntity]: getTypeFromSchema<GraphQLInterfaceType>(
      schema,
      GraphQLInterfaceType,
    ),
    ["enums" as SchemaEntity]: getTypeFromSchema<GraphQLEnumType>(
      schema,
      GraphQLEnumType,
    ),
    ["inputs" as SchemaEntity]: getTypeFromSchema<GraphQLInputObjectType>(
      schema,
      GraphQLInputObjectType,
    ),
    ["scalars" as SchemaEntity]: getTypeFromSchema<GraphQLScalarType>(
      schema,
      GraphQLScalarType,
    ),
  };
}
