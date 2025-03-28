/**
 * GraphQL Markdown configuration utilities
 *
 * This module provides utilities for loading and processing GraphQL configuration
 * using the graphql-config package.
 *
 * @module graphql-config
 */
import type {
  ClassName,
  ExtensionProjectConfig,
  GraphQLExtensionDeclaration,
  LoaderOption,
  Maybe,
  PackageConfig,
  PackageOptionsConfig,
} from "@graphql-markdown/types";

import { log } from "@graphql-markdown/logger";

/**
 * The name of the GraphQL Markdown extension.
 * Used to identify the extension in graphql-config.
 */
export const EXTENSION_NAME = "graphql-markdown" as const;

/**
 * GraphQL extension declaration for graphql-config.
 *
 * @returns The extension configuration object with name property.
 *
 * @example
 * ```typescript
 * // In graphql-config setup
 * const config = await loadConfig({
 *   extensions: [graphQLConfigExtension],
 * });
 * ```
 */
export const graphQLConfigExtension: GraphQLExtensionDeclaration = () => {
  return { name: EXTENSION_NAME } as const;
};

/**
 * Options for controlling throw behavior when loading configuration.
 *
 * @interface ThrowOptions
 * @property throwOnMissing Whether to throw when the config file is missing.
 * @property throwOnEmpty Whether to throw when the config is empty.
 */
interface ThrowOptions {
  throwOnMissing?: boolean;
  throwOnEmpty?: boolean;
}

/**
 * Sets loader options for GraphQL Markdown loaders.
 *
 * This function takes a LoaderOption object and merges the provided options
 * with any existing options for each loader.
 *
 * @param loaders - The loader configuration object.
 * @param options - The package options to apply to loaders.
 * @returns The updated loader configuration.
 *
 * @example
 * ```typescript
 * const loaders = {
 *   TypeScriptLoader: {
 *     module: "@graphql-markdown/typescript-loader",
 *     options: { baseDir: "./src" }
 *   }
 * };
 * const options = { outputDir: "./docs" };
 * const updatedLoaders = setLoaderOptions(loaders, options);
 * // Result: loaders with { baseDir: "./src", outputDir: "./docs" }
 * ```
 */
export const setLoaderOptions = (
  loaders: LoaderOption,
  options: PackageOptionsConfig,
): LoaderOption => {
  for (const loader in loaders) {
    if (typeof loaders[loader as ClassName] === "string") {
      loaders[loader as ClassName] = {
        module: loaders[loader as ClassName],
        options,
      } as PackageConfig;
    } else {
      (loaders[loader as ClassName] as PackageConfig).options = {
        ...options,
        ...(loaders[loader as ClassName] as PackageConfig).options,
      };
    }
  }
  return loaders;
};

/**
 * Loads the GraphQL Markdown configuration from graphql-config.
 *
 * This function attempts to load the GraphQL config and extract the
 * GraphQL Markdown extension configuration for the specified project ID.
 * It also normalizes schema configurations.
 *
 * @param id - The project ID to load configuration for.
 * @param options - Optional package options to apply.
 * @param throwOptions - Options for controlling throw behavior.
 * @returns The extension project configuration if found, otherwise undefined.
 *
 * @throws Will throw an error if throwOnMissing or throwOnEmpty is true and
 * the corresponding condition is met.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const config = await loadConfiguration("my-project");
 *
 * // With options and throw behavior
 * const config = await loadConfiguration(
 *   "my-project",
 *   { baseDir: "./src" },
 *   { throwOnMissing: true, throwOnEmpty: false }
 * );
 * ```
 */
export const loadConfiguration = async (
  id: Maybe<string>,
  options?: Maybe<PackageOptionsConfig>,
  { throwOnMissing, throwOnEmpty }: ThrowOptions = {
    throwOnMissing: false,
    throwOnEmpty: false,
  },
): Promise<Maybe<Readonly<ExtensionProjectConfig>>> => {
  let graphQLConfig;

  if (typeof id !== "string") {
    return undefined;
  }

  try {
    graphQLConfig = await import("graphql-config");
  } catch {
    log("Cannot find module 'graphql-config'!");
    return undefined;
  }

  const config = await graphQLConfig.loadConfig({
    ...options,
    extensions: [graphQLConfigExtension],
    throwOnMissing,
    throwOnEmpty,
  });

  if (!config) {
    return undefined;
  }

  try {
    const projectConfig: ExtensionProjectConfig = config
      .getProject(id)
      .extension(EXTENSION_NAME);

    if (Array.isArray(projectConfig.schema)) {
      const schema = projectConfig.schema[0];
      if (typeof schema === "string") {
        projectConfig.schema = schema;
      }

      if (typeof projectConfig.schema === "object") {
        projectConfig.schema = Object.keys(schema)[0];

        if (typeof projectConfig.loaders !== "undefined") {
          projectConfig.loaders = setLoaderOptions(
            projectConfig.loaders ?? {},
            Object.values(schema)[0] as PackageOptionsConfig,
          );
        }
      }
    }

    return projectConfig as Readonly<ExtensionProjectConfig>;
  } catch {
    return undefined;
  }
};
