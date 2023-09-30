module.exports = {
  schema: "data/tweet.graphql",
  rootPath: "./docs",
  linkRoot: "/examples/group-by",
  baseURL: ".",
  diffMethod: "SCHEMA-DIFF",
  loaders: {
    GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
    UrlLoader: {
      module: "@graphql-tools/url-loader",
      options: { method: "POST" },
    },
  },
  metatags: [{ name: "googlebot", content: "noindex" }, { charset: "utf-8" }],
};
