import type { GraphQLDirective, DirectiveName } from "./graphql";

/** Function to process custom GraphQL directives */
export type CustomDirectiveFunction = (
  directive?: GraphQLDirective,
  node?: unknown,
) => unknown;

/** Available resolver types for custom directives */
export type CustomDirectiveResolver = "descriptor" | "tag";

/** Configuration options for custom directive processing */
export type CustomDirectiveOptions = Partial<
  Record<CustomDirectiveResolver, CustomDirectiveFunction>
>;

/** Map of directive names to their processing options */
export type CustomDirective = Record<DirectiveName, CustomDirectiveOptions>;

/** Internal representation of a custom directive with its type information */
export type CustomDirectiveMapItem = CustomDirectiveOptions & {
  type: GraphQLDirective;
};

/** Complete mapping of directive names to their full configuration */
export type CustomDirectiveMap = Record<DirectiveName, CustomDirectiveMapItem>;
