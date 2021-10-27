module.exports = {
  schema: "data/tweet.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  loaders: {
    UrlLoader: "@graphql-tools/url-loader",
  },
};
