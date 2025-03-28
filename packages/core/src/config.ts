/**
 * Configuration management for GraphQL Markdown.
 *
 * This module handles all aspects of configuration including:
 * - Loading and merging configuration from multiple sources
 * - Validating configuration values
 * - Providing defaults for missing options
 * - Processing special configuration options (directives, deprecated items, etc)
 *
 * The configuration follows this precedence (highest to lowest):
 * 1. CLI arguments
 * 2. Config file options
 * 3. GraphQL Config options
 * 4. Default values
 *
 * @packageDocumentation
 */

import { join } from "node:path";
import { tmpdir } from "node:os";

import type {
  CliOptions,
  ConfigDocOptions,
  ConfigOptions,
  ConfigPrintTypeOptions,
  CustomDirective,
  DeprecatedCliOptions,
  DeprecatedConfigDocOptions,
  DeprecatedConfigPrintTypeOptions,
  DirectiveName,
  FrontMatterOptions,
  GroupByDirectiveOptions,
  Maybe,
  Options,
  PackageName,
  Pointer,
  TypeDeprecatedOption,
  TypeDiffMethod,
  TypeHierarchyObjectType,
  TypeHierarchyType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";

import { loadConfiguration } from "./graphql-config";

/**
 * Type hierarchy options for organizing schema documentation.
 *
 * - API: Groups types by their role in the API (Query, Mutation, etc.)
 * - ENTITY: Groups types by their entity relationships
 * - FLAT: No grouping, all types in a flat structure
 *
 * @public
 * @example
 * ```typescript
 * const hierarchy = TypeHierarchy.API;
 * ```
 */
export enum TypeHierarchy {
  API = "api",
  ENTITY = "entity",
  FLAT = "flat",
}

/**
 * Diff methods used to determine how schema changes are processed.
 *
 * - NONE: No diffing is performed
 * - FORCE: Force regeneration of documentation regardless of schema changes
 *
 * @public
 * @example
 * ```typescript
 * const diffMethod = DiffMethod.FORCE;
 * ```
 */
export enum DiffMethod {
  NONE = "NONE",
  FORCE = "FORCE",
}

/**
 * Options for handling deprecated items in the schema.
 *
 * - DEFAULT: Show deprecated items normally
 * - GROUP: Group deprecated items separately
 * - SKIP: Exclude deprecated items from documentation
 *
 * @public
 * @example
 * ```typescript
 * const deprecatedHandling = DeprecatedOption.GROUP;
 * ```
 */
export enum DeprecatedOption {
  DEFAULT = "default",
  GROUP = "group",
  SKIP = "skip",
}

/**
 * Documentation website URL for reference in error messages and help text.
 * @public
 */
export const DOCS_URL = "https://graphql-markdown.dev/docs" as const;

/**
 * Default package name used for temporary directory creation and identification.
 * @public
 */
export const PACKAGE_NAME = "@graphql-markdown/docusaurus" as const;

/**
 * Location of the default homepage template.
 * @public
 */
export const ASSET_HOMEPAGE_LOCATION = join(
  __dirname,
  "..",
  "assets",
  "generated.md",
);

/**
 * Default hierarchy configuration using the API hierarchy type.
 * @public
 */
export const DEFAULT_HIERARCHY = { [TypeHierarchy.API]: {} };

/**
 * Default configuration options used when no user options are provided.
 * These values serve as fallbacks for any missing configuration.
 *
 * @public
 * @see {@link Options} for the complete configuration interface
 */
export const DEFAULT_OPTIONS: Readonly<
  Pick<ConfigOptions, "customDirective" | "groupByDirective" | "loaders"> &
    Required<
      Omit<
        ConfigOptions,
        | "customDirective"
        | "groupByDirective"
        | "loaders"
        | "mdxParser"
        | "printTypeOptions"
      >
    >
> & {
  printTypeOptions: Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & {
    hierarchy: Required<Pick<TypeHierarchyObjectType, TypeHierarchy.API>>;
  };
} = {
  id: "default" as const,
  baseURL: "schema" as const,
  customDirective: undefined,
  diffMethod: DiffMethod.NONE as TypeDiffMethod,
  docOptions: {
    frontMatter: {} as FrontMatterOptions,
    index: false as const,
  } as Required<
    Pick<ConfigDocOptions & DeprecatedConfigDocOptions, "frontMatter" | "index">
  >,
  force: false as const,
  groupByDirective: undefined,
  homepage: ASSET_HOMEPAGE_LOCATION,
  linkRoot: "/" as const,
  loaders: undefined,
  metatags: [] as Record<string, string>[],
  pretty: false as const,
  printer: "@graphql-markdown/printer-legacy" as PackageName,
  printTypeOptions: {
    codeSection: true as const,
    deprecated: DeprecatedOption.DEFAULT as TypeDeprecatedOption,
    exampleSection: false as const,
    parentTypePrefix: true as const,
    relatedTypeSection: true as const,
    typeBadges: true as const,
  } as Required<Omit<ConfigPrintTypeOptions, "hierarchy">> & {
    hierarchy: Required<Pick<TypeHierarchyObjectType, TypeHierarchy.API>>;
  },
  rootPath: "./docs" as const,
  schema: "./schema.graphql" as Pointer,
  tmpDir: join(tmpdir(), PACKAGE_NAME),
  skipDocDirective: [] as DirectiveName[],
  onlyDocDirective: [] as DirectiveName[],
} as const;

/**
 * Retrieves a directive name from a string by parsing and validating the format.
 * Directive names should be prefixed with '\@' (e.g., '\@example').
 *
 * @param name - The directive name as a string, which should follow the format '\@directiveName'
 * @returns The validated directive name without the '\@' prefix
 * @throws Error if the directive name format is invalid
 * @example
 * ```typescript
 * const directive = getDocDirective("@example");
 * console.log(directive); // "example"
 *
 * // Invalid - will throw an error
 * getDocDirective("example"); // Error: Invalid "example"
 * ```
 */
export const getDocDirective = (name: Maybe<DirectiveName>): DirectiveName => {
  const OPTION_REGEX = /^@(?<directive>\w+)$/;

  if (typeof name !== "string" || !OPTION_REGEX.test(name)) {
    throw new Error(`Invalid "${name}"`);
  }

  const {
    groups: { directive },
  } = OPTION_REGEX.exec(name) as RegExpExecArray & {
    groups: { directive: DirectiveName };
  };

  return directive;
};

/**
 * Retrieves the list of "only" directives from CLI and config options.
 * These directives specify which schema elements should be included in the documentation.
 *
 * @param cliOpts - CLI options containing "only" directives
 * @param configFileOpts - Config file options containing "onlyDocDirective"
 * @returns An array of validated "only" directives (without '\@' prefix)
 * @example
 * ```typescript
 * const cliOptions = { only: ["@example", "@internal"] };
 * const configOptions = { onlyDocDirective: ["@auth"] };
 *
 * const onlyDirectives = getOnlyDocDirectives(cliOptions, configOptions);
 * console.log(onlyDirectives); // ["example", "internal", "auth"]
 * ```
 * @see {@link getDocDirective} for directive name validation
 */
export const getOnlyDocDirectives = (
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<Pick<ConfigOptions, "onlyDocDirective">>,
): DirectiveName[] => {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.only ?? []) as never[],
    (configFileOpts?.onlyDocDirective ?? []) as never[],
  );

  const onlyDirectives = directiveList.map((directiveName) => {
    return getDocDirective(directiveName);
  });

  return onlyDirectives;
};

