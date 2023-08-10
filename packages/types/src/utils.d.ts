import type {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  GraphQLSchema,
} from "graphql";

import type { BaseLoaderOptions } from "@graphql-tools/utils";

import type { Maybe } from ".";

export type CustomDirectiveFunction = <T>(
  directive?: GraphQLDirective,
  node?: unknown,
) => T;

export type CustomDirectiveResolver = "descriptor" | "tag";

export type CustomDirectiveOptions = {
  [name in CustomDirectiveResolver]?: CustomDirectiveFunction;
};

export type CustomDirective = {
  [name: DirectiveName]: CustomDirectiveOptions;
};

export type DirectiveName = string & { _opaque: typeof DirectiveName };
declare const DirectiveName: unique symbol;

export type CustomDirectiveMapItem = CustomDirectiveOptions & {
  type: GraphQLDirective;
};

export type CustomDirectiveMap = {
  [name: DirectiveName]: CustomDirectiveMapItem;
};

export type GroupByDirectiveOptions = {
  directive: DirectiveName;
  field: string;
  fallback?: string;
};

export type SchemaEntitiesGroupMap = Partial<
  Record<SchemaEntity, Record<string, Maybe<string>>>
>;

export type LoaderOption = {
  [name: ClassName]: PackageConfig | PackageName;
};

export type PackageOptionsConfig = BaseLoaderOptions & RootTypes;

export type PackageConfig = {
  module: PackageName;
  options?: PackageOptionsConfig;
};

export type RootTypes = {
  query?: string;
  mutation?: string;
  subscription?: string;
};

export type PackageName = string & { _opaque: typeof PackageName };
declare const PackageName: unique symbol;

export type ClassName = string & { _opaque: typeof ClassName };
declare const ClassName: unique symbol;

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
  queries?: Maybe<Record<string, GraphQLField<unknown, unknown>>>;
  mutations?: Maybe<Record<string, GraphQLField<unknown, unknown>>>;
  subscriptions?: Maybe<Record<string, GraphQLField<unknown, unknown>>>;
  directives?: Maybe<Record<string, GraphQLDirective>>;
  objects?: Maybe<Record<string, GraphQLObjectType<unknown, unknown>>>;
  unions?: Maybe<Record<string, GraphQLUnionType>>;
  interfaces?: Maybe<Record<string, GraphQLInterfaceType>>;
  enums?: Maybe<Record<string, GraphQLEnumType>>;
  inputs?: Maybe<Record<string, GraphQLInputObjectType>>;
  scalars?: Maybe<Record<string, GraphQLScalarType<unknown, unknown>>>;
};

export type IGetRelation<T> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
) => T;

export type LoggerType = {
  debug: Function; // eslint-disable-line @typescript-eslint/ban-types
  error: Function; // eslint-disable-line @typescript-eslint/ban-types
  info: Function; // eslint-disable-line @typescript-eslint/ban-types
  log: Function; // eslint-disable-line @typescript-eslint/ban-types
  success: Function; // eslint-disable-line @typescript-eslint/ban-types
  warn: Function; // eslint-disable-line @typescript-eslint/ban-types
};

export type Category = { category: string; slug: string };

export type MDXString = string & { _opaque: typeof MDXString };
declare const MDXString: unique symbol;

export type { LoadSchemaOptions } from "@graphql-tools/load";
