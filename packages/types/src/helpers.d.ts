import type { GraphQLDirective, DirectiveName } from ".";

export type CustomDirectiveFunction = <T>(
  directive?: GraphQLDirective,
  node?: unknown,
) => T;

export type CustomDirectiveResolver = "descriptor" | "tag";

export type CustomDirectiveOptions = {
  [name in CustomDirectiveResolver]?: CustomDirectiveFunction;
};

export interface CustomDirective {
  [name: DirectiveName]: CustomDirectiveOptions;
}

export type CustomDirectiveMapItem = CustomDirectiveOptions & {
  type: GraphQLDirective;
};

export interface CustomDirectiveMap {
  [name: DirectiveName]: CustomDirectiveMapItem;
}
