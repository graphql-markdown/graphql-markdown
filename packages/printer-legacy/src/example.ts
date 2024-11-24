import type {
  DirectiveExampleParserFunction,
  GraphQLOperationType,
  GraphQLType,
  Maybe,
  PrintTypeOptions,
  TypeDirectiveExample,
} from "@graphql-markdown/types";

import {
  getFields,
  getNamedType,
  getNullableType,
  getTypeDirectiveArgValue,
  GraphQLSchema,
  hasDirective,
  instanceOf,
  IntrospectionError,
  isListType,
  isNode,
  isOperation,
  isType,
  parse,
  print,
} from "@graphql-markdown/graphql";

import { hasPrintableDirective } from "./link";

export const getDirectiveExampleOption = (
  options: PrintTypeOptions,
): Maybe<TypeDirectiveExample> => {
  let directiveName: string = "example",
    argName: string = "value",
    parserFunc: Maybe<DirectiveExampleParserFunction> = undefined;
  if (options.exampleSection && typeof options.exampleSection === "object") {
    if (
      "directive" in options.exampleSection &&
      options.exampleSection.directive
    ) {
      directiveName = options.exampleSection.directive;
    }
    if ("field" in options.exampleSection && options.exampleSection.field) {
      argName = options.exampleSection.field;
    }
    if ("parser" in options.exampleSection && options.exampleSection.parser) {
      parserFunc = options.exampleSection.parser;
    }
  }
  const directive =
    options.schema && instanceOf(options.schema, GraphQLSchema as never)
      ? options.schema.getDirective(directiveName)
      : undefined;

  if (!directive) {
    return undefined;
  }

  return {
    directive,
    field: argName,
    parser: parserFunc,
  } as TypeDirectiveExample;
};

const parseTypeFields = (
  type: Maybe<GraphQLType>,
  options: PrintTypeOptions,
): Maybe<unknown> => {
  const directiveExample = getDirectiveExampleOption(options);
  if (!directiveExample) {
    return undefined;
  }

  const fields = getFields(type) as {
    astNode: unknown;
    name: string;
    type: unknown;
  }[];

  if (fields.length === 0) {
    return undefined;
  }

  let example: Record<string, unknown> = {};
  fields
    .filter((field) => {
      return hasPrintableDirective(field, options);
    })
    .forEach((field) => {
      const fieldType = hasDirective(field, [directiveExample.directive])
        ? field
        : field.type;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const value = parseExampleDirective(
        fieldType as Maybe<GraphQLType>,
        options,
      );
      example = {
        ...example,
        [field.name]: isListType(
          getNullableType(fieldType as Maybe<GraphQLType>),
        )
          ? [value]
          : value,
      };
    });

  return example;
};

const parseExampleValue = (
  value: unknown,
  type: GraphQLOperationType | GraphQLType,
): unknown => {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  try {
    return JSON.parse(value);
  } catch {
    if (isOperation(type)) {
      try {
        return parse(value, { noLocation: true });
      } catch {
        /* empty */
      }
    }
  }

  return value;
};

const parseExampleDirective = (
  type: Maybe<GraphQLOperationType | GraphQLType>,
  options: PrintTypeOptions,
): Maybe<unknown> => {
  const directiveExample = getDirectiveExampleOption(options);
  if (!directiveExample || !hasPrintableDirective(type, options)) {
    return undefined;
  }

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
        ? parseTypeFields(namedType, options)
        : undefined;
    }
    throw err;
  }
};

export const printExample = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<string> => {
  if (!isType(type) && !isOperation(type)) {
    return undefined;
  }

  const example = parseExampleDirective(type, options);

  if (!example) {
    return undefined;
  }

  if (isOperation(type) && isNode(example)) {
    return print(example);
  }

  return JSON.stringify(example, undefined, 2);
};
