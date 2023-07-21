import type { GraphQLDirective, GraphQLNamedType } from "graphql";

import { getTypeDirectiveValues } from "./graphql";
import { interpolate } from "./string";

export function directiveDescriptor(
  directiveType: GraphQLDirective,
  type: GraphQLNamedType,
  descriptionTemplate?: string,
) {
  const values = getTypeDirectiveValues(directiveType, type);
  if (typeof descriptionTemplate !== "string") {
    return interpolate(directiveType.description || "", values);
  }
  return interpolate(descriptionTemplate, values);
}

export function directiveTag(directiveType: GraphQLDirective, type: GraphQLNamedType, classname: string = "badge--secondary") {
  return {
    text: `@${directiveType.name}`,
    classname: classname,
  };
}
