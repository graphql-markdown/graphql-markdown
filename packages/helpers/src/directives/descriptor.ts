import type { GraphQLDirective } from "@graphql-markdown/types";

import { getTypeDirectiveValues } from "@graphql-markdown/utils";

import { interpolate } from "../utils/interpolate";

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
