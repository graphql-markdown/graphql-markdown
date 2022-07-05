module.exports = {
  schema: "data/tweet.graphql",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  loaders: {
    UrlLoader: {
      module: "@graphql-tools/url-loader",
      options: { method: "POST" },
    },
  },
};
