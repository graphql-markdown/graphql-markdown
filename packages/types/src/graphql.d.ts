import type {
  ConfigOptions,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLFieldMap,
  GraphQLInputFieldMap,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLProjectConfig,
  GraphQLScalarType,
  GraphQLUnionType,
  Maybe,
  ObjectTypeDefinitionNode,
} from ".";

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

export type SchemaMap = {
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
};

export type DirectiveName = string & { _opaque: typeof DIRECTIVE_NAME };
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
export type RelationOf = { section: string; getRelation: IGetRelation };
export type IGetRelation<T> = (
  type: unknown,
  schemaMap: Maybe<SchemaMap>,
) => Partial<Record<SchemaEntity, T[]>>;
type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};
