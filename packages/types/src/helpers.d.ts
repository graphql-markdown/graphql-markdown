import type { GraphQLDirective, DirectiveName } from ".";

export type CustomDirectiveFunction = (
  directive?: GraphQLDirective,
  node?: unknown,
) => unknown;

export type CustomDirectiveResolver = "descriptor" | "tag";

export type CustomDirectiveOptions = Partial<
  Record<CustomDirectiveResolver, CustomDirectiveFunction>
>;

export type CustomDirective = Record<DirectiveName, CustomDirectiveOptions>;

export type CustomDirectiveMapItem = CustomDirectiveOptions & {
  type: GraphQLDirective;
};

export type CustomDirectiveMap = Record<DirectiveName, CustomDirectiveMapItem>;
