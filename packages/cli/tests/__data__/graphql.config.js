/** @type {import('graphql-config').IGraphQLConfig} */
export default {
  projects: {
    default: {
      extensions: {
        /** @type {import('@graphql-markdown/types').ConfigOptions} */
        "graphql-markdown": {
          loaders: {
            UrlLoader: "@graphql-tools/url-loader",
          },
        },
      },
    },
    schema_with_grouping: {
      extensions: {
        /** @type {import('@graphql-markdown/types').ConfigOptions} */
        "graphql-markdown": {
          loaders: {
            GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
          },
        },
      },
    },
  },
};
