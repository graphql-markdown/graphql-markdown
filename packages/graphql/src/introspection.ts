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
  getNamedType,
  isObjectType,
  isNamedType,
} from "graphql/type";
import type { GraphQLType } from "graphql/type";

import { DirectiveLocation, OperationTypeNode } from "graphql/language";

import { getDirectiveValues } from "graphql/execution";

import type {
  ASTNode,
  AstNodeType,
  DirectiveNode,
  GraphQLDirective,
  GraphQLNamedType,
  GraphQLOperationType,
  GraphQLSchema,
  Maybe,
  OperationKind,
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
 * @returns a map of GraphQL named types for the matching GraphQL type, or `undefined` if no match.
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

  const kindToLocation: Partial<Record<ASTNode["kind"], DirectiveLocation>> = {
    Field: DirectiveLocation.FIELD,
    SchemaDefinition: DirectiveLocation.SCHEMA,
    SchemaExtension: DirectiveLocation.SCHEMA,
    ScalarTypeDefinition: DirectiveLocation.SCALAR,
    ScalarTypeExtension: DirectiveLocation.SCALAR,
    ObjectTypeDefinition: DirectiveLocation.OBJECT,
    ObjectTypeExtension: DirectiveLocation.OBJECT,
    FieldDefinition: DirectiveLocation.FIELD_DEFINITION,
    InterfaceTypeDefinition: DirectiveLocation.INTERFACE,
    InterfaceTypeExtension: DirectiveLocation.INTERFACE,
    UnionTypeDefinition: DirectiveLocation.UNION,
    UnionTypeExtension: DirectiveLocation.UNION,
    EnumTypeDefinition: DirectiveLocation.ENUM,
    EnumTypeExtension: DirectiveLocation.ENUM,
    EnumValueDefinition: DirectiveLocation.ENUM_VALUE,
    InputObjectTypeDefinition: DirectiveLocation.INPUT_OBJECT,
    InputObjectTypeExtension: DirectiveLocation.INPUT_OBJECT,
    InputValueDefinition: DirectiveLocation.ARGUMENT_DEFINITION,
    Argument: DirectiveLocation.ARGUMENT_DEFINITION,
  };

  const location = kindToLocation[appliedTo.kind];
  if (!location) {
    throw new IntrospectionError("Unexpected kind: " + String(appliedTo.kind));
  }

  return location;
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
  return directives.some((directive) => {
    // if the directive location is not applicable to entity then return fallback
    if (!isValidDirectiveLocation(entity, directive)) {
      return fallback;
    }
    return (
      entity.astNode.directives?.some((directiveNode: DirectiveNode) => {
        return directive.name === directiveNode.name.value;
      }) ?? false
    );
  });
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
      entity.astNode.directives?.some((directiveNode: DirectiveNode) => {
        return directiveNode.name.value === directive.name;
      }) ?? false
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
      directive as never,
      (type as GraphQLNamedType).astNode as {
        readonly directives?: readonly DirectiveNode[];
      },
    );
  }
  return getDirectiveValues(
    directive as never,
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
 * @param node - the GraphQL schema type to parse.
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
): Record<string, unknown> | V => {
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

  const fieldMap = type.getFields() as Record<string, unknown>;

  if (typeof processor === "function") {
    return processor(fieldMap);
  }

  return fieldMap;
};

/**
 * Derives a root operation kind from a GraphQL type name.
 *
 * @param typeName - Root operation type name (for example `Query`).
 * @returns The operation kind or `undefined` when it cannot be inferred.
 */
const getOperationKindFromTypeName = (
  typeName: string,
): Maybe<OperationKind> => {
  const lowerTypeName = typeName.toLowerCase();

  if (lowerTypeName.includes("query")) {
    return "query";
  }
  if (lowerTypeName.includes("mutation")) {
    return "mutation";
  }
  if (lowerTypeName.includes("subscription")) {
    return "subscription";
  }

  return undefined;
};

/**
 * Resolves the name of a GraphQL schema type.
 *
 * @param type - the GraphQL schema type to parse.
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
 * Checks whether a named type can be used as an operation namespace.
 *
 * @param type - GraphQL named type candidate.
 * @param operationKind - Root operation kind currently being traversed.
 * @param rootTypeName - Root operation type name that must not be treated as a namespace.
 * @returns `true` when the type is an object namespace compatible with the root kind.
 */
const isNestedOperationNamespaceType = (
  type: unknown,
  operationKind: Maybe<OperationKind>,
  rootTypeName: string,
): type is GraphQLObjectType => {
  if (!isObjectType(type)) {
    return false;
  }

  const typeName = getTypeName(type);
  if (
    typeName.startsWith("__") ||
    !operationKind ||
    typeName === rootTypeName
  ) {
    return false;
  }

  return typeName.toLowerCase().endsWith(operationKind);
};

/**
 * Recursively collects operation fields, including nested namespace fields,
 * into a flattened dotted-key map.
 *
 * @param fieldMap - Current GraphQL field map to process.
 * @param list - Accumulator receiving flattened operation fields.
 * @param prefix - Current namespace prefix.
 * @param operationKind - Root operation kind currently being traversed.
 * @param rootTypeName - Root operation type name to exclude from namespace traversal.
 * @param visitedTypeNames - Set used to prevent cyclic recursion.
 * @param namespaceTypeNames - Optional set collecting discovered namespace container type names.
 */
