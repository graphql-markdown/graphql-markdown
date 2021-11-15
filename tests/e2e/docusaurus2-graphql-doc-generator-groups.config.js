module.exports = {
  schema: "data/schema_with_grouping.graphql",
  rootPath: "./docs",
  baseURL: "group-by",
  linkRoot: "/",
  groupByDirective: {
    directive: "doc",
    field: "category",
    fallback: "Common",
  },
};
