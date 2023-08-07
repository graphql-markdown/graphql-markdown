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

export interface CustomDirectiveFunction {
  <T>(directive?: GraphQLDirective, node?: unknown): T;
}

export type CustomDirectiveResolver = "descriptor" | "tag";

export type CustomDirectiveOptions = {
  [name in CustomDirectiveResolver]?: CustomDirectiveFunction;
};

export type CustomDirective = {
  [name: DirectiveName]: CustomDirectiveOptions;
};

export type DirectiveName = string & { _opaque: typeof DirectiveName };
declare const DirectiveName: unique symbol;

export type CustomDirectiveMapItem = {
  type: GraphQLDirective;
} & CustomDirectiveOptions;

export type CustomDirectiveMap = {
  [name: DirectiveName]: CustomDirectiveMapItem;
};

export type GroupByDirectiveOptions = {
  directive: DirectiveName;
  field: string;
  fallback?: string;
};

export type SchemaEntitiesGroupMap = Partial<
  Record<SchemaEntity, Record<string, string | undefined>>
>;

export type LoaderOption = {
  [name: ClassName]: PackageName | PackageConfig;
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
  | "queries"
  | "mutations"
  | "subscriptions"
  | "directives"
  | "objects"
  | "unions"
  | "interfaces"
  | "enums"
  | "inputs"
  | "scalars";

export type SchemaMap = {
  queries?: Record<string, GraphQLField<unknown, unknown>> | undefined;
  mutations?: Record<string, GraphQLField<unknown, unknown>> | undefined;
  subscriptions?: Record<string, GraphQLField<unknown, unknown>> | undefined;
  directives?: Record<string, GraphQLDirective> | undefined;
  objects?: Record<string, GraphQLObjectType<unknown, unknown>> | undefined;
  unions?: Record<string, GraphQLUnionType> | undefined;
  interfaces?: Record<string, GraphQLInterfaceType> | undefined;
  enums?: Record<string, GraphQLEnumType> | undefined;
  inputs?: Record<string, GraphQLInputObjectType> | undefined;
  scalars?: Record<string, GraphQLScalarType<unknown, unknown>> | undefined;
};

export abstract class IPrinter {
  static init(
    schema: GraphQLSchema,
    baseURL: string,
    linkRoot: string,
    options: PrinterOptions,
  ): void;
  static printHeader(
    id: string,
    title: string,
    options: PrinterOptions & PrinterConfig,
  ): string;
  static printDescription(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
    noText: string,
  ): string;
  static printCode(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): string;
  static printCustomDirectives(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printCustomTags(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printTypeMetadata(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printRelations(
    type: unknown,
    options: PrinterOptions & PrinterConfig,
  ): MDXString;
  static printType(
    name: string,
    type: unknown,
    options: Partial<PrinterOptions & PrinterConfig>,
  ): MDXString;
}
export type Printer = typeof IPrinter;

export type PrinterConfig = {
  schema: GraphQLSchema;
  baseURL: string;
  linkRoot: string;
};

export type PrinterOptions = {
  customDirectives?: CustomDirectiveMap;
  deprecated?: TypeDeprecatedOption;
  groups?: SchemaEntitiesGroupMap;
  printTypeOptions?: ConfigPrintTypeOptions;
  skipDocDirective?: DirectiveName[];
};

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