const collectOperationFields = (
  fieldMap: Record<string, unknown>,
  list: Record<string, GraphQLOperationType>,
  prefix: string,
  operationKind: Maybe<OperationKind>,
  rootTypeName: string,
  visitedTypeNames: Set<string>,
  namespaceTypeNames: Set<string> = new Set<string>(),
): void => {
  Object.entries(fieldMap).forEach(([name, operation]) => {
    const key = prefix ? `${prefix}.${name}` : name;

    if (
      !(
        typeof operation === "object" &&
        operation !== null &&
        "type" in operation
      )
    ) {
      list[key] = operation as GraphQLOperationType;
      return;
    }

    const nestedType = getNamedType(operation.type as GraphQLType);
    const nestedTypeName = getTypeName(nestedType);
    const isNamespaceType = isNestedOperationNamespaceType(
      nestedType,
      operationKind,
      rootTypeName,
    );

    if (!isNamespaceType) {
      list[key] = operation as GraphQLOperationType;
    } else if (nestedTypeName) {
      namespaceTypeNames.add(nestedTypeName);
    }

    if (
      !isNamespaceType ||
      !nestedTypeName ||
      visitedTypeNames.has(nestedTypeName)
    ) {
      return;
    }

    collectOperationFields(
      nestedType.getFields() as Record<string, unknown>,
      list,
      key,
      operationKind,
      rootTypeName,
      new Set([...visitedTypeNames, nestedTypeName]),
      namespaceTypeNames,
    );
  });
};

/**
 * Returns names of namespace container object types for a root operation type.
 *
 * @param operationType - root operation type to inspect.
 * @param operationKind - Optional explicit operation kind.
 * @returns set of namespace container type names.
 */
const getOperationNamespaceTypeNames = (
  operationType?: unknown,
  operationKind?: Maybe<OperationKind>,
): Set<string> => {
  return _getFields(
    operationType,
    (fieldMap) => {
      const namespaceTypeNames = new Set<string>();
      const rootTypeName = getTypeName(operationType);
      const resolvedOperationKind =
        operationKind ?? getOperationKindFromTypeName(rootTypeName);

      collectOperationFields(
        fieldMap,
        {},
        "",
        resolvedOperationKind,
        rootTypeName,
        rootTypeName ? new Set([rootTypeName]) : new Set(),
        namespaceTypeNames,
      );

      return namespaceTypeNames;
    },
    new Set<string>(),
  ) as Set<string>;
};

/**
 * Returns fields map for a GraphQL operation type (query, mutation, subscription...).
 *
 * @internal
 *
 * see {@link getSchemaMap}
 *
 * @param operationType - the operation type to parse.
 * @param operationKind - optional explicit operation kind.
 *
 * @returns a map of fields as k/v records.
 *
 */
export const getOperation = (
  operationType?: unknown,
  operationKind?: Maybe<OperationKind>,
): Record<string, GraphQLOperationType> => {
  return _getFields(
    operationType,
    (fieldMap) => {
      const list: Record<string, GraphQLOperationType> = {};
      const rootTypeName = getTypeName(operationType);
      const resolvedOperationKind =
        operationKind ?? getOperationKindFromTypeName(rootTypeName);

      collectOperationFields(
        fieldMap,
        list,
        "",
        resolvedOperationKind,
        rootTypeName,
        rootTypeName ? new Set([rootTypeName]) : new Set(),
      );

      return list;
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
      return Object.values(fieldMap);
    },
    [],
  ) as unknown[];
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
  const namespaceTypeNames = new Set<string>([
    ...getOperationNamespaceTypeNames(
      schema?.getQueryType() ?? undefined,
      "query",
    ),
    ...getOperationNamespaceTypeNames(
      schema?.getMutationType() ?? undefined,
      "mutation",
    ),
    ...getOperationNamespaceTypeNames(
      schema?.getSubscriptionType() ?? undefined,
      "subscription",
    ),
  ]);

  const objects = getTypeFromSchema<GraphQLObjectType>(
    schema,
    GraphQLObjectType,
  );
  const filteredObjects = objects
    ? (Object.fromEntries(
        Object.entries(objects).filter(([typeName]) => {
          return !namespaceTypeNames.has(typeName);
        }),
      ) as Record<string, GraphQLObjectType>)
    : undefined;

  return {
    ["queries" as SchemaEntity]: getOperation(
      schema?.getQueryType() ?? undefined,
      "query",
    ),
    ["mutations" as SchemaEntity]: getOperation(
      schema?.getMutationType() ?? undefined,
      "mutation",
    ),
    ["subscriptions" as SchemaEntity]: getOperation(
      schema?.getSubscriptionType() ?? undefined,
      "subscription",
    ),
    ["directives" as SchemaEntity]: convertArrayToMapObject<GraphQLDirective>(
      schema?.getDirectives() as GraphQLDirective[],
    ),
    ["objects" as SchemaEntity]: filteredObjects,
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