/**
 * Retrieves the list of "skip" directives from CLI and config options.
 * These directives specify which schema elements should be excluded from the documentation.
 * Additionally, if deprecated handling is set to SKIP, adds the "deprecated" directive.
 *
 * @param cliOpts - CLI options containing "skip" directives
 * @param configFileOpts - Config file options containing "skipDocDirective" and potentially "printTypeOptions.deprecated"
 * @returns An array of validated "skip" directives (without '\@' prefix)
 * @example
 * ```typescript
 * const cliOptions = { skip: ["@internal"], deprecated: "skip" };
 * const configOptions = { skipDocDirective: ["@auth"] };
 *
 * const skipDirectives = getSkipDocDirectives(cliOptions, configOptions);
 * console.log(skipDirectives); // ["internal", "auth", "deprecated"]
 * ```
 * @see {@link getDocDirective} for directive name validation
 * @see {@link DeprecatedOption} for deprecated handling options
 */
export const getSkipDocDirectives = (
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<
    Pick<ConfigOptions, "printTypeOptions" | "skipDocDirective">
  >,
): DirectiveName[] => {
  const directiveList: DirectiveName[] = [].concat(
    (cliOpts?.skip ?? []) as never[],
    (configFileOpts?.skipDocDirective ?? []) as never[],
  );

  const skipDirectives = directiveList.map((directiveName) => {
    return getDocDirective(directiveName);
  });

  if (
    (configFileOpts &&
      configFileOpts.printTypeOptions?.deprecated === DeprecatedOption.SKIP) ||
    (cliOpts && cliOpts.deprecated === DeprecatedOption.SKIP)
  ) {
    skipDirectives.push("deprecated" as DirectiveName);
  }

  return skipDirectives;
};

