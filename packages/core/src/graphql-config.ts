import { Logger } from "@graphql-markdown/utils"

import type { GraphQLProjectConfig } from "graphql-config/typings/project-config";

import type { PackageOptionsConfig, LoaderOption, ClassName, PackageConfig } from "@graphql-markdown/utils";

import type { ConfigOptions } from "./config";

const logger = Logger.getInstance();

export const EXTENSION_NAME = "graphql-markdown";

type ThrowOptions = { 
  throwOnMissing: boolean, 
  throwOnEmpty: boolean
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type ExtensionProjectConfig = Writeable<GraphQLProjectConfig> & Omit<ConfigOptions, "schema">

const setLoaderOptions = (loaders: LoaderOption, options: PackageOptionsConfig) => {
  for(const loader in loaders) {
    if (typeof loaders[loader as ClassName] === "string") {
      loaders[loader as ClassName] = { module: loaders[loader as ClassName], options } as PackageConfig;
    } else {
      (loaders[loader as ClassName] as PackageConfig).options = { ...options, ...(loaders[loader as ClassName] as PackageConfig).options } as PackageOptionsConfig;
    }
  }
  return loaders;
};

export const loadConfiguration = async (
  id?: string,
  options?: PackageOptionsConfig,
  { throwOnMissing, throwOnEmpty }: ThrowOptions = {
    throwOnMissing: false,
    throwOnEmpty: false,
  },
): Promise<Readonly<ExtensionProjectConfig> | undefined> => {
  let GraphQLConfig;

  try {
    // eslint-disable-next-line node/no-missing-require
    GraphQLConfig = await import("graphql-config");
  } catch (error) {
    logger.log("Cannot find module 'graphql-config'!");
    return undefined;
  }

  const config = await GraphQLConfig.loadConfig({
    ...options,
    extensions: [() => ({ name: EXTENSION_NAME })],
    throwOnMissing,
    throwOnEmpty,
  });

  try {
    const projectConfig = config!.getProject(id).extension(EXTENSION_NAME) as ExtensionProjectConfig;

    if (Array.isArray(projectConfig?.schema)) {
      const schema = projectConfig?.schema[0];
      if (typeof schema === "string") {
        projectConfig.schema = schema;
      } else {
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
