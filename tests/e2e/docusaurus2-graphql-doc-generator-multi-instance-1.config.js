module.exports = {
  id: "config-A",
  schema: "data/tweet-A.graphql",
  rootPath: "./docs-tweet-A",
  baseURL: "schema",
  linkRoot: "/",
  loaders: {
    UrlLoader: "@graphql-tools/url-loader",
  },
};
