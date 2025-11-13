/** @type {import('@graphql-markdown/types').ConfigOptions} */
module.exports = {
  schema: "data/tweet.graphql",
  rootPath: "./docs",
  linkRoot: "/examples/default",
  baseURL: ".",
  diffMethod: "SCHEMA-DIFF",
  loaders: {
    GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
    UrlLoader: {
      module: "@graphql-tools/url-loader",
      options: { method: "POST" },
    },
  },
  docOptions: {
    frontMatter: {
      pagination_next: null,
      pagination_prev: null,
    },
  },
  metatags: [{ name: "googlebot", content: "noindex" }, { charset: "utf-8" }],
};
