import type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";
import type { BaseLoaderOptions } from "@graphql-tools/utils";

import type { DirectiveName, GraphQLDirective, GraphQLSchema } from "./graphql";

import type { CustomDirective } from "./helpers";

import type { Maybe, MDXString } from "./utils";
import type { AdmonitionType, Badge, MetaOptions, TypeLink } from "./printer";

/**
 * Core type definitions for configuration and document generation.
 * Contains types for configuring documentation generation, rendering, and formatting.
 *
 * @packageDocumentation
 */

/**
 * Front matter options for documentation pages.
 * Can be a record of key-value pairs or false to disable front matter.
 */
export type FrontMatterOptions = Record<string, unknown> | false;

/**
 * Function type for generating index metafiles.
 * Creates index files for documentation categories.
 *
 * @param dirPath - Directory path where the index should be created
 * @param category - Name of the category
 * @param options - Optional configuration for index generation
 */
export type GenerateIndexMetafileType = (
  dirPath: string,
  category: string,
  options?: Record<string, unknown>,
) => Promise<void> | void;

/**
 * Options for collapsible sections in documentation.
 * Controls the open/close states of collapsible content.
 */
export interface CollapsibleOption {
  /** Text shown when section is open */
  dataOpen: string;
  /** Text shown when section is closed */
  dataClose: string;
}

/**
 * MDX rendering support configuration.
 * Defines functions for formatting different MDX components.
 */
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
  // Event hooks
  beforeSchemaLoadHook?: SchemaLoadHook;
  afterSchemaLoadHook?: SchemaLoadHook;
  beforeDiffCheckHook?: DiffCheckHook;
  afterDiffCheckHook?: DiffCheckHook;
  beforeRenderRootTypesHook?: RenderRootTypesHook;
  afterRenderRootTypesHook?: RenderRootTypesHook;
  beforeRenderHomepageHook?: RenderHomepageHook;
  afterRenderHomepageHook?: RenderHomepageHook;
  beforeRenderTypeEntitiesHook?: RenderTypeEntitiesHook;
  afterRenderTypeEntitiesHook?: RenderTypeEntitiesHook;
  beforeGenerateIndexMetafileHook?: GenerateIndexMetafileHook;
  afterGenerateIndexMetafileHook?: GenerateIndexMetafileHook;
}

/**
 * Configuration for grouping API documentation sections.
 * Allows customizing folder names for operations and types.
 */
export interface ApiGroupOverrideType {
  /** Custom folder name for operations (queries/mutations) */
  operations?: string;
  /** Custom folder name for type definitions */
  types?: string;
}

/**
 * Category sorting function type.
 * A compare function similar to Array.sort() that takes two category names
 * and returns a number indicating their relative order.
 */
export type CategorySortFn = (a: string, b: string) => number;

/**
 * Core documentation generation configuration.
 * Controls front matter, indexing and framework metadata.
 */
export interface ConfigDocOptions {
  /** Front matter configuration or false to disable */
  frontMatter?: Maybe<FrontMatterOptions>;
  /** Whether to generate index files */
  index?: boolean;
  /** Name of the documentation generator framework */
  generatorFrameworkName?: Maybe<string>;
  /** Version of the documentation generator framework */
  generatorFrameworkVersion?: Maybe<string>;
  /**
   * Category sorting: "natural" for alphabetical or custom compare function.
   * When enabled, folder names are automatically prefixed with order numbers (e.g., 01-objects, 02-queries).
   */
  categorySort?: CategorySortFn | "natural";
}

/**
 * Valid hierarchy values for organizing documentation.
 * Can be "api" for API-based, "entity" for entity-based, or "flat" for no hierarchy.
 */
export type TypeHierarchyValueType = "api" | "entity" | "flat";

/**
 * Custom options for each hierarchy type.
 * Allows configuring how each hierarchy organizes types.
 */
export type TypeHierarchyTypeOptions = Record<string, unknown>;

/**
 * Complete hierarchy configuration object.
 * Maps hierarchy types to their options.
 */
export type TypeHierarchyObjectType = Partial<
  Record<TypeHierarchyValueType, TypeHierarchyTypeOptions>
>;

export type TypeHierarchyType =
  | TypeHierarchyObjectType
  | TypeHierarchyValueType;

export type RendererDocOptions = ConfigDocOptions & {
  /** How to handle deprecated items */
  deprecated?: Maybe<TypeDeprecatedOption>;
} & {
  /** Whether to force generation */
  force?: boolean;
  /** Type hierarchy configuration */
  hierarchy?: Maybe<TypeHierarchyObjectType>;
};

