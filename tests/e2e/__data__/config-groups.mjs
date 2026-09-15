// @ts-check

import {
  getDirectiveFromSchema,
  getTypeDirectiveValues,
  hasDirectiveNamed,
} from "@graphql-markdown/graphql";
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
      predicate: hasDirectiveNamed("beta"),
      position: { into: "tags" },
      render: (_values, options) => {
        const directive = getDirectiveFromSchema("beta", options);
        return directive
          ? renderBadge(
              {
                text: directive.name.toUpperCase(),
                classname: "badge--danger",
              },
              options,
            )
          : undefined;
      },
    },
    authDescription: {
      predicate: hasDirectiveNamed("auth"),
      position: { into: "description" },
      render: (_values, options, { type }) => {
        const directive = getDirectiveFromSchema("auth", options);
        return directive
          ? escapeMDX(
              directiveDescriptor(
                directive,
                type,
                "This requires the current user to be in `${requires}` role.",
              ),
            )
          : undefined;
      },
    },
    authTag: {
      predicate: hasDirectiveNamed("auth"),
      position: { into: "tags" },
      render: (_values, options, { type }) => {
        const directive = getDirectiveFromSchema("auth", options);
        return directive
          ? renderBadge(directiveTag(directive, type), options)
          : undefined;
      },
    },
    complexityDescription: {
      predicate: hasDirectiveNamed("complexity"),
      position: { into: "description" },
      render: (_values, options, { type }) => {
        const directive = getDirectiveFromSchema("complexity", options);
        if (!directive) {
          return undefined;
        }
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
      predicate: hasDirectiveNamed("complexity"),
      position: { into: "tags" },
      render: (_values, options, { type }) => {
        const directive = getDirectiveFromSchema("complexity", options);
        return directive
          ? renderBadge(directiveTag(directive, type), options)
          : undefined;
      },
    },
  },
};
