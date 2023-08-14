import type { GraphQLDirective } from "@graphql-markdown/types";

import { getTypeDirectiveValues, interpolate } from "@graphql-markdown/utils";

export function directiveDescriptor(
  directive: GraphQLDirective,
  type?: unknown,
  descriptionTemplate?: string,
): string {
  const values = getTypeDirectiveValues(directive, type);
  if (typeof descriptionTemplate !== "string") {
    return interpolate(directive.description ?? "", values);
  }
  return interpolate(descriptionTemplate, values);
}
