import type { Badge, GraphQLDirective } from "@graphql-markdown/types";

import { getTypeDirectiveValues } from "./graphql";
import { interpolate } from "./string";

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

export function directiveTag(
  directive: GraphQLDirective,
  type?: unknown,
  classname: string = "badge--secondary",
): Badge {
  return {
    text: `@${directive.name}`,
    classname: classname,
  };
}