export interface DeprecatedConfigDocOptions {
  never: never;
}

/** Flag for API group setting */
export type UseApiGroupOptionType = ApiGroupOverrideType | boolean;

export interface DeprecatedConfigPrintTypeOptions {
  never: never;
}

/**
 * Options for handling deprecated schema items.
 * Controls how deprecated items are displayed in docs.
 */
export type TypeDeprecatedOption = "default" | "group" | "skip";

/**
 * Function for parsing directive examples.
 * Processes example values from directives.
 */
export type DirectiveExampleParserFunction = (
  value?: unknown,
  type?: unknown,
) => unknown;

/**
 * Configuration for directive examples.
 * Specifies how directive examples should be rendered.
 */
export interface TypeDirectiveExample {
  /** The directive being exemplified */
  directive: GraphQLDirective;
  /** Field the example applies to */
  field: string;
  /** Optional custom parser for the example */
  parser?: DirectiveExampleParserFunction;
}

/**
 * Example section configuration options.
 * Controls how directive examples are displayed in documentation.
 */
export type TypeExampleSectionOption = Partial<
  Omit<TypeDirectiveExample, "directive"> & { directive: string }
>;

export type DiffMethodName = string & { _opaque: typeof DIFF_METHOD_NAME };
declare const DIFF_METHOD_NAME: unique symbol;
export type TypeDiffMethod = DiffMethodName | "FORCE" | "NONE";

type Pointer = UnnormalizedTypeDefPointer;

export interface ConfigOptions {
  /** Base URL for the documentation links */
  baseURL?: Maybe<string>;
  /** List of custom directives to include in documentation */
  customDirective?: Maybe<CustomDirective>;
  /** Method to use for diffing schema changes */
  diffMethod?: Maybe<TypeDiffMethod>;
  /** Documentation framework specific options */
  docOptions?: Maybe<
    ConfigDocOptions & Omit<DeprecatedConfigDocOptions, "never">
  >;
  /** Forces regeneration of all files regardless of changes */
  force?: boolean;
  /** Directives used to group schema types */
  groupByDirective?: Maybe<GroupByDirectiveOptions>;
  /** Location of the homepage content */
  homepage?: Maybe<string | false>;
  /** Identifier for the project */
  id?: Maybe<string>;
  /** Root path for generating links */
  linkRoot?: Maybe<string>;
  /** List of loaders to use for loading the schema */
  loaders?: Maybe<LoaderOption>;
  /** Package to be used for generating MDX output */
  mdxParser?: Maybe<PackageName | string>;
  /** Metadata tags to include in documentation */
  metatags?: Record<string, string>[];
  /** Only document types with these directives */
  onlyDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  /** Use prettier to make the output pretty */
  pretty?: Maybe<boolean>;
  /** Printer module to use for generating output */
  printer?: Maybe<PackageName>;
  /** Options for printing GraphQL types */
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  /** Root path for the project */
  rootPath?: Maybe<string>;
  /** Location of the GraphQL schema */
  schema?: Maybe<Pointer>;
  /** Skip documenting types with these directives */
  skipDocDirective?: Maybe<DirectiveName | DirectiveName[]>;
  /** Temporary directory for processing */
  tmpDir?: Maybe<string>;
}

/**
 * Print type configuration options.
 * Controls how types are rendered in the documentation.
 */
export interface ConfigPrintTypeOptions {
  /** Whether to include code sections */
  codeSection?: boolean;
  /** How to handle deprecated items */
  deprecated?: TypeDeprecatedOption;
  /** Configuration for example sections */
  exampleSection?: TypeExampleSectionOption | boolean;
  /** Documentation hierarchy structure */
  hierarchy?: TypeHierarchyType;
  /** Whether to prefix fields with parent type names */
  parentTypePrefix?: boolean;
  /** Whether to show related type sections */
  relatedTypeSection?: boolean;
  /** Whether to show type badges */
  typeBadges?: boolean;
}

/**
 * Experimental configuration options.
 * Features that are not yet stable or fully implemented.
 */
export interface ExperimentalConfigOptions {
  /** Whether to run generation during build */
  runOnBuild: boolean | undefined;
}

/**
 * Command line interface options.
 * Maps CLI flags to their values.
 */
