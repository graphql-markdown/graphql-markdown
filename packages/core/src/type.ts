import { GraphQLNamedType } from "graphql/type/definition";
import { GraphQLSchema } from "graphql/type/schema";
import { DocumentLoaders } from "@graphql-markdown/utils/graphql";

export type DocOptions = {
  pagination: boolean;
  toc: boolean;
  index: boolean;
};

export type PrintTypeOptions = {
  parentTypePrefix: boolean;
  relatedTypeSection: boolean;
  typeBadges: boolean;
};

export type GroupByDirective = {
  directive: string;
  field: string;
  fallback?: string;
};

export type PluginOptions = {
  schema: string;
  rootPath: string;
  baseURL: string;
  linkRoot: string;
  homepage: string;
  tmpDir: string;
  loaders: DocumentLoaders;
  pretty: boolean;
  printer: string;
  docOptions: DocOptions;
  printTypeOptions: PrintTypeOptions;
  groupByDirective: GroupByDirective | undefined;
  skipDocDirective: string | undefined;
  diffMethod?: string;
};

export type ConfigOptions = PluginOptions & {
  outputDir: string;
  schemaDiff: DiffMethodType;
};

export type CliDocOptions = {
  noPagination: boolean;
  noToc: boolean;
  index: boolean;
};

export type CliPrintTypeOptions = {
  noParentType: boolean;
  noRelatedType: boolean;
  noTypeBadges: boolean;
};

export type CliOptions = {
  base?: string;
  root?: string;
  schema?: string;
  link?: string;
  homepage?: string;
  diff?: string;
  tmp?: string;
  groupByDirective?: string;
  skip?: string;
  force: boolean;
  pretty: boolean;
} & CliDocOptions &
  CliPrintTypeOptions;

export interface IPrinter {
  readonly schema: GraphQLSchema;
  readonly baseURL: string;
  readonly linkRoot: string;
  readonly groups: any;
  readonly parentTypePrefix: boolean;
  readonly relatedTypeSection: boolean;
  readonly typeBadges: boolean;
  readonly skipDocDirective: any;

  printType(name: string, type: GraphQLNamedType, options: any): string;
}

export type CheckSchemaChanges = (
  method: string,
  schema: GraphQLSchema,
  outputDir: string
) => Promise<boolean>;

export type DiffMethodType = {
  toString: () => string;
  diff: (...args: any) => Promise<boolean>;
};

export type GetDiffMethod = (
  method: string | undefined
) => DiffMethodType | undefined;

export type DiffMethods = {
  [key: string]: DiffMethodType;
};
