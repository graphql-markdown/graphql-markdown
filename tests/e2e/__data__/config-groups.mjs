// @ts-check

import { getTypeDirectiveValues } from "@graphql-markdown/graphql";
import {
  directiveDescriptor,
  directiveTag,
} from "@graphql-markdown/helpers";

/** @type {string} */
export const schema = "data/schema_with_grouping.graphql";

/** @type {import('@graphql-markdown/types').ConfigOptions} */
export const options = {
  rootPath: "./docs",
  linkRoot: "/examples/group-by",
  baseURL: ".",
  diffMethod: "SCHEMA-HASH",
  loaders: { GraphQLFileLoader: "@graphql-tools/graphql-file-loader" },
  groupByDirective: {
    directive: "doc",
    fallback: "Common",
    field: "category",
  },
  printTypeOptions: {
    parentTypePrefix: false,
    typeBadges: true,
  },
  docOptions: {
    index: true,
    categorySort: "natural",
  },
  customDirective: {
    beta: {
      tag: (directive) => ({
        text: directive?.name?.toUpperCase(),
        classname: "badge--danger",
      }),
    },
    auth: {
      descriptor: (directive, type) =>
        directiveDescriptor(
          directive,
          type,
          "This requires the current user to be in `${requires}` role.",
        ),
      tag: directiveTag,
    },
    complexity: {
      descriptor: (directive, type) => {
        const { value, multipliers } = getTypeDirectiveValues(directive, type);
        const multiplierDescription = multipliers
          ? ` per ${multipliers.map((v) => `\`${v}\``).join(", ")}`
          : "";
        return `This has an additional cost of \`${value}\` points${multiplierDescription}.`;
      },
      tag: directiveTag,
    },
  },
};
