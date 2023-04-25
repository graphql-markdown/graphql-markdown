function getDirectiveArgValue(directiveType, constDirectiveType, argName) {
  const args = constDirectiveType.arguments ?? [];
  const constArg = args.find((arg) => arg.name.value === argName);
  if (constArg) {
    return (
      constArg.value.fields ?? constArg.value.values ?? constArg.value.value
    );
  }
  const defArg = directiveType.args.find((arg) => arg.name === argName);
  if (defArg) {
    return defArg.defaultValue || undefined;
  }

  throw new Error(`Argument by name ${argName} is not found!`);
}

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
