import { DocumentNode } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { GraphQLExtensionDeclaration, GraphQLProjectConfig, loadConfigSync } from "graphql-config";
import { UrlLoader } from "@graphql-tools/url-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

const EXTENSION_NAME = "graphql-markdown";

const defaultOptions = {
  layoutsFolder: `${process.cwd()}/__layouts__`,
  outputFolder: `${process.cwd()}/output`,
  excludes: []
}

const setFileLoaderExtension: GraphQLExtensionDeclaration = (api) => {
  [new GraphQLFileLoader(), new JsonFileLoader(), new UrlLoader()].forEach(
    (loader) => api.loaders.schema.register(loader)
  );
  return { name: EXTENSION_NAME };
};

const loadDefaultConfig = (): GraphQLProjectConfig => {
  return loadConfigSync({
    extensions: [setFileLoaderExtension],
  }).getDefault();
};

export const getConfigOption = (name: string): Maybe<string> => {
  const extensionConfig = configuration.extension(EXTENSION_NAME);
  if (typeof extensionConfig[name] === "undefined") {
    return defaultOptions[name];
  }
  return extensionConfig[name];
}

export const loadSchemaFromConfig = (): DocumentNode => {
  return configuration!.getSchemaSync("DocumentNode");
};

const configuration = loadDefaultConfig();

export default configuration;
