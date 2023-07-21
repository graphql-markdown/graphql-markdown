import { hasProperty, isEmpty } from "./object";

const WILDCARD_DIRECTIVE = "*";

export function getCustomDirectives(
  { directives: schemaDirectives }: { directives?: Record<string, any> },
  customDirectiveOptions?: Record<string, any>,
): Record<string, any> | undefined {
  const customDirectives: Record<string, any> = {};

  if (
    typeof schemaDirectives !== "object" ||
    typeof customDirectiveOptions !== "object"
  ) {
    return undefined;
  }

  for (const schemaDirectiveName in schemaDirectives) {
    if (
      isCustomDirective(schemaDirectiveName, customDirectiveOptions) === false
    ) {
      continue;
    }

    const directiveOptions = getCustomDirectiveOptions(
      schemaDirectiveName,
      customDirectiveOptions,
    );

    if (typeof directiveOptions === "undefined") {
      continue;
    }

    customDirectives[schemaDirectiveName] = {
      type: schemaDirectives[schemaDirectiveName],
      ...directiveOptions,
    };
  }

  return isEmpty(customDirectives) === true ? undefined : customDirectives;
}

export function getCustomDirectiveOptions(
  schemaDirectiveName: string,
  customDirectiveOptions: Record<string, any>,
): Record<string, any> | undefined {
  if (hasProperty(customDirectiveOptions, schemaDirectiveName) === true) {
    return customDirectiveOptions[schemaDirectiveName];
  }

  if (hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true) {
    return customDirectiveOptions[WILDCARD_DIRECTIVE];
  }

  return undefined;
}

export function isCustomDirective(schemaDirectiveName: string, customDirectiveOptions: Record<string, any>): boolean {
  return (
    hasProperty(customDirectiveOptions, schemaDirectiveName) === true ||
    hasProperty(customDirectiveOptions, WILDCARD_DIRECTIVE) === true
  );
}
