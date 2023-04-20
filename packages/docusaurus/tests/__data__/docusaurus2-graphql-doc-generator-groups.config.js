module.exports = {
  id: "schema_with_grouping",
  schema: "data/schema_with_grouping.graphql",
  rootPath: "./docs",
  linkRoot: "/examples/default",
  baseURL: ".",
  diffMethod: "SCHEMA-HASH",
  loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
  groupByDirective: {
    directive: "doc",
    field: "category",
    fallback: "Common",
  },
  docOptions: {
    pagination: true,
    toc: true,
  },
  printTypeOptions: {
    parentTypePrefix: false,
    relatedTypeSection: false,
    typeBadges: false,
  },
};
