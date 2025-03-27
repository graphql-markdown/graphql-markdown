/**
 * Library for introspecting a GraphQL schema.
 * The entry point method is {@link getSchemaMap}.
 *
 * @packageDocumentation
 */

import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  isNamedType,
} from "graphql/type";

import { DirectiveLocation, Kind, OperationTypeNode } from "graphql/language";

import { getDirectiveValues } from "graphql/execution";

import type {
  ASTNode,
  AstNodeType,
  DirectiveNode,
  GraphQLDirective,
  GraphQLFieldMap,
  GraphQLInputFieldMap,
  GraphQLNamedType,
  GraphQLOperationType,
  GraphQLSchema,
  Maybe,
  SchemaEntity,
  SchemaMap,
} from "@graphql-markdown/types";

import { convertArrayToMapObject, toString } from "@graphql-markdown/utils";

import { instanceOf } from "./guard";

export { printSchema } from "graphql/utilities";
export { getNamedType, getNullableType, GraphQLSchema } from "graphql/type";
export { parse, print } from "graphql/language";

/**
 *
 * @example
 */
export class IntrospectionError extends Error {}

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
export const getTypeFromSchema = <T>(
  schema: Maybe<GraphQLSchema>,
  type: unknown,
): Maybe<Record<string, T>> => {
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
    .filter((key) => {
      return excludeListRegExp.test(key);
    })
    .filter((key) => {
      return instanceOf(typeMap[key], type as never);
    })
    .reduce((res, key) => {
      return { ...res, [key]: typeMap[key] };
    }, {});
};

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
export const hasAstNode = <T>(node: T): node is AstNodeType<T> => {
  return typeof (node as Record<string, unknown>)["astNode"] === "object";
};

/**
 *
 */
export const getDirectiveLocationForASTPath = (
  appliedTo: Maybe<ASTNode>,
): DirectiveLocation => {
  if (!appliedTo || !("kind" in appliedTo)) {
    throw new IntrospectionError("Unexpected kind: " + String(appliedTo));
  }

  switch (appliedTo.kind) {
    case Kind.FIELD:
      return DirectiveLocation.FIELD;
    case Kind.SCHEMA_DEFINITION:
    case Kind.SCHEMA_EXTENSION:
      return DirectiveLocation.SCHEMA;
    case Kind.SCALAR_TYPE_DEFINITION:
    case Kind.SCALAR_TYPE_EXTENSION:
      return DirectiveLocation.SCALAR;
    case Kind.OBJECT_TYPE_DEFINITION:
    case Kind.OBJECT_TYPE_EXTENSION:
      return DirectiveLocation.OBJECT;
    case Kind.FIELD_DEFINITION:
      return DirectiveLocation.FIELD_DEFINITION;
    case Kind.INTERFACE_TYPE_DEFINITION:
    case Kind.INTERFACE_TYPE_EXTENSION:
      return DirectiveLocation.INTERFACE;
    case Kind.UNION_TYPE_DEFINITION:
    case Kind.UNION_TYPE_EXTENSION:
      return DirectiveLocation.UNION;
    case Kind.ENUM_TYPE_DEFINITION:
    case Kind.ENUM_TYPE_EXTENSION:
      return DirectiveLocation.ENUM;
    case Kind.ENUM_VALUE_DEFINITION:
      return DirectiveLocation.ENUM_VALUE;
    case Kind.INPUT_OBJECT_TYPE_DEFINITION:
    case Kind.INPUT_OBJECT_TYPE_EXTENSION:
      return DirectiveLocation.INPUT_OBJECT;
    case Kind.INPUT_VALUE_DEFINITION:
    case Kind.ARGUMENT:
      return DirectiveLocation.ARGUMENT_DEFINITION;
    // Not reachable, all possible types have been considered.
    default:
      throw new IntrospectionError(
        "Unexpected kind: " + String(appliedTo.kind),
      );
  }
};

/** Check if a directive can be applied to specific schema entity location.
 *
 * @param entity - a GraphQL schema entity.
 * @param directive - a directive name.
 *
 * @returns `true` if the entity is a valid directive location, else `false`.
 *
 */