/**
 * Combines and validates visibility directives (only and skip) from both CLI and config sources.
 * Ensures that no directive appears in both "only" and "skip" lists simultaneously.
 *
 * @param cliOpts - CLI options containing "only" and "skip" directives
 * @param configFileOpts - Config file options containing directive configurations
 * @returns An object with validated "onlyDocDirective" and "skipDocDirective" arrays
 * @throws Error if the same directive appears in both "only" and "skip" lists
 * @example
 * ```typescript
 * const cliOptions = { only: ["@example"], skip: ["@internal"] };
 * const configOptions = { onlyDocDirective: ["@auth"] };
 *
 * const visibilityDirectives = getVisibilityDirectives(cliOptions, configOptions);
 * console.log(visibilityDirectives);
 * // {
 * //   onlyDocDirective: ["example", "auth"],
 * //   skipDocDirective: ["internal"]
 * // }
 *
 * // Invalid - will throw an error
 * getVisibilityDirectives(
 *   { only: ["@example"], skip: ["@example"] },
 *   {}
 * ); // Error: The same directive cannot be declared in 'onlyDocDirective' and 'skipDocDirective'.
 * ```
 * @see {@link getOnlyDocDirectives} and {@link getSkipDocDirectives} for directive retrieval
 */
export const getVisibilityDirectives = (
  cliOpts: Maybe<CliOptions>,
  configFileOpts: Maybe<
    Pick<
      ConfigOptions,
      "onlyDocDirective" | "printTypeOptions" | "skipDocDirective"
    >
  >,
): { onlyDocDirective: DirectiveName[]; skipDocDirective: DirectiveName[] } => {
  const skipDocDirective = getSkipDocDirectives(cliOpts, configFileOpts);
  const onlyDocDirective = getOnlyDocDirectives(cliOpts, configFileOpts);

  if (
    onlyDocDirective.some((directiveName) => {
      return skipDocDirective.includes(directiveName);
    })
  ) {
    throw new Error(
      "The same directive cannot be declared in 'onlyDocDirective' and 'skipDocDirective'.",
    );
  }

  return { onlyDocDirective, skipDocDirective };
};

/**
 * Processes custom directives, filtering out any that should be skipped.
 * Validates that each custom directive has the correct format with required functions.
 *
 * @param customDirectiveOptions - The custom directive configuration object
 * @param skipDocDirective - Array of directive names that should be skipped
 * @returns The filtered custom directives object, or undefined if empty/invalid
 * @throws Error if a custom directive has an invalid format
 * @example
 * ```typescript
 * // Valid custom directive with tag function
 * const customDirectives = {
 *   example: {
 *     tag: (value) => `Example: ${value}`
 *   },
 *   todo: {
 *     descriptor: () => "TODO items"
 *   }
 * };
 *
 * // Filter out the "example" directive
 * const filteredDirectives = getCustomDirectives(customDirectives, ["example"]);
 * console.log(filteredDirectives); // { todo: { descriptor: [Function] } }
 *
 * // Invalid format - will throw an error
 * getCustomDirectives({ example: { invalid: true } }, []);
 * // Error: Wrong format for plugin custom directive "example"...
 * ```
 * @see {@link DOCS_URL}/advanced/custom-directive for custom directive format documentation
 */
