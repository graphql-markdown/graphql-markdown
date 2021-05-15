import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { JsonFileLoader } from '@graphql-tools/json-file-loader';
import { loadSchema } from '@graphql-tools/load';
import { UrlLoader } from '@graphql-tools/url-loader';

export const generateDocFromSchema = async (
  schemaLocation: string,
): Promise<void> => {
  await loadSchema(schemaLocation, {
    loaders: [new GraphQLFileLoader(), new UrlLoader(), new JsonFileLoader()],
  });
};
