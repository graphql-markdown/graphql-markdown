module.exports = {
  schema: "https://graphql.anilist.co/",
  rootPath: "./docs",
  baseURL: "schema",
  linkRoot: "/",
  homepage: "data/anilist.md",
  loaders: {
    UrlLoader: "@graphql-tools/url-loader",
  },
};
