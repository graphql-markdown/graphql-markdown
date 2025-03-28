/**
 * GraphQL type definitions and interfaces.
 * Contains types for working with GraphQL schemas, types, and operations.
 *
 * @packageDocumentation
 */

import type { GraphQLProjectConfig } from "graphql-config";
import type { ObjectTypeDefinitionNode } from "graphql/language";
import type {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLFieldMap,
  GraphQLInputFieldMap,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLType,
  GraphQLUnionType,
} from "graphql/type";

import type { Maybe } from "./utils";
import type { ConfigOptions } from "./core";

export type {
  GraphQLArgument,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLFieldMap,
  GraphQLInputFieldMap,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLType,
  GraphQLUnionType,
} from "graphql/type";

export type { LoadSchemaOptions } from "@graphql-tools/load";

export type { GraphQLExtensionDeclaration } from "graphql-config";

export type { ASTNode, DirectiveNode } from "graphql/language";

/**
 * Represents a value paired with its GraphQL type.
 * Used for storing schema entity information along with its value.
 *
 * @typeParam T - The type of the default value
 */
export interface GraphQLSchemaEntity<T> {
  /** GraphQL schema type */
  type: Maybe<GraphQLType>;
  /** GraphQL schema type's value to be formatted */
  defaultValue: T;
}

/**
 * Type wrapper for deprecated fields and types.
 * Adds deprecation metadata to any GraphQL type.
 *
 * @typeParam T - The type being deprecated
 */
export type DeprecatedType<T> = Partial<{
  /** Reason for deprecation */
  deprecationReason: string;
  /** Whether the type is deprecated */
  isDeprecated: boolean;
}> &
  T;

/**
 * Type wrapper for AST node containing types.
 * Adds AST node requirement to any GraphQL type.
 *
 * @typeParam T - The type containing AST node
 */
export type AstNodeType<T> = Required<{
  /** The AST node definition */
  astNode: ObjectTypeDefinitionNode;
}> &
  T;

/**
 * Available GraphQL schema entity types.
 * Used for organizing schema entities by their type.
 */
export type SchemaEntity =
  | "directives"
  | "enums"
  | "inputs"
  | "interfaces"
  | "mutations"
  | "objects"
  | "queries"
  | "scalars"
  | "subscriptions"
  | "unions";

/**
 * Map of GraphQL schema entities by their type.
 * Used for storing organized schema definitions.
 */
export interface SchemaMap {
  /** Query operations in the schema */
  queries?: Maybe<Record<string, GraphQLOperationType>>;
  /** Mutation operations in the schema */
  mutations?: Maybe<Record<string, GraphQLOperationType>>;
  /** Subscription operations in the schema */
  subscriptions?: Maybe<Record<string, GraphQLOperationType>>;
  /** Custom directives defined in the schema */
  directives?: Maybe<Record<string, GraphQLDirective>>;
  /** Object types defined in the schema */
  objects?: Maybe<Record<string, GraphQLObjectType<unknown, unknown>>>;
  /** Union types defined in the schema */
  unions?: Maybe<Record<string, GraphQLUnionType>>;
  /** Interface types defined in the schema */
  interfaces?: Maybe<Record<string, GraphQLInterfaceType>>;
  /** Enum types defined in the schema */
  enums?: Maybe<Record<string, GraphQLEnumType>>;
  /** Input object types defined in the schema */
  inputs?: Maybe<Record<string, GraphQLInputObjectType>>;
  /** Scalar types defined in the schema */
  scalars?: Maybe<Record<string, GraphQLScalarType<unknown, unknown>>>;
}

/**
 * Opaque type for directive names.
 * Used for type safety when working with directive identifiers.
 *
 * @internal
 */
export type DirectiveName = string & { _opaque: typeof DIRECTIVE_NAME };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const DIRECTIVE_NAME: unique symbol;

export type SchemaEntitiesGroupMap = Partial<
  Record<SchemaEntity, Record<string, Maybe<string>>>
>;

export type GraphQLOperationType =
  | GraphQLFieldMap<unknown, unknown>
  | GraphQLInputFieldMap
  | Record<string, never>;

/**
 * Field relation types in the GraphQL schema.
 * Used for linking related fields across the schema.
 */
export type RelationOfField =
  | GraphQLDirective
  | GraphQLNamedType
  | GraphQLOperationType;

/** Interface types that can implement relations */
export type RelationOfInterface = GraphQLInterfaceType | GraphQLObjectType;

/** Implementation types that can be related */
export type RelationOfImplementation = GraphQLUnionType | RelationOfInterface;

/** Configuration options for schema extensions */
export type ExtensionProjectConfig = Omit<ConfigOptions, "schema"> &
  Writeable<GraphQLProjectConfig>;

/**
 * Function type for getting relations between schema entities.
 *
 * @typeParam T - The type of relation being fetched
 */
export type IGetRelation<T> = (
  type: unknown,
  schemaMap: Maybe<SchemaMap>,
) => Partial<Record<SchemaEntity, T[]>>;

/**
 * Specifies a relation between schema entities.
 * Contains metadata about the relation.
 */
export interface RelationOf<T> {
  /** Section where the relation belongs */
  section: string;
  getRelation: IGetRelation<T>;
}

/**
 * Makes properties writeable in a type.
 * Removes readonly modifiers from all properties.
 *
 * @typeParam T - Type to make writeable
 * @internal
 */
type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};
