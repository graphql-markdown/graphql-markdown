module.exports = [
  {
    id: "config-A",
    schema: "data/tweet-A.graphql",
    rootPath: "./docs-tweet-A",
    baseURL: "schema",
    linkRoot: "/",
    loaders: {
      UrlLoader: "@graphql-tools/url-loader",
    },
  },
  {
    id: "config-B",
    schema: "data/tweet-B.graphql",
    rootPath: "./docs-tweet-B",
    baseURL: "schema",
    linkRoot: "/",
    loaders: {
      UrlLoader: "@graphql-tools/url-loader",
    },
  },
];
