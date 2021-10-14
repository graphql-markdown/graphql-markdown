import {
  GraphQLExtensionDeclaration,
  GraphQLProjectConfig,
  loadConfig,
} from "graphql-config";
import { DocumentNode } from "graphql";

import {
  ConfigurationOptions,
  ExtensionAPI,
  LoadConfigOptions,
  Loaders,
  Maybe,
} from "..";

const DOCUMENT_NODE_TYPE = "DocumentNode" as const;
const EXTENSION_NAME = "graphql-markdown" as const;
export const OPTION = {
  EXCLUDES: "excludes",
  LAYOUTS: "layouts",
  MDX: "mdx",
  OUTPUT: "output",
  LOADERS: "loaders",
} as const;

const defaultOptions: ConfigurationOptions = {
  [OPTION.EXCLUDES]: [] as const,
  [OPTION.LAYOUTS]: "./layouts" as const,
  [OPTION.MDX]: false as const,
  [OPTION.OUTPUT]: "./output" as const,
  [OPTION.LOADERS]: {} as const
} as const;

const setFileLoaderExtension: GraphQLExtensionDeclaration = (
  api: ExtensionAPI
) => {
  const loadersList = Configuration.get(OPTION.LOADERS) as Loaders;

  if(Object.keys(loadersList).length === 0) {
    throw new Error("No loaders declared in configuration.")
  }

  Object.entries(loadersList).forEach(
    ([className, graphqlDocumentLoader]) => {
      const { [className]: Loader } = require(graphqlDocumentLoader)
      return api.loaders.schema.register(new Loader());
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

  static get = (name: string): boolean | number | string | Loaders => {
    return Configuration.extension[name];
  };

  static set = (name: string, value: boolean | number | string | Loaders): void => {
    Configuration.extension[name] = value;
  };

  // eslint-disable-next-line require-await
  static schema = async (): Promise<Maybe<DocumentNode>> => {
    return Configuration.project?.getSchema(DOCUMENT_NODE_TYPE);
  };
}
