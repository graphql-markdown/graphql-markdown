import type { Maybe, GraphQLDirective } from "@graphql-markdown/types";

import {
  IntrospectionError,
  getFields,
  getTypeDirectiveArgValue,
  hasDirective,
} from "@graphql-markdown/graphql";

export const printExample = (
  type: unknown,
  directiveExample: {
    directive: GraphQLDirective;
    argName: string;
  },
): Maybe<string> => {
  try {
    const arg = getTypeDirectiveArgValue(
      directiveExample.directive,
      type,
      directiveExample.argName,
    );

    return arg ? String(arg) : undefined;
  } catch (err: unknown) {
    if (err instanceof IntrospectionError) {
      const fields = getFields(type) as {
        astNode: unknown;
        name: string;
        type: unknown;
      }[];
      if (fields.length === 0) {
        return undefined;
      }

      let example = {};
      fields.forEach((field) => {
        const fieldType = hasDirective(field, [directiveExample.directive])
          ? field
          : field.type;
        example = {
          ...example,
          [field.name]: printExample(fieldType, directiveExample),
        };
      });
      return JSON.stringify(example);
    }
    throw err;
  }
};
