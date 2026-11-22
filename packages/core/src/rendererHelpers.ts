import type {
  ApiGroupOverrideType,
  Maybe,
  RendererDocOptions,
  TypeHierarchyObjectType,
  TypeHierarchyValueType,
} from "@graphql-markdown/types";
import { isApiType } from "@graphql-markdown/graphql";
import { isGroupsObject } from "./directives/validation.ts";

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
export const DEPRECATED = "deprecated" as const;

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
export enum CATEGORY_STYLE_CLASS {
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
export enum SidebarPosition {
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
export const stripNumericPrefix = (folderName: string): string => {
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
export const isHierarchy = (
  options: Maybe<RendererDocOptions>,
  hierarchy: TypeHierarchyValueType,
): options is RendererDocOptions & { hierarchy: TypeHierarchyObjectType } => {
  return options?.hierarchy?.[hierarchy] !== undefined;
};
