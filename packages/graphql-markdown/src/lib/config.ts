import {
  GraphQLExtensionDeclaration,
  GraphQLProjectConfig,
  IExtensions,
  loadConfig,
} from "graphql-config";
import { DocumentNode } from "graphql";

import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";

import { ExtensionAPI, LoadConfigOptions, Maybe } from "..";

const EXTENSION_NAME = "graphql-markdown" as const;

export type ConfigurationOptions = {
  excludes?: readonly string[];
  layouts?: string;
  mdx?: boolean;
  output?: string;
};

const defaultOptions: ConfigurationOptions = {
  excludes: [] as const,
  layouts: "./layouts" as const,
  mdx: false as const,
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
  static configuration: Maybe<GraphQLProjectConfig>;
  static extensionConfig: ConfigurationOptions;

  private constructor(readonly configuration: Maybe<GraphQLProjectConfig>) {
    Configuration.configuration = configuration;
    Configuration.extensionConfig =
      Configuration.configuration?.extension(EXTENSION_NAME) ?? defaultOptions;
  }

  static load = async (options?: LoadConfigOptions): Promise<Configuration> => {
    const configuration = await loadConfiguration(options);
    return new Configuration(configuration);
  };

  static get = (name: string): unknown => {
    return Configuration.extensionConfig[name];
  };

  static set = <T>(name: string, value: T): void => {
    Configuration.extensionConfig[name] = value;
  };

  // eslint-disable-next-line require-await
  static loadSchema = async (): Promise<Maybe<DocumentNode>> => {
    return Configuration.configuration?.getSchema("DocumentNode");
  };
}