export const isValidDirectiveLocation = (
  entity: unknown,
  directive: GraphQLDirective,
): boolean => {
  if (!hasAstNode(entity)) {
    return false;
  }
  const location = getDirectiveLocationForASTPath(entity.astNode);
  return directive.locations.includes(location);
};

/**
 * Checks if a schema entity as a directive belonging to a defined set.
 *
 * @param entity - a GraphQL schema entity.
 * @param directives - a directive name or a list of directive names.
 * @param fallback - default value if the entity type is not a valid location for directives.
 *
 * @returns `true` if the entity has at least one directive matching, else `false`.
 *
 */
export const hasDirective = (
  entity: unknown,
  directives: Maybe<GraphQLDirective[]>,
  fallback: boolean = false,
): boolean => {
  if (
    !hasAstNode(entity) ||
    !directives ||
    !Array.isArray(entity.astNode.directives) ||
    directives.length < 1
  ) {
    return fallback;
  }
  return (
    directives.findIndex((directive) => {
      // if the directive location is not applicable to entity then skip it
      if (!isValidDirectiveLocation(entity, directive)) {
        return fallback;
      }
      return (
        entity.astNode.directives &&
        entity.astNode.directives.findIndex((directiveNode: DirectiveNode) => {
          return directive.name === directiveNode.name.value;
        }) > -1
      );
    }) > -1
  );
};

/**
 * Returns a schema entity's list of directives matching a defined set.
 *
 * @param entity - a GraphQL schema entity.
 * @param directives - a directive name or a list of directive names.
 *
 * @returns a list of GraphQL directives matching the set, else `false`.
 *
 */
export const getDirective = (
  entity: unknown,
  directives: Maybe<GraphQLDirective[]>,
): GraphQLDirective[] => {
  if (
    !hasAstNode(entity) ||
    !directives ||
    !Array.isArray(entity.astNode.directives)
  ) {
    return [];
  }

  return directives.filter((directive): boolean => {
    return (
      (entity.astNode.directives &&
        entity.astNode.directives.findIndex((directiveNode: DirectiveNode) => {
          return directiveNode.name.value === directive.name;
        }) > -1) ??
      false
    );
  });
};

/**
 * Returns all directive's arguments' values linked to a GraphQL schema type.
 *
 * @param directive - a GraphQL directive defined in the schema.
 * @param type - the GraphQL schema type to parse.
 *
 * @returns a record k/v with arguments' name as keys and arguments' value.
 *
 */
export const getTypeDirectiveValues = (
  directive: GraphQLDirective,
  type: unknown,
): Maybe<Record<string, unknown>> => {
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
};

/**
 * Returns one directive's argument's value linked to a GraphQL schema type.
 * It calls {@link getTypeDirectiveValues} and returns a matching record.
 *
 * @param directive - a GraphQL directive defined in the schema.
 * @param type - the GraphQL schema type to parse.
 * @param argName - the name of the GraphQL directive argument to fetch the value from.
 *
 * @returns a record k/v with `argName` as key and the argument's value.
 *
 */
export const getTypeDirectiveArgValue = (
  directive: GraphQLDirective,
  node: unknown,
  argName: string,
): Maybe<Record<string, unknown> | string> => {
  const args = getTypeDirectiveValues(directive, node);

  if (!args?.[argName]) {
    throw new IntrospectionError(`Directive argument '${argName}' not found!`);
  }

  return args[argName] as Maybe<Record<string, unknown> | string>;
};

/**
 * Returns the fields from a GraphQL schema type.
 *
 * @internal
 *
 * see {@link getOperation}, {@link getFields}
 *
 * @param type - the GraphQL schema type to parse.
 * @param processor - optional callback function to parse the fields map.
 * @param fallback - optional fallback value, `undefined` if not set.
 *
 * @returns a map of fields as k/v records, or `fallback` value if no fields available.
 *
 */
export const _getFields = <T, V>(
  type: T,
  /**
   * @param fieldMap - a field map to be processed.
   * @returns a new field map.
   */
  processor?: (fieldMap: Record<string, unknown>) => V,
  fallback?: V,
):
  | GraphQLFieldMap<unknown, unknown>
  | GraphQLInputFieldMap
  | GraphQLObjectType
  | V => {
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

  if (typeof processor === "function") {
    return processor(fieldMap);
  }

  return fieldMap;
};

