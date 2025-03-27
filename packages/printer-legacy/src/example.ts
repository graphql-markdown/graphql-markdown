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
  isNonNullType,
  isOperation,
  isType,
  parse,
  print,
} from "@graphql-markdown/graphql";

import { toString } from "@graphql-markdown/utils";

import { hasPrintableDirective } from "./link";

/**
 *
 */
export const getDirectiveExampleOption = ({
  exampleSection,
  schema,
}: PrintTypeOptions): Maybe<TypeDirectiveExample> => {
  let directiveName: string = "example",
    argName: string = "value",
    parserFunc: Maybe<DirectiveExampleParserFunction> = undefined;
  if (exampleSection && typeof exampleSection === "object") {
    if ("directive" in exampleSection && exampleSection.directive) {
      directiveName = exampleSection.directive;
    }
    if ("field" in exampleSection && exampleSection.field) {
      argName = exampleSection.field;
    }
    if ("parser" in exampleSection && exampleSection.parser) {
      parserFunc = exampleSection.parser;
    }
  }
  const directive =
    schema && instanceOf(schema, GraphQLSchema as never)
      ? schema.getDirective(directiveName)
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
  mappedTypes: string[] = [],
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
        mappedTypes,
      );

      let structuredValue: unknown = value;
      if (isListType(getNullableType(fieldType as Maybe<GraphQLType>))) {
        if (!value && isNonNullType(fieldType as Maybe<GraphQLType>)) {
          structuredValue = [];
        } else {
          structuredValue = value ? [value] : undefined;
        }
      }

      example = {
        ...example,
        [field.name]: structuredValue,
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
  mappedTypes: string[] = [],
): Maybe<unknown> => {
  const directiveExample = getDirectiveExampleOption(options);
  if (!directiveExample || !hasPrintableDirective(type, options)) {
    return undefined;
  }

  const parser =
    typeof directiveExample.parser === "function"
      ? directiveExample.parser
      : parseExampleValue;

  // get parent type
  const namedType = isType(type) ? getNamedType(type) : type;
  if (!namedType) {
    return undefined;
  }

  // get type name
  const typename = isType(namedType)
    ? toString(namedType)
    : toString(namedType.name);

  // recursion check
  if (mappedTypes.includes(typename)) {
    return undefined;
  }
  mappedTypes.push(typename);

  try {
    const arg = getTypeDirectiveArgValue(
      directiveExample.directive,
      namedType,
      directiveExample.field,
    ) as unknown;

    return parser(arg, namedType);
  } catch (err: unknown) {
    if (err instanceof IntrospectionError) {
      if (!isType(namedType)) {
        return undefined;
      }
      return parseTypeFields(namedType, options, mappedTypes);
    }
    throw err;
  }
};

/**
 *
 */
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
