import { GraphQLExtensionDeclaration, loadConfig } from "graphql-config";
import { UrlLoader } from "@graphql-tools/url-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

const addCodeFileLoaderExtension: GraphQLExtensionDeclaration = (api) => {
  [new GraphQLFileLoader(), new JsonFileLoader(), new UrlLoader()].forEach(
    (loader) => api.loaders.schema.register(loader)
  );
  return { name: "graphql-markdown-loaders" };
};

export const loadGraphqlConfig = async () => {
  return await loadConfig({
    extensions: [addCodeFileLoaderExtension],
  });
};
