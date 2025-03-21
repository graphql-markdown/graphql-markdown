import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";
import type { BaseLoaderOptions } from "@graphql-tools/utils";

import type { DirectiveName, GraphQLDirective, GraphQLSchema } from "./graphql";

import type { CustomDirective } from "./helpers";

import type { Maybe } from "./utils";

export type FrontMatterOptions = Record<string, unknown> | false;

export type GenerateIndexMetafileType = (
  dirPath: string,
  category: string,
  options?: Record<string, unknown>,
) => Promise<void> | void;

export interface MDXSupportType {
  generateIndexMetafile: GenerateIndexMetafileType;
  formatMDXAdmonition: (
    { text, title, type, icon }: AdmonitionType,
    meta: Maybe<MetaOptions>,
  ) => MDXString;
  formatMDXBadge: ({ text, classname }: Badge) => MDXString;
  formatMDXBullet: (text?: string) => MDXString;
  formatMDXDetails: ({
    dataOpen,
    dataClose,
  }: {
    dataOpen?: Maybe<string>;
    dataClose?: Maybe<string>;
  }) => MDXString;
  formatMDXLink: (link: TypeLink) => TypeLink;
  formatMDXNameEntity: (name: string, parentType?: Maybe<string>) => MDXString;
  formatMDXSpecifiedByLink: (url: string) => MDXString;
  formatMDXFrontmatter: (
    props: Maybe<FrontMatterOptions>,
    formatted: Maybe<string[]>,
  ) => MDXString;
  mdxDeclaration: string;
}

export interface ApiGroupOverrideType {
  operations?: string;
  types?: string;
}

export interface ConfigDocOptions {
  frontMatter?: Maybe<FrontMatterOptions>;
  index?: boolean;
  generatorFrameworkName?: Maybe<string>;
  generatorFrameworkVersion?: Maybe<string>;
}

export type TypeHierarchyValueType = "api" | "entity" | "flat";

export type TypeHierarchyTypeOptions = Record<string, unknown>;

export type TypeHierarchyObjectType = Partial<
  Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>
>;

export type TypeHierarchyType =
  | TypeHierarchyObjectType
  | TypeHierarchyValueType;

export type RendererDocOptions = ConfigDocOptions & {
  deprecated?: Maybe<TypeDeprecatedOption>;
} & {
  force?: boolean;
  hierarchy?: Maybe<TypeHierarchyObjectType>;
};

export interface DeprecatedConfigDocOptions {
  never: never;
}

export type UseApiGroupOptionType = ApiGroupOverrideType | boolean;

export interface DeprecatedConfigPrintTypeOptions {
  never: never;
}

export type TypeDeprecatedOption = "default" | "group" | "skip";

export type DirectiveExampleParserFunction = (
  value?: unknown,
  type?: unknown,
) => unknown;

export interface TypeDirectiveExample {
  directive: GraphQLDirective;
  field: string;
  parser?: DirectiveExampleParserFunction;
}

export type TypeExampleSectionOption = Partial<
  Omit<TypeDirectiveExample, "directive"> & { directive: string }
>;

export interface ConfigPrintTypeOptions {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  exampleSection?: TypeExampleSectionOption | boolean;
  hierarchy?: TypeHierarchyType;
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
  docOptions?: Maybe<
    ConfigDocOptions & Omit<DeprecatedConfigDocOptions, "never">
  >;
  force?: boolean;
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  homepage?: Maybe<string>;
  id?: Maybe<string>;
  linkRoot?: Maybe<string>;
  loaders?: Maybe<LoaderOption>;
  mdxParser?: Maybe<PackageName | string>;
  metatags?: Record<string, string>[];
  onlyDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  pretty?: Maybe<boolean>;
  printer?: Maybe<PackageName>;
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  rootPath?: Maybe<string>;
  schema?: Maybe<Pointer>;
  skipDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  tmpDir?: Maybe<string>;
}

export interface ExperimentalConfigOptions {
  runOnBuild: boolean | undefined;
}

export interface CliOptions {
  base?: string;
  config?: boolean;
  deprecated?: TypeDeprecatedOption;
  diff?: TypeDiffMethod;
  force?: boolean;
  groupByDirective?: string;
  homepage?: string;
  index?: boolean;
  link?: string;
  hierarchy?: TypeHierarchyValueType;
  mdxParser?: string;
  noCode?: boolean;
  noExample?: boolean;
  noParentType?: boolean;
  noRelatedType?: boolean;
  noTypeBadges?: boolean;
  pretty?: boolean;
  root?: string;
  schema?: Pointer;
  skip?: string[] | string;
  only?: string[] | string;
  tmp?: string;
}

export interface DeprecatedCliOptions {
  never: never;
}

export type Options = Omit<
  ConfigOptions,
  "homepage" | "linkRoot" | "pretty" | "rootPath"
> &
  Required<
    Pick<
      ConfigOptions,
      | "diffMethod"
      | "docOptions"
      | "metatags"
      | "onlyDocDirective"
      | "printer"
      | "printTypeOptions"
      | "skipDocDirective"
    > & {
      baseURL: string;
      homepageLocation: string;
      linkRoot: string;
      onlyDocDirective: DirectiveName[];
      outputDir: string;
      prettify: boolean;
      schemaLocation: Pointer;
      tmpDir: string;
      skipDocDirective: DirectiveName[];
    }
  >;

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
