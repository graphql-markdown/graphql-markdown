// @ts-check

/** @type {string} */
export const schema = "data/tweet.graphql";

/** @type {import('@graphql-markdown/types').ConfigOptions} */
export const options = {
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
  metatags: [
    { name: "robots", content: "noindex" },
    { charset: "utf-8" },
  ],
};
