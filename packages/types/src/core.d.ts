import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";
import type { BaseLoaderOptions } from "@graphql-tools/utils";

import type {
  CustomDirective,
  DirectiveName,
  GraphQLSchema,
  GroupByDirectiveOptions,
  LoaderOption,
  PackageName,
} from ".";

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
export type TypeDiffMethod = DiffMethodName | "FORCE" | "NONE";

type Pointer = UnnormalizedTypeDefPointer | string;

export type ConfigOptions = {
  baseURL?: Maybe<string>;
  customDirective?: Maybe<CustomDirective>;
  diffMethod?: Maybe<TypeDiffMethod>;
  docOptions?: Maybe<ConfigDocOptions>;
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  homepage?: Maybe<string>;
  id?: Maybe<string>;
  linkRoot?: Maybe<string>;
  loaders?: Maybe<LoaderOption>;
  pretty?: Maybe<boolean>;
  printer?: Maybe<PackageName>;
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  rootPath?: Maybe<string>;
  schema?: Maybe<Pointer>;
  skipDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  tmpDir?: Maybe<string>;
};

export type CliOptions = {
  base?: string;
  deprecated?: TypeDeprecatedOption;
  diff?: TypeDiffMethod;
  force?: boolean;
  groupByDirective?: string;
  homepage?: string;
  index?: boolean;
  link?: string;
  noCode?: boolean;
  noPagination?: boolean;
  noParentType?: boolean;
  noRelatedType?: boolean;
  noToc?: boolean;
  noTypeBadges?: boolean;
  pretty?: boolean;
  root?: string;
  schema?: Pointer;
  skip?: string[] | string;
  tmp?: string;
};

export type Options = Omit<
  ConfigOptions,
  "homepage" | "pretty" | "rootPath" | "schema"
> & {
  baseURL: string;
  docOptions: Required<ConfigDocOptions>;
  homepageLocation: string;
  linkRoot: string;
  outputDir: string;
  prettify: boolean;
  printer: PackageName;
  printTypeOptions: Required<ConfigPrintTypeOptions>;
  schemaLocation: Pointer;
  skipDocDirective: DirectiveName[];
  tmpDir: string;
};

export type FunctionCheckSchemaChanges = (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod?: DiffMethodName,
) => Promise<boolean>;

export type GeneratorOptions = Options & { loggerModule?: string };

export type GroupByDirectiveOptions = {
  directive: DirectiveName;
  field: string;
  fallback?: string;
};

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

export type { GraphQLProjectConfig } from "graphql-config";
