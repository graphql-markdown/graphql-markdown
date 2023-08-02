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

import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";

import type { BaseLoaderOptions } from "@graphql-tools/utils";

export type {
  getDirectiveValues,
  getNamedType,
  GraphQLArgument,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLFieldMap,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputFieldMap,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLString,
  GraphQLType,
  GraphQLUnionType,
  ObjectTypeDefinitionNode,
  ASTNode,
  DirectiveDefinitionNode,
  DirectiveNode,
} from "graphql";

export type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

export type { GraphQLProjectConfig } from "graphql-config";

// @graphql-markdown/core
export type ConfigDocOptions = {
  index?: boolean;
  pagination?: boolean;
  toc?: boolean;
};

export type TypeDeprecatedOption = "default" | "group" | "skip";

export type ConfigPrintTypeOptions = {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
};

export type DiffMethodName = string & { _opaque: typeof DiffMethodName };
declare const DiffMethodName: unique symbol;
export type TypeDiffMethod = DiffMethodName | "NONE" | "FORCE";

type Pointer = string | UnnormalizedTypeDefPointer;

export type ConfigOptions = {
  id?: string;
  baseURL?: string;
  customDirective?: CustomDirective;
  diffMethod?: TypeDiffMethod;
  docOptions?: ConfigDocOptions;
  groupByDirective?: GroupByDirectiveOptions;
  homepage?: string;
  linkRoot?: string;
  loaders?: LoaderOption;
  pretty?: boolean;
  printer?: PackageName;
  printTypeOptions?: ConfigPrintTypeOptions;
  rootPath?: string;
  schema?: Pointer;
  tmpDir?: string;
  skipDocDirective?: DirectiveName[] | DirectiveName;
};

export type CliOptions = {
  schema?: Pointer;
  root?: string;
  base?: string;
  link?: string;
  homepage?: string;
  noCode?: boolean;
  noPagination?: boolean;
  noParentType?: boolean;
  noRelatedType?: boolean;
  noToc?: boolean;
  noTypeBadges?: boolean;
  index?: boolean;
  force?: boolean;
  diff?: TypeDiffMethod;
  tmp?: string;
  groupByDirective?: string;
  skip?: string[] | string;
  deprecated?: TypeDeprecatedOption;
  pretty?: boolean;
};

export type Options = Omit<
  ConfigOptions,
  "homepage" | "pretty" | "schema" | "rootPath"
> & {
  homepageLocation: string;
  outputDir: string;
  prettify: boolean;
  schemaLocation: Pointer;
  printer: PackageName;
  tmpDir: string;
  baseURL: string;
  linkRoot: string;
  skipDocDirective: DirectiveName[];
  docOptions: Required<ConfigDocOptions>;
  printTypeOptions: Required<ConfigPrintTypeOptions>;
};

export type FunctionCheckSchemaChanges = (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod?: unknown,
) => Promise<boolean>;

//-----//

// @graphql-markdown/utils

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

// ---- //
// @graphql-markdown/printer-legacy

export type RootTypeName =
  | "DIRECTIVE"
  | "ENUM"
  | "INPUT"
  | "INTERFACE"
  | "MUTATION"
  | "OPERATION"
  | "QUERY"
  | "SCALAR"
  | "SUBSCRIPTION"
  | "TYPE"
  | "UNION";
export type TypeLocale = { singular: string; plural: string } | string;
export type RootTypeLocale = {
  [name in RootTypeName]: TypeLocale;
};

export type PrinterConfigPrintTypeOptions = {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
};

export type CollapsibleOption = { dataOpen: string; dataClose: string };

export type PrintTypeOptions = {
  basePath: string;
  codeSection?: boolean;
  collapsible?: CollapsibleOption;
  customDirectives?: CustomDirectiveMap;
  deprecated?: TypeDeprecatedOption;
  groups?: SchemaEntitiesGroupMap | undefined;
  level?: SectionLevelValue;
  parentType?: string;
  parentTypePrefix: boolean;
  relatedTypeSection?: boolean;
  schema?: GraphQLSchema;
  skipDocDirective?: DirectiveName[];
  typeBadges?: boolean;
  withAttributes?: boolean;
  header?: { toc?: boolean; pagination?: boolean };
};

export type SectionLevelValue = string & { _opaque: typeof SectionLevelValue };
declare const SectionLevelValue: unique symbol;
export type SectionLevel = SectionLevelValue | "####" | "#####";

export type MDXString = string & { _opaque: typeof MDXString };
declare const MDXString: unique symbol;

export type Badge = {
  text: string | TypeLocale;
  classname: string;
};

export type TypeLink = {
  text: string;
  url: string;
};

export type PrintLinkOptions = Pick<
  PrintTypeOptions,
  | "groups"
  | "parentTypePrefix"
  | "parentType"
  | "basePath"
  | "withAttributes"
  | "skipDocDirective"
  | "deprecated"
> &
  Partial<PrintTypeOptions>;

export type PrintDirectiveOptions = Pick<
  PrintTypeOptions,
  "basePath" | "deprecated" | "parentTypePrefix"
> &
  Partial<PrintTypeOptions>;
