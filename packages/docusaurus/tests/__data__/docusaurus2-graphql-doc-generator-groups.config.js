const {
  graphql: { getDirectiveArgValue },
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
      descriptor: (directiveType, constDirectiveType) => {
        const value = getDirectiveArgValue(
          directiveType,
          constDirectiveType,
          "requires",
        );
        return `This requires the current user to be in ${value} role.`;
      },
    },
    complexity: {
      descriptor: (directiveType, constDirectiveType) => {
        const value = getDirectiveArgValue(
          directiveType,
          constDirectiveType,
          "value",
        );
        const multipliers = getDirectiveArgValue(
          directiveType,
          constDirectiveType,
          "multipliers",
        );
        const multiplierDescription =
          typeof multipliers !== "undefined"
            ? ` mutiplied by parameters ${multipliers.map(
                (valNode) => valNode.value,
              )}`
            : "";
        return `This has an additional cost of ${value} points${multiplierDescription}.`;
      },
    },
  },
};