/**
 * Returns fields map for a GraphQL operation type (query, mutation, subscription...).
 *
 * @internal
 *
 * see {@link getSchemaMap}
 *
 * @param operationType - the operation type to parse.
 *
 * @returns a map of fields as k/v records.
 *
 */
export const getOperation = (
  operationType?: unknown,
): Record<string, GraphQLOperationType> => {
  return _getFields(
    operationType,
    (fieldMap) => {
      return Object.keys(fieldMap).reduce((res, key) => {
        return { ...res, [key]: fieldMap[key] };
      }, {});
    },
    {},
  ) as Record<string, GraphQLOperationType>;
};

/**
 * Returns fields map for a GraphQL schema type.
 *
 * see {@link getSchemaMap}
 *
 * @param type - the GraphQL schema type to parse.
 *
 * @returns a list of fields of type object.
 *
 */
export const getFields = (type: unknown): unknown[] => {
  return _getFields(
    type,
    (fieldMap) => {
      const res: unknown[] = [];
      Object.keys(fieldMap).forEach((name: string) => {
        return res.push(fieldMap[name]);
      });
      return res;
    },
    [],
  ) as unknown[];
};

/**
 * Resolves the name of a GraphQL schema type.
 *
 * @param getTypeName - the GraphQL schema type to parse.
 * @param defaultName - optional fallback value if the name resolution fails.
 *
 * @returns the type's name, or `defaultName`.
 *
 */
export const getTypeName = (
  type: unknown,
  defaultName: string = "",
): string => {
  if (!(typeof type === "object" && type !== null)) {
    return defaultName;
  }

  if ("name" in type) {
    return toString(type.name);
  }

  if ("toString" in type && typeof type.toString === "function") {
    return toString(type);
  }

  return defaultName;
};

/**
 * Returns an introspection map of the GraphQL schema.
 * This is the entry point for GraphQL-Markdown schema parsing features.
 *
 * @param schema - a GraphQL schema.
 *
 * @returns a schema map by GraphQL entities (see {@link SchemaEntity}).
 *
 * @example
 * ```js
 * import { buildSchema } from "graphql";
 * import { getSchemaMap } from "@graphql-markdown/utils/graphql";
 *
 * const schema = buildSchema(`
 *   interface Record {
 *     id: String!
 *   }
 *   type StudyItem implements Record {
 *     id: String!
 *     subject: String!
 *     duration: Int!
 *   }
 *   type Query {
 *     getStudyItems(subject: String): [StudyItem!]
 *     getStudyItem(id: String!): StudyItem
 *   }
 *   type Mutation {
 *     addStudyItem(subject: String!, duration: Int!): StudyItem
 *   }
 *   type Subscription {
 *     listStudyItems: [StudyItem!]
 *   }
 * `);
 *
 * const schemaTypeMap = getSchemaMap(schema);
 *
 * // expected result: {
 * //   queries: {
 * //     getStudyItems: GraphQLField,
 * //     getStudyItem: GraphQLField,
 * //   },
 * //   mutations: {
 * //     addStudyItem: GraphQLField,
 * //   },
 * //   subscriptions: {
 * //     listStudyItems: GraphQLField,
 * //   }
 * //   directives: {
 * //     include: GraphQLDirective,
 * //     skip: GraphQLDirective,
 * //     deprecated: GraphQLDirective,
 * //     specifiedBy: GraphQLDirective,
 * //   objects: {
 * //     StudyItem: GraphQLObjectType,
 * //   unions: {},
 * //   interfaces: {
 * //     Record: GraphQLInterfaceType,
 * //   enums: {},
 * //   inputs: {},
 * //   scalars: {
 * //     String: GraphQLScalarType,
 * //     Int: GraphQLScalarType,
 * //     Boolean: GraphQLScalarType,
 * //   }
 * // }
 * ```
 *
 */
export const getSchemaMap = (schema: Maybe<GraphQLSchema>): SchemaMap => {
  return {
    ["queries" as SchemaEntity]: getOperation(
      schema?.getQueryType() ?? undefined,
    ),
    ["mutations" as SchemaEntity]: getOperation(
      schema?.getMutationType() ?? undefined,
    ),
    ["subscriptions" as SchemaEntity]: getOperation(
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
};
