import type {
  ApiGroupOverrideType,
  Category,
  CategorySortFn,
  Maybe,
  MDXString,
  MDXSupportType,
  Printer,
  RendererDocOptions,
  SchemaEntitiesGroupMap,
  SchemaEntity,
  TypeHierarchyObjectType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";

import { basename, join, relative, normalize } from "node:path";

import { isApiType, isDeprecated } from "@graphql-markdown/graphql";

import {
  copyFile,
  ensureDir,
  pathUrl,
  prettifyMarkdown,
  readFile,
  saveFile,
  startCase,
  slugify,
} from "@graphql-markdown/utils";

import { log, LogLevel } from "@graphql-markdown/logger";
import { TypeHierarchy } from "./config";
import { isGroupsObject, isPath } from "./directives/validation";
import { getEvents } from "./event-emitter";
import {
  GenerateIndexMetafileEvent,
  GenerateIndexMetafileEvents,
  RenderTypeEntitiesEvent,
  RenderTypeEntitiesEvents,
} from "./events";

/**
 * Constant representing the string literal for deprecated entities.
 * Used for grouping deprecated schema entities when the deprecated option is set to "group".
 *
 * @example
 * ```typescript
 * // When using the deprecated grouping option
 * if (isDeprecated(type)) {
 *   const groupName = DEPRECATED;
 *   // Handle deprecated type
 * }
 * ```
 */
const DEPRECATED = "deprecated" as const;

/**
 * CSS class names used for styling different categories in the generated documentation.
 * These are applied to the generated index metafiles for different section types.
 *
 * @example
 * ```typescript
 * // When generating API section metafiles
 * await generateIndexMetafile(dirPath, typeCat, {
 *   styleClass: CATEGORY_STYLE_CLASS.API
 * });
 * ```
 */
enum CATEGORY_STYLE_CLASS {
  /**
   * CSS class applied to API sections (operations)
   */
  API = "graphql-markdown-api-section",

  /**
   * CSS class applied to deprecated entity sections
   */
  DEPRECATED = "graphql-markdown-deprecated-section",
}

/**
 * Enum defining sidebar position values for ordering categories in the documentation sidebar.
 * Used to control the relative position of categories in the navigation.
 *
 * @example
 * ```typescript
 * // Position deprecated entities at the end of the sidebar
 * await generateIndexMetafile(dirPath, DEPRECATED, {
 *   sidebarPosition: SidebarPosition.LAST
 * });
 * ```
 */
enum SidebarPosition {
  /**
   * Position at the beginning of the sidebar
   */
  FIRST = 1,

  /**
   * Position at the end of the sidebar
   */
  LAST = 999,
}

/**
 * Default group names for API types and non-API types.
 * This constant provides the base folder structure for organizing GraphQL schema entities.
 * Can be overridden via ApiGroupOverrideType in configuration.
 *
 * @property operations Folder name for GraphQL operations (queries, mutations, subscriptions)
 * @property types Folder name for GraphQL type definitions
 *
 * @example
 * ```typescript
 * // Default structure
 * const defaultGroups = API_GROUPS;
 * // { operations: "operations", types: "types" }
 *
 * // With custom override
 * const customGroups = { ...API_GROUPS, operations: "queries-and-mutations" };
 * ```
 *
 * @see {@link getApiGroupFolder} For usage with type categorization
 */
export const API_GROUPS: Required<ApiGroupOverrideType> = {
  operations: "operations",
  types: "types",
} as const;

/**
 * Determines the appropriate folder for a GraphQL schema entity based on its type.
 *
 * @param type - The GraphQL schema entity to categorize
 * @param groups - Optional custom group naming configuration
 * @returns The folder name where the entity should be placed
 *
 * @example
 * ```typescript
 * // With default groups
 * const folder = getApiGroupFolder(queryType); // Returns "operations"
 *
 * // With custom groups
 * const folder = getApiGroupFolder(objectType, { operations: "queries" }); // Returns appropriate folder
 * ```
 */
export const getApiGroupFolder = (
  type: unknown,
  groups?: Maybe<ApiGroupOverrideType | boolean>,
): string => {
  let folderNames = API_GROUPS;
  if (isGroupsObject(groups)) {
    folderNames = { ...API_GROUPS, ...groups };
  }
  return isApiType(type) ? folderNames.operations : folderNames.types;
};

/**
 * Strips numeric prefix from a folder name if categorySort is enabled.
 * Converts folder names like "01-query" back to "query" for category identification.
 *
 * This is needed when extracting category names from file paths that were created
 * with categorySort enabled. The regex matches leading two-digit numbers
 * followed by a hyphen.
 *
 * @param folderName - The folder name to strip (e.g., "01-query", "02-mutations")
 * @returns The folder name without prefix (e.g., "query", "mutations")
 *
 * @example
 * ```typescript
 * stripNumericPrefix("01-query");      // Returns "query"
 * stripNumericPrefix("02-mutations");  // Returns "mutations"
 * stripNumericPrefix("objects");       // Returns "objects" (no prefix to strip)
 * ```
 */
const stripNumericPrefix = (folderName: string): string => {
  return folderName.replace(/^\d{2}-/, "");
};

/**
 * Type guard function that checks if the provided options include a specific hierarchy configuration.
 *
 * @param options - The renderer options to check
 * @param hierarchy - The hierarchy type to check for
 * @returns True if the options contain the specified hierarchy configuration
 *
 * @example
 * ```typescript
 * if (isHierarchy(options, TypeHierarchy.FLAT)) {
 *   // Handle flat hierarchy structure
 * }
 * ```
 */
const isHierarchy = (
  options: Maybe<RendererDocOptions>,
  hierarchy: TypeHierarchyValueType,
): options is RendererDocOptions & { hierarchy: TypeHierarchyObjectType } => {
  return options?.hierarchy?.[hierarchy] !== undefined;
};

/**
 * Configuration options for category metafiles in the documentation.
 * These options control the appearance and behavior of category sections in the sidebar.
 *
 * @interface CategoryMetafileOptions
 * @property [collapsible] - Whether the category should be collapsible in the sidebar
 * @property [collapsed] - Whether the category should be initially collapsed
 * @property [sidebarPosition] - Custom position in the sidebar (lower numbers appear first)
 * @property [styleClass] - CSS class to apply to the category for styling
 *
 * @example
 * ```typescript
 * const options: CategoryMetafileOptions = {
 *   collapsible: true,
 *   collapsed: false,
 *   sidebarPosition: SidebarPosition.FIRST,
 *   styleClass: CATEGORY_STYLE_CLASS.API
 * };
 * ```
 */
export interface CategoryMetafileOptions {
  collapsible?: boolean;
  collapsed?: boolean;
  sidebarPosition?: number;
  styleClass?: string;
}

/**
 * Default natural sorting function for categories.
 * Sorts categories alphabetically using localeCompare.
 *
 * @param a - First category name
 * @param b - Second category name
 * @returns Comparison result for sorting
 */
const naturalSort: CategorySortFn = (a: string, b: string): number => {
  return a.localeCompare(b);
};

/**
 * Manages category positions for the sidebar.
 * Supports two modes:
 * 1. Pre-registration: categories are registered upfront, positions computed once
 * 2. On-demand: positions are computed as categories are encountered
 *
 */
class CategoryPositionManager {
  private readonly categories = new Set<string>();
  private readonly positionCache = new Map<string, number>();
  private positionsComputed: boolean = false;
  private readonly sortFn: CategorySortFn;
  private readonly basePosition: number;

  /**
   * Creates a new CategoryPositionManager.
   *
   * @param sortFn - Function to sort categories (defaults to natural/alphabetical)
   * @param basePosition - Starting position for categories (defaults to 1)
   */
  constructor(sortFn?: CategorySortFn | "natural", basePosition = 1) {
    this.sortFn = sortFn === "natural" || !sortFn ? naturalSort : sortFn;
    this.basePosition = basePosition;
  }

  /**
   * Pre-registers a batch of category names.
   * This should be called before rendering to ensure consistent positioning.
   *
   * @param categoryNames - Array of category names to register
   */
  registerCategories(categoryNames: string[]): void {
    for (const name of categoryNames) {
      this.categories.add(name);
    }
  }

  /**
   * Computes positions for all registered categories.
   * This is called either manually after registration or automatically on first getPosition call.
   */
  computePositions(): void {
    if (this.positionsComputed) {
      return;
    }

    const sorted = Array.from(this.categories).sort(this.sortFn);
    for (let index = 0; index < sorted.length; index++) {
      this.positionCache.set(sorted[index], this.basePosition + index);
    }

    this.positionsComputed = true;
  }

  /**
   * Gets the assigned position for a category.
   * If category positions haven't been computed yet, computes them first.
   *
   * @param category - The category name
   * @returns The position assigned to this category or basePosition if not found
   */
  getPosition(category: string): number {
    // Ensure positions are computed first (uses pre-registered categories)
    if (!this.positionsComputed) {
      this.computePositions();
    }

    // Return cached position or base position if not found
    // NOTE: We don't dynamically add categories here to avoid breaking
    // pre-computed positions. This ensures consistent positioning even if
    // getPosition is called for categories that weren't pre-registered.
    return this.positionCache.get(category) ?? this.basePosition;
  }

  /**
   * Check if a category was pre-registered without triggering recomputation.
   * Used to determine hierarchy level (root vs nested) without side effects.
   *
   * @param category - Category name to check
   * @returns true if category was pre-registered
   */
  isRegistered(category: string): boolean {
    return this.categories.has(category);
  }
}

/**
 * Core renderer class responsible for generating documentation files from GraphQL schema entities.
 * Handles the conversion of schema types to markdown/MDX documentation with proper organization.
 *
 * HIERARCHY LEVELS WHEN categorySort IS ENABLED:
 * - Level 0 (root): Query, Mutation, Subscription, Custom Groups → 01-Query, 02-Mutation, etc.
 * - Level 1 (under root): Specific types within each root → 01-Objects, 02-Enums, etc.
 *
 * Each level has its own CategoryPositionManager that restarts numbering at 1.
 * @example
 */
export class Renderer {
  group: Maybe<SchemaEntitiesGroupMap>;
  outputDir: string;
  baseURL: string;
  prettify: boolean;
  options: Maybe<RendererDocOptions>;
  mdxModule: unknown;
  // mdxModuleIndexFileSupport: boolean;

  private readonly printer: Printer;
  private readonly rootLevelPositionManager: CategoryPositionManager;
  private readonly categoryPositionManager: CategoryPositionManager;

  /**
   * Creates a new Renderer instance.
   *
   * @param printer - The printer instance used to convert GraphQL types to markdown
   * @param outputDir - Directory where documentation will be generated
   * @param baseURL - Base URL for the documentation
   * @param group - Optional grouping configuration for schema entities
   * @param prettify - Whether to format the generated markdown
   * @param docOptions - Additional documentation options
   * @param mdxModule - Optional MDX module for enhanced documentation features
   * @example
   */
  constructor(
    printer: Printer,
    outputDir: string,
    baseURL: string,
    group: Maybe<SchemaEntitiesGroupMap>,
    prettify: boolean,
    docOptions: Maybe<RendererDocOptions>,
    mdxModule?: unknown,
  ) {
    this.printer = printer;

    this.group = group;
    this.outputDir = outputDir;
    this.baseURL = baseURL;
    this.prettify = prettify;
    this.options = docOptions;
    this.mdxModule = mdxModule;

    // Initialize position managers for different hierarchy levels
    // rootLevelPositionManager: for root-level categories (Query, Mutation, Deprecated, etc.)
    this.rootLevelPositionManager = new CategoryPositionManager(
      docOptions?.categorySort,
      1, // Start from 1 at root level
    );

    // categoryPositionManager: for categories within each root type (e.g., under Query)
    this.categoryPositionManager = new CategoryPositionManager(
      docOptions?.categorySort,
      1, // Start from 1 for each root type
    );
  }

  /**
   * Checks if the provided module supports MDX index file generation.
   *
   * @param module - The module to check for MDX support
   * @returns True if the module supports index metafile generation
   * @example
   */
  hasMDXHookSupport(
    hookName: keyof MDXSupportType,
    module: unknown = this.mdxModule,
  ): module is Partial<MDXSupportType> & Pick<MDXSupportType, typeof hookName> {
    return !!(
      module &&
      typeof module === "object" &&
      hookName in module &&
      typeof (module as Record<string, unknown>)[hookName] === "function"
    );
  }

  /**
   * Generates an index metafile for a category directory if MDX support is available.
   *
   * @param dirPath - The directory path where the index should be created
   * @param category - The category name
   * @param options - Configuration options for the index
   * @returns Promise that resolves when the index is generated
   *
   * @example
   * ```typescript
   * await renderer.generateIndexMetafile('docs/types', 'Types', {
   *   collapsible: true,
   *   collapsed: false
   * });
   * ```
   */
  async generateIndexMetafile(
    dirPath: string,
    category: string,
    options?: CategoryMetafileOptions,
  ): Promise<void> {
    const defaultOptions: CategoryMetafileOptions = {
      collapsible: true,
      collapsed: true,
    };
    const finalOptions = options ?? defaultOptions;

    const sidebarPosition =
      finalOptions.sidebarPosition ??
      this.categoryPositionManager.getPosition(category);

    const events = getEvents();
    const event = new GenerateIndexMetafileEvent({
      dirPath,
      category,
      options: {
        ...finalOptions,
        sidebarPosition,
        index: this.options?.index,
      },
    });
    const handlerErrors = await events.emitAsync(
      GenerateIndexMetafileEvents.BEFORE_GENERATE,
      event,
    );

    if (Array.isArray(handlerErrors) && handlerErrors.length > 0) {
      handlerErrors.forEach((error) => {
        if (error instanceof Error) {
          log(
            LogLevel.ERROR,
            `Error in BEFORE_GENERATE handler for GenerateIndexMetafileEvent: ${error.message}`,
            error,
          );
        } else {
          log(
            LogLevel.ERROR,
            "Error in BEFORE_GENERATE handler for GenerateIndexMetafileEvent (non-Error value).",
            { error },
          );
        }
      });
    }
  }

  /**
   * Generates the directory path and metafiles for a specific schema entity type.
   * Creates the appropriate directory structure based on configuration options.
   *
   * @param type - The schema entity type
   * @param name - The name of the schema entity
   * @param rootTypeName - The root type name this entity belongs to
   * @returns The generated directory path
   * @example
   */
  async generateCategoryMetafileType(
    type: unknown,
    name: string,
    rootTypeName: SchemaEntity,
  ): Promise<string> {
    let dirPath = this.outputDir;

    if (!isPath(dirPath)) {
      throw new Error("Output directory is empty or not specified");
    }

    if (isHierarchy(this.options, TypeHierarchy.FLAT)) {
      return dirPath;
    }

    // Deprecated gets highest priority - at ROOT level before even custom groups
    if (this.options?.deprecated === "group" && isDeprecated(type)) {
      const formattedDeprecated = this.formatCategoryFolderName(
        DEPRECATED,
        true,
      );
      dirPath = join(dirPath, formattedDeprecated);
      await this.generateIndexMetafile(dirPath, DEPRECATED, {
        sidebarPosition: SidebarPosition.LAST,
        styleClass: CATEGORY_STYLE_CLASS.DEPRECATED,
      });
    }

    // Custom groups come after deprecated but before hierarchy levels
    if (
      this.group &&
      rootTypeName in this.group &&
      name in this.group[rootTypeName]!
    ) {
      const rootGroup = this.group[rootTypeName]![name] ?? "";
      // Custom groups are always at ROOT level (they come after deprecated in hierarchy priority)
      const formattedRootGroup = this.formatCategoryFolderName(rootGroup, true);
      dirPath = join(dirPath, formattedRootGroup);
      await this.generateIndexMetafile(dirPath, rootGroup);
    }

    const useApiGroup = isHierarchy(this.options, TypeHierarchy.API)
      ? this.options.hierarchy[TypeHierarchy.API]
      : !isHierarchy(this.options, TypeHierarchy.ENTITY);

    if (useApiGroup) {
      const typeCat = getApiGroupFolder(type, useApiGroup);
      // API groups are root-level if no custom groups exist, nested if custom groups exist
      const isApiGroupRootLevel = !this.group;
      const formattedTypeCat = this.formatCategoryFolderName(
        typeCat,
        isApiGroupRootLevel,
      );
      dirPath = join(dirPath, formattedTypeCat);
      await this.generateIndexMetafile(dirPath, typeCat, {
        collapsible: false,
        collapsed: false,
        styleClass: CATEGORY_STYLE_CLASS.API,
      });
    }

    // Entity categories are:
    // - Root-level in entity hierarchy (only when no custom groups exist)
    // - Nested in API hierarchy
    // - Nested in entity hierarchy when custom groups exist
    const isRootTypeLevelCat = useApiGroup ? false : !this.group;
    const formattedRootTypeName = this.formatCategoryFolderName(
      rootTypeName,
      isRootTypeLevelCat,
    );
    dirPath = join(dirPath, formattedRootTypeName);
    await this.generateIndexMetafile(dirPath, rootTypeName);

    return dirPath;
  }

  /**
   * Renders all types within a root type category (e.g., all Query types).
   *
   * @param rootTypeName - The name of the root type (e.g., "Query", "Mutation")
   * @param type - The type object containing all entities to render
   * @returns Array of rendered categories or undefined
   * @example
   */
  async renderRootTypes(
    rootTypeName: SchemaEntity,
    type: unknown,
  ): Promise<Maybe<Maybe<Category>[]>> {
    if (typeof type !== "object" || type === null) {
      return undefined;
    }

    const isFlat = isHierarchy(this.options, TypeHierarchy.FLAT);
    return Promise.all(
      Object.keys(type).map(async (name) => {
        let dirPath = this.outputDir;

        if (!isFlat) {
          dirPath = await this.generateCategoryMetafileType(
            (type as Record<string, unknown>)[name],
            name,
            rootTypeName,
          );
        }

        return this.renderTypeEntities(
          dirPath,
          name,
          (type as Record<string, unknown>)[name],
        );
      }),
    );
  }

  /**
   * Renders documentation for a specific type entity and saves it to a file.
   *
   * @param dirPath - The directory path where the file should be saved
   * @param name - The name of the type entity
   * @param type - The type entity to render
   * @returns The category information for the rendered entity or undefined
   * @example
   */
  async renderTypeEntities(
    dirPath: string,
    name: string,
    type: unknown,
  ): Promise<Maybe<Category>> {
    if (!isPath(dirPath)) {
      throw new Error("Output directory is empty or not specified");
    }

    // Regex patterns to parse page metadata from file paths
    // Matches: path/to/category/page-name.md(x) or path\to\category\page-name.md(x)
    // Only allows alphanumeric and hyphens in category and page names
    // NOSONAR - pattern is safe, hyphen in character class doesn't cause backtracking
    const PageRegex =
      /(?<category>[a-z0-9-]+)[\\/]+(?<pageId>[a-z0-9-]+)\.mdx?$/i; // NOSONAR
    const PageRegexFlat = /(?<pageId>[a-z0-9-]+)\.mdx?$/i; // NOSONAR

    // allow mdxModule to specify custom extension
    let extension = "md";
    if (
      this.mdxModule &&
      typeof this.mdxModule === "object" &&
      "extension" in this.mdxModule &&
      typeof this.mdxModule.extension === "string"
    ) {
      extension = this.mdxModule.extension;
    } else if (this.mdxModule) {
      extension = "mdx";
    }

    const fileName = slugify(name);
    const filePath = join(normalize(dirPath), `${fileName}.${extension}`);

    let content: MDXString;
    try {
      const printOptions = {
        ...this.options,
        formatCategoryFolderName: (categoryName: string): string => {
          // Determine if this category should use root or nested formatting
          // First check if category was pre-registered as a root-level category
          if (this.rootLevelPositionManager.isRegistered(categoryName)) {
            return this.formatCategoryFolderName(categoryName, true);
          }
          // If not root-level, check if it's a nested category
          // Nested categories are handled dynamically without pre-registration
          // in some hierarchies (like API hierarchy where entity categories are
          // scoped within their parent API group)
          return this.formatCategoryFolderName(categoryName, false);
        },
      };
      content = this.printer.printType(fileName, type, printOptions);
      if (typeof content !== "string" || content === "") {
        return undefined;
      }
    } catch {
      log(`An error occurred while processing "${type}"`, LogLevel.warn);
      return undefined;
    }

    await saveFile(
      filePath,
      content,
      this.prettify ? prettifyMarkdown : undefined,
    );

    const pagePath = relative(this.outputDir, filePath);

    const isFlat = isHierarchy(this.options, TypeHierarchy.FLAT);

    const page = isFlat
      ? PageRegexFlat.exec(pagePath)
      : PageRegex.exec(pagePath);

    if (!page?.groups) {
      log(
        `An error occurred while processing file ${filePath} for type "${type}"`,
        LogLevel.warn,
      );
      return undefined;
    }

    // Strip numeric prefix from category if it was applied when categorySort is enabled
    const extractedCategory = isFlat
      ? page.groups.pageId
      : stripNumericPrefix(page.groups.category);

    const slug = isFlat
      ? page.groups.pageId
      : pathUrl.join(extractedCategory, page.groups.pageId);
    const category = isFlat ? "schema" : startCase(extractedCategory);

    const events = getEvents();
    const event = new RenderTypeEntitiesEvent({
      name,
      filePath,
    });
    await events.emitAsync(RenderTypeEntitiesEvents.AFTER_RENDER, event);

    return {
      category,
      slug,
    } as Category;
  }

  /**
   * Pre-collects all category names that will be generated during rendering.
   * This allows the position manager to assign consistent positions before
   * any files are written.
   *
   * HIERARCHY LEVELS:
   * - Root level: Query, Mutation, Subscription, Deprecated (when grouped), custom root groups
   * - Nested level: operations/types (API groups), custom groups under roots
   *
   * CRITICAL: Categories registered must match the NAMES USED BY THE PRINTER
   * when generating links. The printer uses plural forms from ROOT_TYPE_LOCALE:
   * "operations", "objects", "directives", "enums", "inputs", "interfaces",
   * "mutations", "queries", "scalars", "subscriptions", "unions"
   *
   * NOT the folder names: "operations", "types"
   *
   * @param rootTypeNames - Array of root type names from the schema
   */
  preCollectCategories(rootTypeNames: string[]): void {
    const rootCategories = new Set<string>();
    const nestedCategories = new Set<string>();

    // Skip if flat hierarchy
    if (isHierarchy(this.options, TypeHierarchy.FLAT)) {
      return;
    }

    // Determine if using API hierarchy
    const useApiGroup = isHierarchy(this.options, TypeHierarchy.API)
      ? this.options.hierarchy[TypeHierarchy.API]
      : !isHierarchy(this.options, TypeHierarchy.ENTITY);

    // Register custom groups at root level
    this.registerCustomGroups(rootCategories);

    // Register categories based on hierarchy type
    if (useApiGroup) {
      this.registerApiGroupCategories(
        rootCategories,
        nestedCategories,
        this.group !== undefined,
      );
    } else {
      this.registerEntityCategories(
        rootCategories,
        nestedCategories,
        rootTypeNames,
        this.group !== undefined,
      );
    }

    // Deprecated category - when grouped, it goes to root level
    if (this.options?.deprecated === "group") {
      rootCategories.add(DEPRECATED);
    }

    // Register collected categories with position managers
    this.registerCategoriesWithManagers(rootCategories, nestedCategories);
  }

  /**
   * Renders the homepage for the documentation from a template file.
   * Replaces placeholders in the template with actual values.
   *
   * @param homepageLocation - Path to the homepage template file
   * @returns Promise that resolves when the homepage is rendered
   * @example
   */
  async renderHomepage(homepageLocation: Maybe<string>): Promise<void> {
    if (typeof homepageLocation !== "string") {
      return;
    }

    if (!isPath(this.outputDir)) {
      throw new Error("Output directory is empty or not specified");
    }

    const homePage = basename(homepageLocation);
    const destLocation = join(this.outputDir, homePage);
    const slug = pathUrl.resolve("/", this.baseURL);

    try {
      await copyFile(homepageLocation, destLocation);

      const template = await readFile(destLocation);

      const data = template
        .toString()
        .replaceAll("##baseURL##", slug)
        .replaceAll("##generated-date-time##", new Date().toLocaleString());

      await saveFile(
        destLocation,
        data,
        this.prettify ? prettifyMarkdown : undefined,
      );
    } catch (error) {
      log(
        `An error occurred while processing the homepage ${homepageLocation}: ${error}`,
        LogLevel.warn,
      );
    }
  }

  /**
   * Registers custom group names from the current group configuration.
   * Custom groups are always registered at the ROOT level.
   *
   * @param rootCategories - Set to add custom group names to
   */
  private registerCustomGroups(rootCategories: Set<string>): void {
    if (!this.group) {
      return;
    }

    for (const rootTypeName in this.group) {
      for (const name in this.group[rootTypeName as SchemaEntity]) {
        const groupName = this.group[rootTypeName as SchemaEntity]![name];
        if (groupName) {
          rootCategories.add(groupName);
        }
      }
    }
  }

  /**
   * Registers API group categories (operations/types) based on hierarchy and group configuration.
   *
   * @param rootCategories - Set to add root-level categories
   * @param nestedCategories - Set to add nested-level categories
   * @param hasCustomGroups - Whether custom groups are configured
   */
  private registerApiGroupCategories(
    rootCategories: Set<string>,
    nestedCategories: Set<string>,
    hasCustomGroups: boolean,
  ): void {
    if (hasCustomGroups) {
      // Custom groups exist: operations/types are nested
      nestedCategories.add(API_GROUPS.operations);
      nestedCategories.add(API_GROUPS.types);
    } else {
      // No custom groups: operations/types are at ROOT level
      rootCategories.add(API_GROUPS.operations);
      rootCategories.add(API_GROUPS.types);
    }

    // Entity categories for API group - plural forms from ROOT_TYPE_LOCALE
    const entityCategoryNames = [
      "directives",
      "enums",
      "inputs",
      "interfaces",
      "mutations",
      "objects",
      "queries",
      "scalars",
      "subscriptions",
      "unions",
    ];
    for (const categoryName of entityCategoryNames) {
      nestedCategories.add(categoryName);
    }
  }

  /**
   * Registers entity hierarchy categories based on configuration.
   *
   * @param rootCategories - Set to add root-level categories
   * @param nestedCategories - Set to add nested-level categories
   * @param rootTypeNames - Array of root type names from schema
   * @param hasCustomGroups - Whether custom groups are configured
   */
  private registerEntityCategories(
    rootCategories: Set<string>,
    nestedCategories: Set<string>,
    rootTypeNames: string[],
    hasCustomGroups: boolean,
  ): void {
    for (const name of rootTypeNames) {
      if (hasCustomGroups) {
        // If custom groups exist, entity names go nested under them
        nestedCategories.add(name);
      } else {
        // If no custom groups, entity names are at root
        rootCategories.add(name);
      }
    }
  }

  /**
   * Registers collected categories with appropriate position managers.
   * Handles both hierarchical numbering (when categorySort is enabled) and traditional modes.
   *
   * @param rootCategories - Set of root-level categories
   * @param nestedCategories - Set of nested-level categories
   */
  private registerCategoriesWithManagers(
    rootCategories: Set<string>,
    nestedCategories: Set<string>,
  ): void {
    const hasCategorySort = this.options?.categorySort !== undefined;

    if (hasCategorySort) {
      // Register with hierarchical numbering when categorySort is enabled
      this.rootLevelPositionManager.registerCategories(
        Array.from(rootCategories),
      );
      this.rootLevelPositionManager.computePositions();

      this.categoryPositionManager.registerCategories(
        Array.from(nestedCategories),
      );
      this.categoryPositionManager.computePositions();
    } else {
      // Traditional separate handling when categorySort is not defined
      this.rootLevelPositionManager.registerCategories(
        Array.from(rootCategories),
      );
      this.rootLevelPositionManager.computePositions();

      if (nestedCategories.size > 0) {
        this.categoryPositionManager.registerCategories(
          Array.from(nestedCategories),
        );
        this.categoryPositionManager.computePositions();
      }
    }
  }

  /**
   * Formats a category folder name, optionally prefixing with an order number.
   *
   * Supports hierarchical numbering:
   * - Root level items (Query, Mutation, etc.) use rootLevelPositionManager
   * - Nested items (groups, types within roots) use categoryPositionManager
   *
   * @param categoryName - The category name to format
   * @param isRootLevel - Whether this category is at the root level (default: false for nested)
   * @returns The formatted folder name (e.g., "01-objects" if prefix is enabled)
   * @private
   */
  private formatCategoryFolderName(
    categoryName: string,
    isRootLevel: boolean = false,
  ): string {
    const hasCategorySort = this.options?.categorySort !== undefined;

    if (!hasCategorySort) {
      return slugify(categoryName);
    }

    try {
      // Choose the appropriate position manager based on hierarchy level
      const manager = isRootLevel
        ? this.rootLevelPositionManager
        : this.categoryPositionManager;

      const position = manager.getPosition(categoryName);

      if (!position) {
        return slugify(categoryName);
      }

      const paddedPosition = String(position).padStart(2, "0");
      const slugifiedName = slugify(categoryName);
      const result = `${paddedPosition}-${slugifiedName}`;

      return result;
    } catch {
      return slugify(categoryName);
    }
  }
}

/**
 * Factory function to create and initialize a Renderer instance.
 * Creates the output directory and returns a configured renderer.
 *
 * @param printer - The printer instance to use for rendering types
 * @param outputDir - The output directory for generated documentation
 * @param baseURL - The base URL for the documentation
 * @param group - Optional grouping configuration
 * @param prettify - Whether to prettify the output markdown
 * @param docOptions - Additional documentation options
 * @param mdxModule - Optional MDX module for enhanced features
 * @returns A configured Renderer instance
 *
 * @example
 * ```typescript
 * const renderer = await getRenderer(
 *   myPrinter,
 *   './docs',
 *   '/api',
 *   groupConfig,
 *   true,
 *   { force: true, index: true }
 * );
 * ```
 */
export const getRenderer = async (
  printer: Printer,
  outputDir: string,
  baseURL: string,
  group: Maybe<SchemaEntitiesGroupMap>,
  prettify: boolean,
  docOptions: Maybe<RendererDocOptions>,
  mdxModule?: unknown,
): Promise<InstanceType<typeof Renderer>> => {
  await ensureDir(outputDir, { forceEmpty: docOptions?.force });
  return new Renderer(
    printer,
    outputDir,
    baseURL,
    group,
    prettify,
    docOptions,
    mdxModule,
  );
};