export interface CliOptions {
  /** Base URL for documentation */
  base?: string;
  /** Whether to output configuration */
  config?: boolean;
  /** How to handle deprecated items */
  deprecated?: TypeDeprecatedOption;
  /** Schema diff method to use */
  diff?: TypeDiffMethod;
  /** Force regeneration flag */
  force?: boolean;
  /** Directive for grouping */
  groupByDirective?: string;
  /** Homepage location */
  homepage?: string | false;
  /** Generate index files flag */
  index?: boolean;
  /** Root for documentation links */
  link?: string;
  /** Documentation hierarchy type */
  hierarchy?: TypeHierarchyValueType;
  /** MDX parser package */
  mdxParser?: string;
  /** Disable code sections flag */
  noCode?: boolean;
  /** Disable examples flag */
  noExample?: boolean;
  /** Disable parent type prefix flag */
  noParentType?: boolean;
  /** Disable related types flag */
  noRelatedType?: boolean;
  /** Disable type badges flag */
  noTypeBadges?: boolean;
  /** Prettify output flag */
  pretty?: boolean;
  /** Output root directory */
  root?: string;
  /** Schema location */
  schema?: Pointer;
  /** Directives to skip */
  skip?: string[] | string;
  /** Directives to only include */
  only?: string[] | string;
  /** Temporary directory */
  tmp?: string;
}

/**
 * Legacy CLI options interface
 * Use CliOptions instead
 */
export interface DeprecatedCliOptions {
  never: never;
}

/**
 * Core options type that combines config options with required fields.
 * Used as the main configuration type throughout the application.
 */
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
      /** Base URL for documentation */
      baseURL: string;
      /** Homepage file location */
      homepageLocation: Maybe<string>;
      /** Root for documentation links */
      linkRoot: string;
      /** Directives to only document */
      onlyDocDirective: DirectiveName[];
      /** Output directory */
      outputDir: string;
      /** Whether to prettify output */
      prettify: boolean;
      /** Schema location */
      schemaLocation: Pointer;
      /** Temporary directory */
      tmpDir: string;
      /** Directives to skip */
      skipDocDirective: DirectiveName[];
    }
  >;

/**
 * Function type for checking schema changes.
 * Used to determine if documentation needs to be regenerated.
 */
export type FunctionCheckSchemaChanges = (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod?: DiffMethodName,
) => Promise<boolean>;

/**
 * Generator options that include logger configuration.
 * Extends base options with optional logger module.
 */
export type GeneratorOptions = Options & {
  /** Module to use for logging */
  loggerModule?: string;
};

/**
 * Configuration for directive-based grouping.
 * Specifies how to group schema items using directives.
 */
export interface GroupByDirectiveOptions {
  /** Directive to use for grouping */
  directive: DirectiveName;
  /** Field in the directive containing group name */
  field: string;
  /** Default group for items without the directive */
  fallback?: string;
}

/**
 * Map of GraphQL schema loaders by class name.
 * Associates loader class names with their configuration.
 */
export type LoaderOption = Record<ClassName, PackageConfig | PackageName>;

/**
 * Base configuration options for packages.
 * Extends base loader options with root type settings.
 */
export type PackageOptionsConfig = BaseLoaderOptions & RootTypes;

/**
 * Complete package configuration object.
 * Specifies the module and its options.
 */
export interface PackageConfig {
  /** NPM package name of the module */
  module: PackageName;
  /** Configuration options for the module */
  options?: PackageOptionsConfig;
}

/**
 * Root type configuration for a GraphQL schema.
 * Maps operation types to their root type names.
 */
export interface RootTypes {
  /** Name of the Query root type */
  query?: string;
  /** Name of the Mutation root type */
  mutation?: string;
  /** Name of the Subscription root type */
  subscription?: string;
}

export type PackageName = string & { _opaque: typeof PACKAGE_NAME };
declare const PACKAGE_NAME: unique symbol;

export type ClassName = string & { _opaque: typeof CLASS_NAME };
declare const CLASS_NAME: unique symbol;

export type LocationPath = string & { _opaque: typeof LOCATION_PATH };
declare const LOCATION_PATH: unique symbol;

/**
 * Event system type declarations
 */

/**
 * Type for default action function that can be executed by events.
 * Returns a Promise to support both sync and async actions.
 */
export type DefaultAction = () => Promise<void>;

/**
 * Hook callback for schema loading events.
 */
export type SchemaLoadHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for diff check events.
 */
export type DiffCheckHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for render root types events.
 */
export type RenderRootTypesHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for render homepage events.
 */
export type RenderHomepageHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for render type entities events.
 */
export type RenderTypeEntitiesHook = (event: unknown) => Promise<void>;

/**
 * Hook callback for generate index metafile events.
 */
export type GenerateIndexMetafileHook = (event: unknown) => Promise<void>;
