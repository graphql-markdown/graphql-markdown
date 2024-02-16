import type {
  GraphQLType,
  Maybe,
  TypeDirectiveExample,
} from "@graphql-markdown/types";

import {
  getFields,
  getNamedType,
  getNullableType,
  getTypeDirectiveArgValue,
  hasDirective,
  IntrospectionError,
  isListType,
  isType,
} from "@graphql-markdown/graphql";

const parseTypeFields = (
  type: Maybe<GraphQLType>,
  directiveExample: TypeDirectiveExample,
): Maybe<unknown> => {
  const fields = getFields(type) as {
    astNode: unknown;
    name: string;
    type: unknown;
  }[];

  if (fields.length === 0) {
    return undefined;
  }

  let example: Record<string, unknown> = {};
  fields.forEach((field) => {
    const fieldType = hasDirective(field, [directiveExample.directive])
      ? field
      : field.type;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const value = parseExampleDirective(
      fieldType as Maybe<GraphQLType>,
      directiveExample,
    );
    example = {
      ...example,
      [field.name]: isListType(getNullableType(fieldType as Maybe<GraphQLType>))
        ? [value]
        : value,
    };
  });

  return example;
};

const parseExampleValue = (value: unknown): Maybe<unknown> => {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch (err: unknown) {
    return value;
  }
};

const parseExampleDirective = (
  type: Maybe<GraphQLType>,
  directiveExample: TypeDirectiveExample,
): Maybe<unknown> => {
  const parser =
    typeof directiveExample.parser === "function"
      ? directiveExample.parser
      : parseExampleValue;

  const namedType = getNamedType(type);
  if (!namedType) {
    return undefined;
  }

  try {
    const arg = getTypeDirectiveArgValue(
      directiveExample.directive,
      namedType,
      directiveExample.argName,
    ) as unknown;

    return parser(arg);
  } catch (err: unknown) {
    if (err instanceof IntrospectionError) {
      return parseTypeFields(namedType, directiveExample);
    }
    throw err;
  }
};

export const printExample = (
  type: unknown,
  directiveExample: TypeDirectiveExample,
): Maybe<string> => {
  if (!isType(type)) {
    return undefined;
  }

  const example = parseExampleDirective(type, directiveExample);

  return JSON.stringify(example, undefined, 2);
};
