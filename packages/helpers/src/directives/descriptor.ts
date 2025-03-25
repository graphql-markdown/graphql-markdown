/**
 * Custom directive `descriptor` helper.
 *
 * @see [Option `customDirective.[directive].descriptor`](https://graphql-markdown.dev/docs/advanced/custom-directive#descriptor)
 *
 * @packageDocumentation
 */

import type { GraphQLDirective } from "@graphql-markdown/types";

import { getTypeDirectiveValues } from "@graphql-markdown/graphql";

import { interpolate } from "../utils/interpolate";

/**
 * Helper for rendering custom description from schema directive on type.
 * This is an example on how to build a custom `descriptor` callback.
 *
 * @param directive - the schema directive to parse.
 * @param type - the schema type to be processed for generating a custom description.
 * @param descriptionTemplate - optional template literal-like string for rendering the description (see {@link interpolate}), if not present then the directive description will be used.
 *
 * @returns a custom description based on directive value.
 *
 * @example
 * ```js
 * import { GraphQLDirective, GraphQLScalarType } from "graphql";
 * import { directiveDescriptor } from "@graphql-markdown/helpers/directives/descriptor";
 *
 * const directive = new GraphQLDirective({
 *   name: "version",
 *   description: "Min version",
 *   locations: [],
 *   args: {
 *     major: { type: GraphQLInt, defaultValue: 0 },
 *     minor: { type: GraphQLInt, defaultValue: 0 },
 *     patch: { type: GraphQLInt, defaultValue: 0 },
 *   },
 * });
 *
 * const type = new GraphQLScalarType<string>({
 *   name: "FooBar",
 *   astNode: {
 *     kind: Kind.SCALAR_TYPE_DEFINITION,
 *     name: { kind: Kind.NAME, value: "FooBar" },
 *     directives: [
 *       {
 *         kind: Kind.DIRECTIVE,
 *         name: { kind: Kind.NAME, value: "version" },
 *         arguments: [
 *           {
 *             kind: Kind.ARGUMENT,
 *             name: { kind: Kind.NAME, value: "major" },
 *             value: { kind: Kind.INT, value: "2" },
 *           },
 *           {
 *             kind: Kind.ARGUMENT,
 *             name: { kind: Kind.NAME, value: "minor" },
 *             value: { kind: Kind.INT, value: "1" },
 *           },
 *           {
 *             kind: Kind.ARGUMENT,
 *             name: { kind: Kind.NAME, value: "patch" },
 *             value: { kind: Kind.INT, value: "3" },
 *           },
 *         ],
 *       },
 *     ],
 *   },
 * });
 *
 * directiveDescriptor(directive, type, "${description} is ${major}.${minor}.${patch}");
 * // Expected result: "Min version is 2.1.3"
 *
 * directiveDescriptor(directive, type);
 * // Expected result: "Min version"
 *
 * directiveDescriptor(directive, type, "Version should be at least ^${major}.${minor}.${patch}");
 * // Expected result: "Version should be at least ^2.1.3"
 * ```
 *
 */
export const directiveDescriptor = (
  directive: GraphQLDirective,
  type?: unknown,
  descriptionTemplate?: string,
): string => {
  const values = getTypeDirectiveValues(directive, type);
  const description = directive.description ?? "";
  const params = { description, ...values };
  if (typeof descriptionTemplate !== "string") {
    return interpolate(description, params);
  }
  return interpolate(descriptionTemplate, params);
};
