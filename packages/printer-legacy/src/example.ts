import type {
  GraphQLOperationType,
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
  isNode,
  isOperation,
  isType,
  parse,
  print,
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

const parseExampleValue = (
  value: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type: GraphQLOperationType | GraphQLType,
): unknown => {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch (err: unknown) {
    if (isOperation(type)) {
      try {
        return parse(value, { noLocation: true });
      } catch (err: unknown) {
        /* empty */
      }
    }
  }

  return value;
};

const parseExampleDirective = (
  type: Maybe<GraphQLOperationType | GraphQLType>,
  directiveExample: TypeDirectiveExample,
): Maybe<unknown> => {
  const parser =
    typeof directiveExample.parser === "function"
      ? directiveExample.parser
      : parseExampleValue;

  const namedType = isType(type) ? getNamedType(type) : type;
  if (!namedType) {
    return undefined;
  }

  try {
    const arg = getTypeDirectiveArgValue(
      directiveExample.directive,
      namedType,
      directiveExample.field,
    ) as unknown;

    return parser(arg, namedType);
  } catch (err: unknown) {
    if (err instanceof IntrospectionError) {
      return isType(namedType)
        ? parseTypeFields(namedType, directiveExample)
        : undefined;
    }
    throw err;
  }
};

export const printExample = (
  type: unknown,
  directiveExample: TypeDirectiveExample,
): Maybe<string> => {
  if (!isType(type) && !isOperation(type)) {
    return undefined;
  }

  const example = parseExampleDirective(type, directiveExample);

  if (!example) {
    return undefined;
  }

  if (isOperation(type) && isNode(example)) {
    return print(example);
  }

  return JSON.stringify(example, undefined, 2);
};
