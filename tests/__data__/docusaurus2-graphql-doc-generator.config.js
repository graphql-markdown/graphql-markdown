module.exports = {
  schema: "data/tweet.graphql",
  rootPath: "./docs",
  baseURL: ".",
  linkRoot: "/group-by",
  loaders: {
    UrlLoader: {
      module: "@graphql-tools/url-loader",
      options: { method: "POST" },
    },
  },
};
