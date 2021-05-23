import {
  GraphQLExtensionDeclaration,
  GraphQLProjectConfig,
  loadConfigSync,
} from "graphql-config";
import { DocumentNode } from "graphql";

import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { UrlLoader } from "@graphql-tools/url-loader";

const EXTENSION_NAME = "graphql-markdown";

const defaultOptions = {
  excludes: [],
  layoutsFolder: `${process.cwd()}/layouts` as const,
  outputFolder: `${process.cwd()}/output` as const,
};

const setFileLoaderExtension: GraphQLExtensionDeclaration = (api: any) => {
  [new GraphQLFileLoader(), new JsonFileLoader(), new UrlLoader()].forEach(
    (loader) => {
      return api.loaders.schema.register(loader);
    }
  );
  return { name: EXTENSION_NAME };
};

const configuration = ((): GraphQLProjectConfig => {
  return loadConfigSync({
    extensions: [setFileLoaderExtension],
  }).getDefault();
})();

export const getConfigOption = (name: string): string => {
  const extensionConfig = configuration.extension(EXTENSION_NAME);
  if (typeof extensionConfig[name] === "undefined") {
    return defaultOptions[name];
  }
  return extensionConfig[name];
};

export const loadSchemaFromConfig = (): DocumentNode => {
  return configuration.getSchemaSync("DocumentNode");
};

export default configuration;
