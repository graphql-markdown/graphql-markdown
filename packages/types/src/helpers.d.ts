import type { GraphQLDirective, DirectiveName } from ".";

export type CustomDirectiveFunction = (
  directive?: GraphQLDirective,
  node?: unknown,
) => unknown;

export type CustomDirectiveResolver = "descriptor" | "tag";

export type CustomDirectiveOptions = {
  [name in CustomDirectiveResolver]?: CustomDirectiveFunction;
};

export type CustomDirective = Record<DirectiveName, CustomDirectiveOptions>;

export type CustomDirectiveMapItem = CustomDirectiveOptions & {
  type: GraphQLDirective;
};

export type CustomDirectiveMap = Record<DirectiveName, CustomDirectiveMapItem>;
