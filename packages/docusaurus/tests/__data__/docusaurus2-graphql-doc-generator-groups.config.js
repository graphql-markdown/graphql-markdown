const {
  graphql: { getTypeDirectiveValues },
  helper: { directiveDescriptor },
} = require("@graphql-markdown/utils");

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
    typeBadges: true,
  },
  customDirective: {
    auth: {
      descriptor: (directive, type) => {
        return directiveDescriptor(
          directive,
          type,
          "This requires the current user to be in ${requires} role.",
        );
      },
    },
    complexity: {
      descriptor: (directive, type) => {
        const { value, multipliers } = getTypeDirectiveValues(directive, type);
        const multiplierDescription =
          typeof multipliers !== "undefined"
            ? ` multiplied by parameters ${multipliers.map((value) => value)}`
            : "";
        return `This has an additional cost of ${value} points${multiplierDescription}.`;
      },
    },
  },
};
