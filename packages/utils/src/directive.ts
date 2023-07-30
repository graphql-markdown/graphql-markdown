import type { GraphQLDirective } from "graphql";

import { hasProperty, isEmpty } from "./object";

export const WILDCARD_DIRECTIVE = "*";

export interface CustomDirectiveFunction {
  (directive?: GraphQLDirective, node?: any): any
}

export type CustomDirectiveOptions = {  
  descriptor?: CustomDirectiveFunction
  tag?: CustomDirectiveFunction
}

export type CustomDirective = {
  [name: DirectiveName] : CustomDirectiveOptions
}

export type DirectiveName = string & {_opaque: typeof DirectiveName};
declare const DirectiveName: unique symbol;

export type CustomDirectiveMap = {
  [name: DirectiveName]: { type: GraphQLDirective } & CustomDirectiveOptions
}

export function getCustomDirectives(
  { directives: schemaDirectives }: { directives?: Record<DirectiveName, GraphQLDirective> },
  customDirectiveOptions?: CustomDirective,
): CustomDirectiveMap | undefined {
  const customDirectives: CustomDirectiveMap = {};

  if (
    typeof schemaDirectives !== "object" ||
    typeof customDirectiveOptions !== "object"
  ) {
    return undefined;
  }

  for (const schemaDirectiveName in schemaDirectives) {
    if (
      isCustomDirective(schemaDirectiveName as DirectiveName, customDirectiveOptions) === false
    ) {
      continue;
    }

    const directiveOptions = getCustomDirectiveOptions(
      schemaDirectiveName as DirectiveName,
      customDirectiveOptions,
    );

    if (typeof directiveOptions === "undefined") {
      continue;
    }

    customDirectives[schemaDirectiveName as DirectiveName] = {
      type: schemaDirectives[schemaDirectiveName as DirectiveName],
      ...directiveOptions,
    };
  }

  return isEmpty(customDirectives) === true ? undefined : customDirectives;
}

export function getCustomDirectiveOptions(
  schemaDirectiveName: DirectiveName,
  customDirectiveOptions: CustomDirective,
): CustomDirectiveOptions | undefined {
  if (hasProperty(customDirectiveOptions, schemaDirectiveName) === true) {
    return customDirectiveOptions[schemaDirectiveName];
  }

  if (hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true) {
    return customDirectiveOptions[WILDCARD_DIRECTIVE as DirectiveName];
  }

  return undefined;
}

export function isCustomDirective(schemaDirectiveName: DirectiveName, customDirectiveOptions: CustomDirective): boolean {
  return (
    hasProperty(customDirectiveOptions, schemaDirectiveName) === true ||
    hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true
  );
}
