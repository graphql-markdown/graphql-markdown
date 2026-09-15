// @ts-check

import { getTypeDirectiveValues } from "@graphql-markdown/graphql";
import {
  directiveDescriptor,
  directiveTag,
} from "@graphql-markdown/helpers";
import { escapeMDX } from "@graphql-markdown/utils";

/** @type {string} */
export const schema = "data/schema_with_grouping.graphql";

// A decorator's `render` returns Markdown/MDX directly, so a badge built
// from a `Badge` object (as `directiveTag` and the `beta` tag below return)
// must be escaped and formatted the same way the printer formats its own
// badges, via `options.formatMDXBadge`.
const renderBadge = ({ text, classname }, options) =>
  options.formatMDXBadge({ text: escapeMDX(text), classname });

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
  decorators: {
    betaTag: {
      directive: "beta",
      position: { into: "tags" },
      render: (_values, options, { directive }) =>
        renderBadge(
          { text: directive?.name?.toUpperCase(), classname: "badge--danger" },
          options,
        ),
    },
    authDescription: {
      directive: "auth",
      position: { into: "description" },
      render: (_values, _options, { directive, type }) =>
        escapeMDX(
          directiveDescriptor(
            directive,
            type,
            "This requires the current user to be in `${requires}` role.",
          ),
        ),
    },
    authTag: {
      directive: "auth",
      position: { into: "tags" },
      render: (_values, options, { directive, type }) =>
        renderBadge(directiveTag(directive, type), options),
    },
    complexityDescription: {
      directive: "complexity",
      position: { into: "description" },
      render: (_values, _options, { directive, type }) => {
        const { value, multipliers } = getTypeDirectiveValues(
          directive,
          type,
        );
        const multiplierDescription = multipliers
          ? ` per ${multipliers.map((v) => `\`${v}\``).join(", ")}`
          : "";
        return escapeMDX(
          `This has an additional cost of \`${value}\` points${multiplierDescription}.`,
        );
      },
    },
    complexityTag: {
      directive: "complexity",
      position: { into: "tags" },
      render: (_values, options, { directive, type }) =>
        renderBadge(directiveTag(directive, type), options),
    },
  },
};
