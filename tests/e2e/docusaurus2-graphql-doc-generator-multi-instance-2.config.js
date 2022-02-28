module.exports = {
  id: "config-B",
  schema: "data/tweet-B.graphql",
  rootPath: "./docs-tweet-B",
  baseURL: "schema",
  linkRoot: "/",
  loaders: {
    UrlLoader: "@graphql-tools/url-loader",
  },
};
