import type {
  CollapsibleOption,
  ConfigPrintTypeOptions,
  FrontMatterOptions,
  MetaInfo,
  TypeDeprecatedOption,
  TypeExampleSectionOption,
  TypeHierarchyObjectType,
} from "./core";
import type { Formatter } from "./formatter";
import type {
  GraphQLDirective,
  GraphQLSchema,
  SchemaEntitiesGroupMap,
} from "./graphql";
import type { CustomDirectiveMap } from "./helpers";
import type { Maybe, MDXString } from "./utils";

/**
 * Minimal event emitter interface for printer event emission.
 *
 * This interface allows the printer to emit events without depending on the core package.
 * The actual implementation is provided by the CancellableEventEmitter from \@graphql-markdown/core.
 *
 * @example
 * ```typescript
 * // In core package
 * const events = getEvents(); // Returns CancellableEventEmitter
 * await Printer.init(schema, baseURL, linkRoot, options, formatter, mdxDeclaration, events);
 *
 * // In printer
 * if (this.eventEmitter) {
 *   const event = new PrintCodeEvent({ type, typeName, options }, output);
 *   await this.eventEmitter.emitAsync(PrintTypeEvents.AFTER_PRINT_CODE, event);
 *   output = event.output; // Use potentially modified output
 * }
 * ```
 */
export interface PrinterEventEmitter {
  /**
   * Emit an async event with support for cancellable events.
   * Handlers can modify the event's mutable properties.
   *
   * @param eventName - The event name to emit
   * @param event - The event object with data and mutable output
   * @returns Promise that resolves when all handlers have executed
   */
  emitAsync: (
    eventName: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
  ) => Promise<{ errors: Error[]; defaultPrevented: boolean }>;
}

/**
 * Represents the root GraphQL type names supported by the documentation generator
 */
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

/**
 * Represents localized text that can be either a string or an object with singular/plural forms
 */
export type TypeLocale = string | { singular: string; plural: string };

/**
 * Maps root type names to their localized representations
 */
export type RootTypeLocale = Record<RootTypeName, TypeLocale>;

/**
 * Represents an admonition (notice/warning) block in the documentation
 */
export interface AdmonitionType {
  icon?: Maybe<string>;
  text: string;
  title: Maybe<string>;
  type: string;
}

/**
 * Configuration options for printing type documentation
 */
export interface PrinterConfigPrintTypeOptions {
  codeSection?: boolean;
  deprecated?: TypeDeprecatedOption;
  exampleSection?: TypeExampleSectionOption | boolean;
  hierarchy?: TypeHierarchyObjectType;
  metatags?: Record<string, string>[];
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  typeBadges?: boolean;
}

/**
 * Comprehensive options for printing type documentation
 */
export type PrintTypeOptions = Partial<Formatter> & {
  basePath: string;
  codeSection?: Maybe<boolean>;
  collapsible?: Maybe<CollapsibleOption>;
  customDirectives?: Maybe<CustomDirectiveMap>;
  deprecated?: Maybe<TypeDeprecatedOption>;
  exampleSection?: Maybe<TypeExampleSectionOption | boolean>;
  /** Optional function to format category folder names (e.g., for adding prefix numbers) */
  formatCategoryFolderName?: Maybe<(categoryName: string) => string>;
  frontMatter?: Maybe<FrontMatterOptions>;
  groups?: Maybe<SchemaEntitiesGroupMap>;
  hierarchy?: Maybe<TypeHierarchyObjectType>;
  level?: Maybe<SectionLevelValue>;
  meta?: Maybe<MetaInfo>;
  metatags?: Maybe<Record<string, string>[]>;
  onlyDocDirectives?: GraphQLDirective[];
  parentType?: Maybe<string>;
  parentTypePrefix?: boolean;
  relatedTypeSection?: boolean;
  schema?: Maybe<GraphQLSchema>;
  skipDocDirectives?: GraphQLDirective[];
  typeBadges?: boolean;
  withAttributes?: boolean;
};

/**
 * Represents valid section level values for documentation hierarchy
 */
export type SectionLevelValue = {
  _opaque: typeof SECTION_LEVEL_VALUE;
} & (0 | 3 | 4 | 5);
declare const SECTION_LEVEL_VALUE: unique symbol;

/**
 * Represents a badge with text and optional styling
 */
export interface Badge {
  text: TypeLocale;
  classname?: string[] | string;
}

/**
 * Represents a link with text and URL
 */
export interface TypeLink {
  text: string;
  url: string;
}

/**
 * Options for printing links in documentation
 */
export type PrintLinkOptions = Partial<PrintTypeOptions> &
  Pick<
    PrintTypeOptions,
    | "basePath"
    | "deprecated"
    | "formatMDXLink"
    | "groups"
    | "hierarchy"
    | "onlyDocDirectives"
    | "parentType"
    | "parentTypePrefix"
    | "skipDocDirectives"
    | "withAttributes"
  >;

