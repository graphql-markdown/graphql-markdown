import type {
  ApiGroupOverrideType,
  Category,
  CategorySortFn,
  LocationPath,
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
 * @useDeclaredType
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
 * @useDeclaredType
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
  if (groups && typeof groups === "object") {
    folderNames = { ...API_GROUPS, ...groups };
  }
  return isApiType(type) ? folderNames.operations : folderNames.types;
};

/**
 * Type guard function that checks if the provided options include a specific hierarchy configuration.
 *
 * @param options - The renderer options to check
 * @param hierarchy - The hierarchy type to check for
 * @returns True if the options contain the specified hierarchy configuration
 * @useDeclaredType
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
  return (options?.hierarchy?.[hierarchy] && true) as boolean;
};

const isPath = (path: unknown): path is LocationPath => {
  return typeof path === "string" && path !== "";
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
 * @useDeclaredType
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
 * @useDeclaredType
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
    for (const [index, category] of sorted.entries()) {
      this.positionCache.set(category, this.basePosition + index);
    }

    this.positionsComputed = true;
  }

  /**
   * Gets the assigned position for a category.
   * If category positions haven't been computed yet, computes them first.
   *
   * @param category - The category name
   * @returns The position assigned to this category
   */
  getPosition(category: string): number {
    // Add to categories if not already present
    if (!this.categories.has(category)) {
      this.categories.add(category);
      // If positions were already computed, we need to recompute
      if (this.positionsComputed) {
        this.positionsComputed = false;
      }
    }

    // Ensure positions are computed
    if (!this.positionsComputed) {
      this.computePositions();
    }

    return this.positionCache.get(category) ?? this.basePosition;
  }

  /**
   * Creates a scoped position manager for nested categories.
   *
   * @param sortFn - Function to sort categories (defaults to parent's sort function)
   * @param basePosition - Starting position for nested categories
   * @returns A new CategoryPositionManager instance
   */
  createScope(
    sortFn?: CategorySortFn | "natural",
    basePosition?: number,
  ): CategoryPositionManager {
    return new CategoryPositionManager(sortFn ?? this.sortFn, basePosition);
  }
}

/**
 * Core renderer class responsible for generating documentation files from GraphQL schema entities.
 * Handles the conversion of schema types to markdown/MDX documentation with proper organization.
 * @useDeclaredType
 * @example
 */
export class Renderer {
  group: Maybe<SchemaEntitiesGroupMap>;
  outputDir: string;
  baseURL: string;
  prettify: boolean;
  options: Maybe<RendererDocOptions>;
  mdxModule: unknown;
  mdxModuleIndexFileSupport: boolean;

