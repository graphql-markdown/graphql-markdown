import {
  GraphQLExtensionDeclaration,
  GraphQLProjectConfig,
  loadConfig,
} from "graphql-config";
import { DocumentNode } from "graphql";

import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";

import { ExtensionAPI, LoadConfigOptions, Maybe } from "..";

const EXTENSION_NAME = "graphql-markdown" as const;

export const OPTION = {
  LAYOUTS: "layouts",
  MDX: "mdx",
  OUTPUT: "output",
};

export type ConfigurationOptions = {
  excludes?: readonly string[];
  layouts?: string;
  mdx?: boolean;
  output?: string;
};

const defaultOptions: ConfigurationOptions = {
  excludes: [] as const,
  [OPTION.LAYOUTS]: "./layouts" as const,
  [OPTION.OUTPUT]: false as const,
  output: "./output" as const,
} as const;

const setFileLoaderExtension: GraphQLExtensionDeclaration = (
  api: ExtensionAPI
) => {
  [new GraphQLFileLoader(), new JsonFileLoader(), new UrlLoader()].forEach(
    (loader) => {
      return api.loaders.schema.register(loader);
    }
  );
  return { name: EXTENSION_NAME };
};

const loadConfiguration = async (
  options?: LoadConfigOptions
): Promise<Maybe<GraphQLProjectConfig>> => {
  const config = await loadConfig({
    ...options,
    extensions: [setFileLoaderExtension],
  });
  return config?.getDefault();
};

export class Configuration {
  static project: Maybe<GraphQLProjectConfig>;
  static extension: ConfigurationOptions;

  static load = async (options?: LoadConfigOptions): Promise<void> => {
    const configuration = await loadConfiguration(options);
    Configuration.project = configuration;
    Configuration.extension = {
      ...defaultOptions,
      ...Configuration.project?.extension(EXTENSION_NAME),
    };
  };

  static get = (name: string): string => {
    return Configuration.extension[name];
  };

  static set = (name: string, value: string): void => {
    Configuration.extension[name] = value;
  };

  // eslint-disable-next-line require-await
  static schema = async (): Promise<Maybe<DocumentNode>> => {
    return Configuration.project!.getSchema("DocumentNode");
  };
}