export const getCustomDirectives = (
  customDirectiveOptions: Maybe<CustomDirective>,
  skipDocDirective?: Maybe<DirectiveName[]>,
): Maybe<CustomDirective> => {
  if (
    !customDirectiveOptions ||
    Object.keys(customDirectiveOptions).length === 0
  ) {
    return undefined;
  }

  for (const [name, option] of Object.entries(customDirectiveOptions)) {
    if (
      Array.isArray(skipDocDirective) &&
      skipDocDirective.includes(name as DirectiveName)
    ) {
      delete customDirectiveOptions[name as DirectiveName];
    } else if (
      ("descriptor" in option && typeof option.descriptor !== "function") ||
      ("tag" in option && typeof option.tag !== "function") ||
      !("tag" in option || "descriptor" in option)
    ) {
      throw new Error(
        `Wrong format for plugin custom directive "${name}".\nPlease refer to ${DOCS_URL}/advanced/custom-directive`,
      );
    }
  }

  return Object.keys(customDirectiveOptions).length === 0
    ? undefined
    : customDirectiveOptions;
};

/**
 * Determines the diff method to use based on the configuration and force flag.
 * If force is true, always returns FORCE regardless of the configured diff method.
 *
 * @param diff - The configured diff method
 * @param force - Whether to force regeneration (overrides diff setting)
 * @returns The resolved diff method to use
 * @example
 * ```typescript
 * // Normal usage - respects the configured diff method
 * const method1 = getDiffMethod(DiffMethod.NONE, false);
 * console.log(method1); // "NONE"
 *
 * // Force flag overrides the diff method
 * const method2 = getDiffMethod(DiffMethod.NONE, true);
 * console.log(method2); // "FORCE"
 * ```
 * @see {@link DiffMethod} for available diff methods
 */
export const getDiffMethod = (
  diff: TypeDiffMethod,
  force: boolean = false,
): TypeDiffMethod => {
  return force
    ? DiffMethod.FORCE
    : (diff.toLocaleUpperCase() as TypeDiffMethod);
};

/**
 * Placeholder function for handling deprecated document options.
 * Currently returns an empty object as these options are deprecated.
 *
 * @param _cliOpts - Deprecated CLI options (unused)
 * @param _configOptions - Deprecated config options (unused)
 * @returns An empty object
 */
export const parseDeprecatedDocOptions = (
  _cliOpts: Maybe<Omit<DeprecatedCliOptions, "never">>,
  _configOptions: Maybe<Omit<DeprecatedConfigDocOptions, "never">>,
): Record<string, never> => {
  return {};
};

/**
 * Builds the document options by merging CLI options, config file options, and defaults.
 * Handles index generation flag and front matter configuration.
 *
 * @param cliOpts - CLI options for document generation
 * @param configOptions - Config file options for document generation
 * @returns The resolved document options with all required fields
 * @example
 * ```typescript
 * const cliOptions = { index: true };
 * const configOptions = { frontMatter: { sidebar_label: 'API' } };
 *
 * const docOptions = getDocOptions(cliOptions, configOptions);
 * console.log(docOptions);
 * // {
 * //   index: true,
 * //   frontMatter: { sidebar_label: 'API' }
 * // }
 * ```
 */
