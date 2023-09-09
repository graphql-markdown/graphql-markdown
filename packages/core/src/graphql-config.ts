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

export const EXTENSION_NAME = "graphql-markdown" as const;
export const graphQLConfigExtension: GraphQLExtensionDeclaration = () => {
  return { name: EXTENSION_NAME } as const;
};

interface ThrowOptions {
  throwOnMissing: boolean;
  throwOnEmpty: boolean;
}

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
  } catch (error) {
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
            projectConfig.loaders,
            Object.values(schema)[0] as PackageOptionsConfig,
          );
        }
      }
    }

    return projectConfig as Readonly<ExtensionProjectConfig>;
  } catch (error) {
    return undefined;
  }
};
