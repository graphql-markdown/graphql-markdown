// @ts-check

/** @type {string} */
export const schema = "data/tweet.graphql";

/** @type {import('@graphql-markdown/types').ConfigOptions} */
export const options = {
  rootPath: "./docs",
  baseURL: ".",
  linkRoot: "/examples/tweet",
  homepage: "data/groups.md",
  loaders: {
    GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
  },
  docOptions: {
    index: true,
    categorySort: "natural",
  },
  printTypeOptions: {
    parentTypePrefix: false,
    typeBadges: true,
    deprecated: "group",
  },
  skipDocDirective: ["@noDoc"],
  metatags: [
    { name: "robots", content: "noindex" },
    { charset: "utf-8" },
  ],
};
