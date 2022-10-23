module.exports = {
  schema: "data/tweet.graphql",
  rootPath: "./docs",
  baseURL: ".",
  linkRoot: "/group-by",
  diffMethod: "SCHEMA-DIFF",
  loaders: {
    UrlLoader: {
      module: "@graphql-tools/url-loader",
      options: { method: "POST" },
    },
  },
};
