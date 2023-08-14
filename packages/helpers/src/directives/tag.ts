import type { Badge, GraphQLDirective } from "@graphql-markdown/types";

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
