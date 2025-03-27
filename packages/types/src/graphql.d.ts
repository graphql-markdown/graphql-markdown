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

export interface GraphQLSchemaEntity<T> {
  // GraphQL schema type
  type: Maybe<GraphQLType>;
  // GraphQL schema type's value to be formatted.
  defaultValue: T;
}

export type DeprecatedType<T> = Partial<{
  deprecationReason: string;
  isDeprecated: boolean;
}> &
  T;

export type AstNodeType<T> = Required<{
  astNode: ObjectTypeDefinitionNode;
}> &
  T;

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

export interface SchemaMap {
  queries?: Maybe<Record<string, GraphQLOperationType>>;
  mutations?: Maybe<Record<string, GraphQLOperationType>>;
  subscriptions?: Maybe<Record<string, GraphQLOperationType>>;
  directives?: Maybe<Record<string, GraphQLDirective>>;
  objects?: Maybe<Record<string, GraphQLObjectType<unknown, unknown>>>;
  unions?: Maybe<Record<string, GraphQLUnionType>>;
  interfaces?: Maybe<Record<string, GraphQLInterfaceType>>;
  enums?: Maybe<Record<string, GraphQLEnumType>>;
  inputs?: Maybe<Record<string, GraphQLInputObjectType>>;
  scalars?: Maybe<Record<string, GraphQLScalarType<unknown, unknown>>>;
}

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

export type RelationOfField =
  | GraphQLDirective
  | GraphQLNamedType
  | GraphQLOperationType;
export type RelationOfInterface = GraphQLInterfaceType | GraphQLObjectType;
export type RelationOfImplementation = GraphQLUnionType | RelationOfInterface;
export type ExtensionProjectConfig = Omit<ConfigOptions, "schema"> &
  Writeable<GraphQLProjectConfig>;
export type IGetRelation<T> = (
  type: unknown,
  schemaMap: Maybe<SchemaMap>,
) => Partial<Record<SchemaEntity, T[]>>;
export interface RelationOf {
  section: string;
  getRelation: IGetRelation<T>;
}
type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};