/**
 * Options for printing directive documentation
 */
export type PrintDirectiveOptions = Partial<PrintTypeOptions> &
  Pick<PrintTypeOptions, "basePath" | "deprecated" | "parentTypePrefix">;

/**
 * Abstract printer class that handles the generation of markdown documentation
 * from GraphQL schema components.
 * @public
 * @abstract
 */
export abstract class IPrinter {
  /**
   * Initializes the printer with schema and configuration
   * @param schema - The GraphQL schema to process
   * @param baseURL - The base URL for generating links
   * @param linkRoot - The root path for relative links
   * @param options - Printer configuration options
   * @param mdxModule - Optional MDX module for rendering
   * @param mdxDeclaration - Optional MDX import declaration
   * @param eventEmitter - Optional event emitter for print events
   */
  static init(
    schema: Maybe<GraphQLSchema>,
    baseURL: string,
    linkRoot: string,
    options: Maybe<PrinterOptions>,
    mdxModule?: Partial<Formatter>,
    mdxDeclaration?: Maybe<string>,
    eventEmitter?: Maybe<PrinterEventEmitter>,
  ): Promise<void>;

  /**
   * Generates a markdown header for a type documentation
   * @param id - Unique identifier for the section
   * @param title - Title of the section
   * @param options - Combined printer configuration and options
   * @returns Markdown string containing the header
   */
  static printHeader(
    id: string,
    title: string,
    options: PrinterConfig & PrinterOptions,
  ): string;

  /**
   * Prints the description section for a type
   * @param type - The GraphQL type to document
   * @param options - Combined printer configuration and options
   * @param noText - Text to display when no description is available
   * @returns Markdown string containing the description
   */
  static printDescription(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
    noText: string,
  ): string;

  /**
   * Prints the code representation of a GraphQL type
   * @param type - The GraphQL type to document
   * @param options - Combined printer configuration and options
   * @returns Markdown string containing the code representation
   */
  static printCode(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): string;

  /**
   * Prints custom directives associated with a type
   * @param type - The GraphQL type to document
   * @param options - Combined printer configuration and options
   * @returns MDX string containing custom directives
   */
  static printCustomDirectives(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;

  /**
   * Prints custom tags associated with a type
   * @param type - The GraphQL type to document
   * @param options - Combined printer configuration and options
   * @returns MDX string containing custom tags
   */
  static printCustomTags(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;

  /**
   * Prints metadata information for a type
   * @param type - The GraphQL type to document
   * @param options - Combined printer configuration and options
   * @returns MDX string containing type metadata
   */
  static printTypeMetadata(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;

  /**
   * Prints related types and their relationships
   * @param type - The GraphQL type to document
   * @param options - Combined printer configuration and options
   * @returns MDX string containing related types
   */
  static printRelations(
    type: unknown,
    options: PrinterConfig & PrinterOptions,
  ): MDXString;

  /**
   * Prints complete documentation for a GraphQL type
   * @param name - The name of the type
   * @param type - The GraphQL type to document
   * @param options - Optional configuration options for printing
   * @returns Promise resolving to MDX string containing complete type documentation
   */
  static printType(
    name: string,
    type: unknown,
    options?: Maybe<Partial<PrintTypeOptions>>,
  ): Promise<Maybe<MDXString>>;
}

/**
 * Type representing the static side of IPrinter class
 * Used for type-safe access to static printer methods
 */
export type Printer = typeof IPrinter;

/**
 * Basic printer configuration
 */
export interface PrinterConfig {
  /** Base URL used for generating absolute links */
  baseURL: string;
  /** Root path for generating relative links */
  linkRoot: string;
  /** GraphQL schema to generate documentation from */
  schema: Maybe<GraphQLSchema>;
}

/**
 * Extended printer options for customizing documentation generation
 */
export interface PrinterOptions {
  /** Map of custom directive handlers */
  customDirectives?: Maybe<CustomDirectiveMap>;
  /** Configuration for handling deprecated types and fields */
  deprecated?: Maybe<TypeDeprecatedOption>;
  /** Schema entity grouping configuration */
  groups?: Maybe<SchemaEntitiesGroupMap>;
  /** Generator metadata options */
  meta?: Maybe<MetaInfo>;
  /** Custom metatags to include in documentation */
  metatags?: Maybe<Record<string, string>[]>;
  /** List of directives to exclusively include in documentation */
  onlyDocDirectives?: GraphQLDirective[];
  /** Type-specific printing options */
  printTypeOptions?: Maybe<ConfigPrintTypeOptions>;
  /** List of directives to exclude from documentation */
  skipDocDirectives?: GraphQLDirective[];
}