  private readonly printer: Printer;
  private readonly categoryPositionManager: CategoryPositionManager;
  private readonly groupPositionManager: CategoryPositionManager;

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
    this.mdxModuleIndexFileSupport = this.hasMDXIndexFileSupport(mdxModule);
    this.categoryPositionManager = new CategoryPositionManager(
      docOptions?.categorySort,
    );
    // Create a separate position manager for groups to avoid numbering conflicts
    this.groupPositionManager = this.categoryPositionManager.createScope(
      docOptions?.categorySort,
    );
  }

  /**
   * Checks if the provided module supports MDX index file generation.
   *
   * @param module - The module to check for MDX support
   * @returns True if the module supports index metafile generation
   * @useDeclaredType
   * @example
   */
  hasMDXIndexFileSupport(
    module: unknown = this.mdxModule,
  ): module is Partial<MDXSupportType> &
    Pick<MDXSupportType, "generateIndexMetafile"> {
    return !!(
      module &&
      typeof module === "object" &&
      "generateIndexMetafile" in module &&
      typeof module.generateIndexMetafile === "function"
    );
  }

  /**
   * Generates an index metafile for a category directory if MDX support is available.
   *
   * @param dirPath - The directory path where the index should be created
   * @param category - The category name
   * @param options - Configuration options for the index
   * @returns Promise that resolves when the index is generated
   * @useDeclaredType
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
    options: CategoryMetafileOptions = {
      collapsible: true,
      collapsed: true,
    },
  ): Promise<void> {
    if (this.mdxModuleIndexFileSupport) {
      // If no explicit position is provided, use the position manager
      const sidebarPosition =
        options.sidebarPosition ??
        this.categoryPositionManager.getPosition(category);

      await (this.mdxModule as MDXSupportType).generateIndexMetafile(
        dirPath,
        category,
        {
          ...options,
          sidebarPosition,
          index: this.options?.index,
        },
      );
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
   * @useDeclaredType
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

    const useApiGroup = isHierarchy(this.options, TypeHierarchy.API)
      ? this.options.hierarchy[TypeHierarchy.API]
      : (!this.options?.hierarchy as boolean);

    if (useApiGroup) {
      const typeCat = getApiGroupFolder(type, useApiGroup);
      dirPath = join(dirPath, this.formatCategoryFolderName(typeCat));
      await this.generateIndexMetafile(dirPath, typeCat, {
        collapsible: false,
        collapsed: false,
        styleClass: CATEGORY_STYLE_CLASS.API,
      });
    }

    if (this.options?.deprecated === "group" && isDeprecated(type)) {
      dirPath = join(dirPath, this.formatCategoryFolderName(DEPRECATED));
      await this.generateIndexMetafile(dirPath, DEPRECATED, {
        sidebarPosition: SidebarPosition.LAST,
        styleClass: CATEGORY_STYLE_CLASS.DEPRECATED,
      });
    }

    if (
      this.group &&
      rootTypeName in this.group &&
      name in this.group[rootTypeName]!
    ) {
      const rootGroup = this.group[rootTypeName]![name] ?? "";
      dirPath = join(dirPath, this.formatCategoryFolderName(rootGroup));
      await this.generateIndexMetafile(dirPath, rootGroup);
    }

    dirPath = join(dirPath, this.formatCategoryFolderName(rootTypeName));
    await this.generateIndexMetafile(dirPath, rootTypeName);

    return dirPath;
  }

  /**
   * Renders all types within a root type category (e.g., all Query types).
   *
   * @param rootTypeName - The name of the root type (e.g., "Query", "Mutation")
   * @param type - The type object containing all entities to render
   * @returns Array of rendered categories or undefined
   * @useDeclaredType
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
      Object.keys(type)
        .map(async (name) => {
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
        })
        .filter((res) => {
          return typeof res !== "undefined";
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
   * @useDeclaredType
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

    const PageRegex =
      /(?<category>[A-Za-z0-9-]+)[\\/]+(?<pageId>[A-Za-z0-9-]+).mdx?$/;
    const PageRegexFlat = /(?<pageId>[A-Za-z0-9-]+).mdx?$/;

    const extension = this.mdxModule ? "mdx" : "md";
    const fileName = slugify(name);
    const filePath = join(normalize(dirPath), `${fileName}.${extension}`);

    let content: MDXString;
    try {
      const printOptions = {
        ...this.options,
        formatCategoryFolderName: (categoryName: string): string => {
          return this.formatCategoryFolderName(categoryName);
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

    const slug = isFlat
      ? page.groups.pageId
      : pathUrl.join(page.groups.category, page.groups.pageId);
    const category = isFlat ? "schema" : startCase(page.groups.category);

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
   * @param rootTypeNames - Array of root type names from the schema
   * @useDeclaredType
   */
  preCollectCategories(rootTypeNames: string[]): void {
    const categories = new Set<string>();

    // Skip if flat hierarchy
    if (isHierarchy(this.options, TypeHierarchy.FLAT)) {
      return;
    }

    // API group categories (operations/types)
    const useApiGroup = isHierarchy(this.options, TypeHierarchy.API)
      ? this.options.hierarchy[TypeHierarchy.API]
      : (!this.options?.hierarchy as boolean);

    if (useApiGroup) {
      const apiGroups =
        typeof useApiGroup === "object"
          ? { ...API_GROUPS, ...useApiGroup }
          : API_GROUPS;
      categories.add(apiGroups.operations);
      categories.add(apiGroups.types);
    }

    // Deprecated category
    if (this.options?.deprecated === "group") {
      categories.add(DEPRECATED);
    }

    // Custom group categories - collect separately
    const groups = new Set<string>();
    if (this.group) {
      for (const rootTypeName in this.group) {
        for (const name in this.group[rootTypeName as SchemaEntity]) {
          const groupName = this.group[rootTypeName as SchemaEntity]![name];
          if (groupName) {
            groups.add(groupName);
          }
        }
      }
    }

    // Root type categories
    for (const name of rootTypeNames) {
      categories.add(name);
    }

    // Register categories and groups with separate position managers
    this.categoryPositionManager.registerCategories(Array.from(categories));
    this.categoryPositionManager.computePositions();

    // Register groups with their own position manager
    if (groups.size > 0) {
      this.groupPositionManager.registerCategories(Array.from(groups));
      this.groupPositionManager.computePositions();
    }
  }

  /**
   * Renders the homepage for the documentation from a template file.
   * Replaces placeholders in the template with actual values.
   *
   * @param homepageLocation - Path to the homepage template file
   * @returns Promise that resolves when the homepage is rendered
   * @useDeclaredType
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
        .replace(/##baseURL##/gm, slug)
        .replace(/##generated-date-time##/gm, new Date().toLocaleString());

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
   * Formats a category folder name, optionally prefixing with an order number.
   *
   * @param categoryName - The category name to format
   * @returns The formatted folder name (e.g., "01-objects" if prefix is enabled)
   * @private
   */
  private formatCategoryFolderName(categoryName: string): string {
    if (!this.options?.categorySortPrefix) {
      return slugify(categoryName);
    }

    // Determine which position manager to use based on whether this is a group or category
    const isGroup =
      this.group &&
      Object.values(this.group).some((rootGroup) => {
        return Object.values(rootGroup).includes(categoryName);
      });

    const positionManager = isGroup
      ? this.groupPositionManager
      : this.categoryPositionManager;

    const position = positionManager.getPosition(categoryName);
    const paddedPosition = String(position).padStart(2, "0");
    const slugifiedName = slugify(categoryName);

    return `${paddedPosition}-${slugifiedName}`;
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
 * @useDeclaredType
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