export const getDocOptions = (
  cliOpts?: Maybe<CliOptions & Omit<DeprecatedCliOptions, "never">>,
  configOptions?: Maybe<
    ConfigDocOptions & Omit<DeprecatedConfigDocOptions, "never">
  >,
): Required<ConfigDocOptions> => {
  const deprecated = parseDeprecatedDocOptions(cliOpts, configOptions);
  const index =
    typeof cliOpts?.index === "boolean"
      ? cliOpts.index
      : typeof configOptions?.index === "boolean"
        ? configOptions.index
        : DEFAULT_OPTIONS.docOptions!.index;
  return {
    frontMatter: {
      ...deprecated,
      ...configOptions?.frontMatter,
    },
    index,
  } as Required<ConfigDocOptions>;
};

/**
 * Resolves the type hierarchy configuration by merging CLI and config file options.
 * Validates that CLI and config don't specify conflicting hierarchy types.
 *
 * @param cliOption - The hierarchy option specified via CLI (string value)
 * @param configOption - The hierarchy option from the config file (string or object)
 * @returns The resolved type hierarchy object
 * @throws Error if CLI and config specify conflicting hierarchy types
 * @example
 * ```typescript
 * // Using hierarchy from CLI (string format)
 * const hierarchy1 = getTypeHierarchyOption("api", undefined);
 * console.log(hierarchy1); // { api: {} }
 *
 * // Using hierarchy from config (object format)
 * const hierarchy2 = getTypeHierarchyOption(undefined, { entity: { User: ["posts"] } });
 * console.log(hierarchy2); // { entity: { User: ["posts"] } }
 *
 * // Error case - conflicting hierarchies
 * getTypeHierarchyOption("api", { entity: {} });
 * // Error: Hierarchy option mismatch in CLI flag 'api' and config 'entity'
 * ```
 * @see {@link TypeHierarchy} for available hierarchy types
 */
export const getTypeHierarchyOption = (
  cliOption?: Maybe<TypeHierarchyValueType>,
  configOption?: Maybe<TypeHierarchyType>,
): Maybe<TypeHierarchyObjectType> => {
  const parseValue = (
    config?: Maybe<TypeHierarchyType>,
  ): Maybe<TypeHierarchyObjectType> => {
    if (typeof config === "string") {
      switch (true) {
        case new RegExp(`^${TypeHierarchy.ENTITY}$`, "i").test(config):
          return { [TypeHierarchy.ENTITY]: {} };
        case new RegExp(`^${TypeHierarchy.FLAT}$`, "i").test(config):
          return { [TypeHierarchy.FLAT]: {} };
        case new RegExp(`^${TypeHierarchy.API}$`, "i").test(config):
          return { [TypeHierarchy.API]: {} };
        default:
          return undefined;
      }
    }
    return config;
  };

  const toStringHierarchy = (
    hierarchy: Maybe<TypeHierarchyObjectType>,
  ): Maybe<TypeHierarchyValueType> => {
    return hierarchy && (Object.keys(hierarchy)[0] as TypeHierarchyValueType);
  };

  const cliHierarchy = parseValue(cliOption);
  const configHierarchy = parseValue(configOption);

  if (cliHierarchy && configHierarchy) {
    const strCliHierarchy = toStringHierarchy(cliHierarchy);
    const strConfigHierarchy = toStringHierarchy(configHierarchy);
    if (strCliHierarchy !== strConfigHierarchy) {
      throw new Error(
        `Hierarchy option mismatch in CLI flag '${strCliHierarchy}' and config '${strConfigHierarchy}'`,
      );
    }
  }

  return cliHierarchy ?? configHierarchy ?? DEFAULT_HIERARCHY;
};

/**
 * Placeholder function for handling deprecated print type options.
 * Currently returns an empty object as these options are deprecated.
 *
 * @param _cliOpts - Deprecated CLI options (unused)
 * @param _configOptions - Deprecated config options (unused)
 * @returns An empty object
 */
export const parseDeprecatedPrintTypeOptions = (
  _cliOpts: Maybe<Omit<DeprecatedCliOptions, "never">>,
  _configOptions: Maybe<Omit<DeprecatedConfigPrintTypeOptions, "never">>,
): Record<string, never> => {
  return {};
};

