/**
 * `decorators` render helper for directive-definition-only content.
 *
 * @see [Migrating from `customDirective`](https://graphql-markdown.dev/docs/advanced/decorators#migrating-from-customdirective)
 *
 * @packageDocumentation
 */

import type {
  DecoratorContext,
  DecoratorRenderer,
  GraphQLDirective,
  Maybe,
  PrintTypeOptions,
} from "@graphql-markdown/types";

import { getDirectiveFromSchema } from "@graphql-markdown/graphql";

/**
 * Builds a decorator `render` for content derived from a directive's own
 * definition — not per-occurrence argument values, so no `resolve` is
 * needed. Looks the directive up once and skips the decorator (renders
 * nothing) when it is absent from the schema, sparing `render` its own
 * `getDirectiveFromSchema` call and null check.
 *
 * @param name - the schema directive name to resolve.
 * @param render - called with the resolved directive, the print options, and
 * the decorator's context, only when the directive is present in the schema.
 *
 * @returns a {@link DecoratorRenderer} for use as a decorator's `render`.
 *
 * @example
 * ```js
 * import { withDirective } from "@graphql-markdown/helpers/directives/with-directive";
 * import { directiveDescriptor } from "@graphql-markdown/helpers/directives/descriptor";
 * import { hasDirectiveNamed } from "@graphql-markdown/graphql";
 *
 * decorators: {
 *   authDescription: {
 *     predicate: hasDirectiveNamed("auth"),
 *     position: { into: "description" },
 *     render: withDirective("auth", (directive, options, { type }) =>
 *       directiveDescriptor(directive, type, "Requires the `${requires}` role."),
 *     ),
 *   },
 * }
 * ```
 */
export const withDirective = (
  name: string,
  render: (
    directive: GraphQLDirective,
    options: PrintTypeOptions,
    context: DecoratorContext,
  ) => Maybe<string>,
): DecoratorRenderer => {
  return (
    _values: Record<string, unknown>[],
    options: PrintTypeOptions,
    context: DecoratorContext,
  ): Maybe<string> => {
    const directive = getDirectiveFromSchema(name, options);
    return directive ? render(directive, options, context) : undefined;
  };
};
