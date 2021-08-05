import {
  GraphQLExtensionDeclaration,
  GraphQLProjectConfig,
  loadConfig,
} from "graphql-config";
import { DocumentNode } from "graphql";

import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";

import {
  ConfigurationOptions,
  ExtensionAPI,
  LoadConfigOptions,
  Maybe,
} from "..";

const DOCUMENT_NODE_TYPE = "DocumentNode" as const;
const EXTENSION_NAME = "graphql-markdown" as const;
export const OPTION = {
  LAYOUTS: "layouts",
  MDX: "mdx",
  OUTPUT: "output",
} as const;

const defaultOptions: ConfigurationOptions = {
  excludes: [] as const,
  [OPTION.LAYOUTS]: "./layouts" as const,
  [OPTION.MDX]: false as const,
  [OPTION.OUTPUT]: "./output" as const,
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

  static load = async (options?: {
    graphqlConfig?: LoadConfigOptions;
    markdownConfig?: ConfigurationOptions;
  }): Promise<void> => {
    const { graphqlConfig, markdownConfig } = options ?? {};

    const configuration = await loadConfiguration(graphqlConfig);
    Configuration.project = configuration;
    Configuration.extension = {
      ...defaultOptions,
      ...configuration?.extension(EXTENSION_NAME),
      ...markdownConfig,
    };
  };

  static get = (name: string): boolean | number | string => {
    return Configuration.extension[name];
  };

  static set = (name: string, value: boolean | number | string): void => {
    Configuration.extension[name] = value;
  };

  // eslint-disable-next-line require-await
  static schema = async (): Promise<Maybe<DocumentNode>> => {
    return Configuration.project?.getSchema(DOCUMENT_NODE_TYPE);
  };
}
