/**
 * Configuration validation utilities for directive and configuration options.
 *
 * Provides type guard functions and validators for checking configuration object shapes,
 * function types, and property existence patterns commonly used across the codebase.
 *
 * @packageDocumentation
 */

/**
 * Type guard to check if an object is a proper type object (not null, not an array).
 *
 * @param value - The value to check
 * @returns True if value is an object but not null or array
 * @internal
 */
const isTypeObject = (
  value: unknown,
): value is Record<PropertyKey, unknown> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

/**
 * Type guard to check if an object has a `descriptor` function property.
 *
 * Validates that the object is a proper type object and contains a function named `descriptor`.
 *
 * @param config - The configuration object to check
 * @returns True if config has a descriptor function property
 *
 * @example
 * ```typescript
 * if (hasDescriptor(option)) {
 *   // option.descriptor is guaranteed to be a function
 *   const result = option.descriptor(directive);
 * }
 * ```
 */
export const hasDescriptor = (
  config: unknown,
): config is Record<"descriptor", (...args: unknown[]) => unknown> => {
  return (
    isTypeObject(config) &&
    "descriptor" in config &&
    typeof (config as Record<string, unknown>).descriptor === "function"
  );
};

/**
 * Type guard to check if an object has a `tag` function property.
 *
 * Validates that the object is a proper type object and contains a function named `tag`.
 *
 * @param config - The configuration object to check
 * @returns True if config has a tag function property
 *
 * @example
 * ```typescript
 * if (hasTag(option)) {
 *   // option.tag is guaranteed to be a function
 *   const result = option.tag(directive);
 * }
 * ```
 */
export const hasTag = (
  config: unknown,
): config is Record<"tag", (...args: unknown[]) => unknown> => {
  return (
    isTypeObject(config) &&
    "tag" in config &&
    typeof (config as Record<string, unknown>).tag === "function"
  );
};

/**
 * Type guard to check if a value is a schema string.
 *
 * Validates that the value is a string representing a GraphQL schema path or URL.
 *
 * @param schema - The schema value to check
 * @returns True if schema is a string
 *
 * @example
 * ```typescript
 * if (isSchemaString(config.schema)) {
 *   // config.schema is a string path/URL
 *   const schemaUrl = config.schema;
 * }
 * ```
 */
export const isSchemaString = (schema: unknown): schema is string => {
  return typeof schema === "string";
};

/**
 * Type guard to check if a value is a schema object (key-value mapping).
 *
 * Validates that the value is a type object, not null, not an array, and can be treated as a schema map.
 *
 * @param schema - The schema value to check
 * @returns True if schema is an object mapping (not an array)
 *
 * @example
 * ```typescript
 * if (isSchemaObject(projectConfig.schema)) {
 *   // Extract first key from schema map
 *   const key = Object.keys(schema)[0];
 * }
 * ```
 */
export const isSchemaObject = (
  schema: unknown,
): schema is Record<string, unknown> => {
  return isTypeObject(schema);
};

/**
 * Type guard to check if a value is a valid non-empty path string.
 *
 * Validates that the value is a string and not empty, suitable for file paths or URLs.
 *
 * @param path - The path value to check
 * @returns True if path is a non-empty string
 *
 * @example
 * ```typescript
 * if (isPath(folderPath)) {
 *   // folderPath is guaranteed to be a non-empty string
 *   const fullPath = join(basePath, folderPath);
 * }
 * ```
 */
export const isPath = (path: unknown): path is string => {
  return typeof path === "string" && path !== "";
};

/**
 * Type guard to check if a value is a configuration group object.
 *
 * Validates that the value is a type object (not null, not array, not primitive).
 *
 * @param groups - The groups value to check
 * @returns True if groups is an object mapping (not an array)
 *
 * @example
 * ```typescript
 * if (isGroupsObject(options.groups)) {
 *   // groups is an object with configuration overrides
 *   folderNames = { ...API_GROUPS, ...groups };
 * }
 * ```
 */
export const isGroupsObject = (
  groups: unknown,
): groups is Record<string, string> => {
  return isTypeObject(groups);
};

/**
 * Type guard to check if a value is a loader module name (string).
 *
 * Validates that the value is a string representing a module name for dynamic loading.
 *
 * @param loader - The loader value to check
 * @returns True if loader is a string module name
 *
 * @example
 * ```typescript
 * if (isLoaderString(loaders[name])) {
 *   // loaders[name] is a string module name that needs wrapping
 *   loaders[name] = { module: loaders[name], options };
 * }
 * ```
 */
export const isLoaderString = (loader: unknown): loader is string => {
  return typeof loader === "string";
};

/**
 * Type guard to check if a descriptor or tag property is NOT a function.
 *
 * Used for validation to detect invalid configuration where descriptor or tag
 * are defined but are not callable functions.
 *
 * @param config - The configuration object to check
 * @param property - The property name to check ("descriptor" or "tag")
 * @returns True if the property exists but is not a function
 *
 * @example
 * ```typescript
 * if (isInvalidFunctionProperty(option, "descriptor")) {
 *   throw new Error("descriptor must be a function");
 * }
 * ```
 */
export const isInvalidFunctionProperty = (
  config: unknown,
  property: "descriptor" | "tag",
): config is Record<string, unknown> => {
  return (
    isTypeObject(config) &&
    property in config &&
    typeof (config as Record<string, unknown>)[property] !== "function"
  );
};
