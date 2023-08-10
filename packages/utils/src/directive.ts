import type {
  DirectiveName,
  CustomDirective,
  CustomDirectiveMap,
  CustomDirectiveOptions,
  GraphQLDirective,
  Maybe,
} from "@graphql-markdown/types";

import { isEmpty } from "./object";

export const WILDCARD_DIRECTIVE = "*";

export function getCustomDirectives(
  {
    directives: schemaDirectives,
  }: { directives?: Maybe<Record<DirectiveName, GraphQLDirective>> },
  customDirectiveOptions?: CustomDirective,
): Maybe<CustomDirectiveMap> {
  const customDirectives: CustomDirectiveMap = {};

  if (
    typeof schemaDirectives !== "object" ||
    typeof customDirectiveOptions !== "object"
  ) {
    return undefined;
  }

  for (const schemaDirectiveName in schemaDirectives) {
    if (
      !isCustomDirective(
        schemaDirectiveName as DirectiveName,
        customDirectiveOptions,
      )
    ) {
      continue;
    }

    const directiveOptions = getCustomDirectiveOptions(
      schemaDirectiveName as DirectiveName,
      customDirectiveOptions,
    );

    if (typeof directiveOptions !== "object") {
      continue;
    }

    customDirectives[schemaDirectiveName as DirectiveName] = {
      type: schemaDirectives[schemaDirectiveName as DirectiveName],
      ...directiveOptions,
    };
  }

  return isEmpty(customDirectives) ? undefined : customDirectives;
}

export function getCustomDirectiveOptions(
  schemaDirectiveName: DirectiveName,
  customDirectiveOptions: CustomDirective,
): Maybe<CustomDirectiveOptions> {
  if (schemaDirectiveName in customDirectiveOptions) {
    return customDirectiveOptions[schemaDirectiveName];
  }

  if (WILDCARD_DIRECTIVE in customDirectiveOptions) {
    return customDirectiveOptions[WILDCARD_DIRECTIVE as DirectiveName];
  }

  return undefined;
}

export function isCustomDirective(
  schemaDirectiveName: DirectiveName,
  customDirectiveOptions: CustomDirective,
): boolean {
  return (
    schemaDirectiveName in customDirectiveOptions ||
    WILDCARD_DIRECTIVE in customDirectiveOptions
  );
}
