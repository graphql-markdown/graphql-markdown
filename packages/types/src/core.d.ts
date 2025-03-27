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

export interface CollapsibleOption {
  dataOpen: string;
  dataClose: string;
}

export interface MDXSupportType {
  generateIndexMetafile: GenerateIndexMetafileType;
  formatMDXAdmonition: (
    { text, title, type, icon }: AdmonitionType,
    meta: Maybe<MetaOptions>,
  ) => MDXString;
  formatMDXBadge: ({ text, classname }: Badge) => MDXString;
  formatMDXBullet: (text?: string) => MDXString;
  formatMDXDetails: (option: CollapsibleOption) => MDXString;
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
  // Base URL for the documentation links
  baseURL?: Maybe<string>;
  // List of custom directives to include in documentation
  customDirective?: Maybe<CustomDirective>;
  // Method to use for diffing schema changes
  diffMethod?: Maybe<TypeDiffMethod>;
  // Documentation framework specific options
  docOptions?: Maybe<
    ConfigDocOptions & Omit<DeprecatedConfigDocOptions, "never">
  >;
  // Forces regeneration of all files regardless of changes
  force?: boolean;
  // Directives used to group schema types
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  // Location of the homepage content
  homepage?: Maybe<string>;
  // Identifier for the project
  id?: Maybe<string>;
  // Root path for generating links
  linkRoot?: Maybe<string>;
  //  List of loaders to use for loading the schema
  loaders?: Maybe<LoaderOption>;
  // Package to be used for generating MDX output
  mdxParser?: Maybe<PackageName | string>;
  // Metadata tags to include in documentation
  metatags?: Record<string, string>[];
  // Only document types with these directives
  onlyDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  // Use prettier to make the output pretty
  pretty?: Maybe<boolean>;
  // Printer module to use for generating output
  printer?: Maybe<PackageName>;
  // Options for printing GraphQL types
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  // Root path for the project
  rootPath?: Maybe<string>;
  // Location of the GraphQL schema
  schema?: Maybe<Pointer>;
  // Skip documenting types with these directives
  skipDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  // Temporary directory for processing
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