/**
 * Builds the print type options by merging CLI options, config file options, and defaults.
 * Handles various formatting options for type documentation.
 *
 * @param cliOpts - CLI options for print type configuration
 * @param configOptions - Config file options for print type configuration
 * @returns The resolved print type options with all required fields
 * @example
 * ```typescript
 * const cliOptions = { noCode: true, deprecated: "group" };
 * const configOptions = {
 *   exampleSection: true,
 *   hierarchy: "entity"
 * };
 *
 * const printOptions = getPrintTypeOptions(cliOptions, configOptions);
 * console.log(printOptions);
 * // {
 * //   codeSection: false,  // Disabled via noCode CLI flag
 * //   deprecated: "group", // From CLI
 * //   exampleSection: true, // From config
 * //   parentTypePrefix: true, // Default value
 * //   relatedTypeSection: true, // Default value
 * //   typeBadges: true, // Default value
 * //   hierarchy: { entity: {} } // Parsed from config
 * // }
 * ```
 * @see {@link DeprecatedOption} for deprecated handling options
 * @see {@link getTypeHierarchyOption} for hierarchy resolution
 */
export const getPrintTypeOptions = (
  cliOpts: Maybe<CliOptions & Omit<DeprecatedCliOptions, "never">>,
  configOptions: Maybe<
    ConfigPrintTypeOptions & Omit<DeprecatedConfigPrintTypeOptions, "never">
  >,
): Required<ConfigPrintTypeOptions> => {
  const deprecated = parseDeprecatedPrintTypeOptions(cliOpts, configOptions);
  return {
    ...deprecated,
    codeSection:
      (!cliOpts?.noCode && configOptions?.codeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.codeSection,
    deprecated: (
      (cliOpts?.deprecated ??
        configOptions?.deprecated ??
        DEFAULT_OPTIONS.printTypeOptions.deprecated) as string
    ).toLocaleLowerCase() as TypeDeprecatedOption,
    exampleSection:
      (!cliOpts?.noExample && configOptions?.exampleSection) ??
      DEFAULT_OPTIONS.printTypeOptions.exampleSection,
    parentTypePrefix:
      (!cliOpts?.noParentType && configOptions?.parentTypePrefix) ??
      DEFAULT_OPTIONS.printTypeOptions.parentTypePrefix,
    relatedTypeSection:
      (!cliOpts?.noRelatedType && configOptions?.relatedTypeSection) ??
      DEFAULT_OPTIONS.printTypeOptions.relatedTypeSection,
    typeBadges:
      (!cliOpts?.noTypeBadges && configOptions?.typeBadges) ??
      DEFAULT_OPTIONS.printTypeOptions.typeBadges,
    hierarchy: getTypeHierarchyOption(
      cliOpts?.hierarchy,
      configOptions?.hierarchy,
    ),
  } as Required<ConfigPrintTypeOptions>;
};

/**
 * Parses and validates the groupByDirective option string format.
 * The format should be \@directive(field|=fallback) where:
 * - directive: Name of the directive to group by
 * - field: Name of the field in the directive to use for grouping
 * - fallback: (Optional) Fallback group name for items without the directive
 *
 * @param groupOptions - The group directive option as a string
 * @returns A parsed GroupByDirectiveOptions object or undefined if invalid
 * @throws Error if the groupByDirective format is invalid
 * @example
 * ```typescript
 * // Basic usage with directive and field
 * const groupBy1 = parseGroupByOption("@tag(name)");
 * console.log(groupBy1);
 * // { directive: "tag", field: "name", fallback: "Miscellaneous" }
 *
 * // With custom fallback group
 * const groupBy2 = parseGroupByOption("@category(name|=Other)");
 * console.log(groupBy2);
 * // { directive: "category", field: "name", fallback: "Other" }
 *
 * // Invalid format - will throw an error
 * parseGroupByOption("invalid-format");
 * // Error: Invalid "invalid-format"
 * ```
 */
export const parseGroupByOption = (
  groupOptions: unknown,
): Maybe<GroupByDirectiveOptions> => {
  const DEFAULT_GROUP = "Miscellaneous";
  const OPTION_REGEX =
    /^@(?<directive>\w+)\((?<field>\w+)(?:\|=(?<fallback>\w+))?\)/;

  if (typeof groupOptions !== "string") {
    return undefined;
  }

  const parsedOptions = OPTION_REGEX.exec(groupOptions);

  if (typeof parsedOptions === "undefined" || parsedOptions === null) {
    throw new Error(`Invalid "${groupOptions}"`);
  }

  if (!("groups" in parsedOptions)) {
    return undefined;
  }

  const {
    directive,
    field,
    fallback = DEFAULT_GROUP,
  } = parsedOptions.groups as unknown as GroupByDirectiveOptions;
  return { directive, field, fallback } as GroupByDirectiveOptions;
};

/**
 * Builds the complete configuration object by merging options from multiple sources
 * in order of precedence:
 * 1. CLI options (highest priority)
 * 2. Configuration file options
 * 3. GraphQL Config options
 * 4. Default options (lowest priority)
 *
 * @param configFileOpts - Options from the configuration file
 * @param cliOpts - Options from the command line interface
 * @param id - The configuration ID used when referencing multiple schemas
 * @returns A promise resolving to the final merged configuration object
 * @example
 * ```typescript
 * // Basic usage with minimal options
 * const config = await buildConfig(
 *   { baseURL: "api" }, // Config file options
 *   { pretty: true }    // CLI options
 * );
 *
 * // With specific config ID
 * const config = await buildConfig(
 *   { schema: "./schemas/users.graphql" },
 *   { force: true },
 *   "users"
 * );
 *
 * // The resulting config will contain all required options
 * // with values from CLI taking precedence over config file,
 * // and defaults filling in any missing values
 * ```
 * @see {@link Options} for the complete configuration interface
 * @see {@link DEFAULT_OPTIONS} for default values
 */
export const buildConfig = async (
  configFileOpts: Maybe<ConfigOptions>,
  cliOpts?: Maybe<CliOptions>,
  id: Maybe<string> = "default",
): Promise<Options> => {
  cliOpts ??= {};

  const graphqlConfig = await loadConfiguration(id);
  const config: ConfigOptions = {
    ...DEFAULT_OPTIONS,
    ...graphqlConfig,
    ...configFileOpts,
  } as const;

  const baseURL: string = cliOpts.base ?? config.baseURL!;
  const { onlyDocDirective, skipDocDirective } = getVisibilityDirectives(
    cliOpts,
    config,
  );

  const force = cliOpts.force ?? config.force ?? DEFAULT_OPTIONS.force;

  return {
    baseURL,
    customDirective: getCustomDirectives(
      config.customDirective,
      skipDocDirective,
    ),
    diffMethod: getDiffMethod(cliOpts.diff ?? config.diffMethod!, force),
    docOptions: getDocOptions(cliOpts, config.docOptions),
    force,
    groupByDirective:
      parseGroupByOption(cliOpts.groupByDirective) ?? config.groupByDirective,
    homepageLocation:
      cliOpts.homepage ?? config.homepage ?? DEFAULT_OPTIONS.homepage,
    id: id ?? DEFAULT_OPTIONS.id,
    linkRoot: cliOpts.link ?? config.linkRoot ?? DEFAULT_OPTIONS.linkRoot,
    loaders: config.loaders,
    mdxParser: cliOpts.mdxParser ?? config.mdxParser,
    metatags: config.metatags ?? DEFAULT_OPTIONS.metatags,
    onlyDocDirective,
    outputDir: join(cliOpts.root ?? config.rootPath!, baseURL),
    prettify: cliOpts.pretty ?? config.pretty ?? DEFAULT_OPTIONS.pretty,
    printer: (config.printer ?? DEFAULT_OPTIONS.printer)!,
    printTypeOptions: getPrintTypeOptions(cliOpts, config.printTypeOptions),
    schemaLocation: cliOpts.schema ?? config.schema ?? DEFAULT_OPTIONS.schema,
    skipDocDirective,
    tmpDir: cliOpts.tmp ?? config.tmpDir ?? DEFAULT_OPTIONS.tmpDir,
  } as Options;
};
