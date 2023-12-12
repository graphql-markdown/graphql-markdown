import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";
import type { BaseLoaderOptions } from "@graphql-tools/utils";

import type { CustomDirective, DirectiveName, GraphQLSchema } from ".";

export interface ConfigDocOptions {
  index?: boolean;
  pagination?: boolean;
  toc?: boolean;
}

export type TypeDeprecatedOption = "default" | "group" | "skip";

export interface ConfigPrintTypeOptions {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
}

export type DiffMethodName = string & { _opaque: typeof DIFF_METHOD_NAME };
declare const DIFF_METHOD_NAME: unique symbol;
export type TypeDiffMethod = DiffMethodName | "FORCE" | "NONE";

type Pointer = UnnormalizedTypeDefPointer | string;

export interface ConfigOptions {
  baseURL?: Maybe<string>;
  customDirective?: Maybe<CustomDirective>;
  diffMethod?: Maybe<TypeDiffMethod>;
  docOptions?: Maybe<ConfigDocOptions>;
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  homepage?: Maybe<string>;
  id?: Maybe<string>;
  linkRoot?: Maybe<string>;
  loaders?: Maybe<LoaderOption>;
  metatags?: Record<string, string>[];
  pretty?: Maybe<boolean>;
  printer?: Maybe<PackageName>;
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  rootPath?: Maybe<string>;
  schema?: Maybe<Pointer>;
  skipDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  onlyDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  tmpDir?: Maybe<string>;
}

export interface CliOptions {
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
  only?: string[] | string;
  tmp?: string;
}

export type Options = Omit<
  ConfigOptions,
  "homepage" | "pretty" | "rootPath" | "schema"
> & {
  baseURL: string;
  docOptions: Required<ConfigDocOptions>;
  homepageLocation: string;
  linkRoot: string;
  onlyDocDirective: DirectiveName[];
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

export interface GroupByDirectiveOptions {
  directive: DirectiveName;
  field: string;
  fallback?: string;
}

export type LoaderOption = Record<ClassName, PackageConfig | PackageName>;

export type PackageOptionsConfig = BaseLoaderOptions & RootTypes;

export interface PackageConfig {
  module: PackageName;
  options?: PackageOptionsConfig;
}

export interface RootTypes {
  query?: string;
  mutation?: string;
  subscription?: string;
}

export type PackageName = string & { _opaque: typeof PACKAGE_NAME };
declare const PACKAGE_NAME: unique symbol;

export type ClassName = string & { _opaque: typeof CLASS_NAME };
declare const CLASS_NAME: unique symbol;
