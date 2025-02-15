/** @type {import('graphql-config').IGraphQLConfig} */
module.exports = {
  schema_tweets: {
    schema: "data/tweet.graphql",
    extensions: {
      /** @type {import('@graphql-markdown/types').ConfigOptions} */
      "graphql-markdown": {
        rootPath: "./docs",
        baseURL: ".",
        linkRoot: "/examples/tweet",
        homepage: "data/groups.md",
        loaders: {
          GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
        },
        docOptions: {
          index: true,
        },
        printTypeOptions: {
          parentTypePrefix: false,
          relatedTypeSection: false,
          typeBadges: true,
          deprecated: "group",
        },
        skipDocDirective: ["@noDoc"],
        metatags: [
          {
            name: "googlebot",
            content: "noindex",
          },
          {
            charset: "utf-8",
          },
        ],
      },
    },
  },
};
