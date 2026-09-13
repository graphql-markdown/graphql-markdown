/**
 * Predicate and resolver helpers for `decorators`.
 *
 * A decorator (see `@graphql-markdown/types`'s `DecoratorDefinition`) is
 * selected by a predicate over the node being printed, rather than by a fixed
 * directive name. This module provides the common building blocks: matching a
 * directive, matching an entity kind, composing predicates, and reading a
 * directive's occurrences as decorator values.
 *
 * @packageDocumentation
 */

import type {
  DecoratorPredicate,
  DecoratorResolver,
  GraphQLDirective,
  Maybe,
  PrintTypeOptions,
  SchemaEntity,
} from "@graphql-markdown/types";

import {
  getDirectivesHolder,
  getTypeDirectiveValuesList,
  GraphQLSchema,
} from "./introspection";
import {
  instanceOf,
  isDirectiveType,
  isEnumType,
  isInputType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "./guard";

/**
 * Resolves the schema entity kind of the type being printed.
 *
 * The kind is taken from the print options when the caller knows it, as only
 * the caller can tell a query from a mutation. It falls back to the type guards
 * otherwise, which cover every kind but the operations.
 *
 * @param type - the GraphQL type being printed.
 * @param options - the print options in effect.
 *
 * @returns the schema entity kind, or `undefined` when it cannot be determined.
 *
 */
export const getSchemaEntity = (
  type: unknown,
  options: PrintTypeOptions,
): Maybe<SchemaEntity> => {
  if (options.entity) {
    return options.entity;
  }

  switch (true) {
    case isDirectiveType(type):
      return "directives";
    case isEnumType(type):
      return "enums";
    case isInputType(type):
      return "inputs";
    case isInterfaceType(type):
      return "interfaces";
    case isObjectType(type):
      return "objects";
    case isScalarType(type):
      return "scalars";
    case isUnionType(type):
      return "unions";
    default:
      return undefined;
  }
};

/**
 * Builds a predicate matching a node carrying a specific directive.
 *
 * @param name - the schema directive name to match.
 *
 * @returns a {@link DecoratorPredicate} true when the node carries `@name`.
 *
 * @example
 * ```js
 * decorators: {
 *   responses: {
 *     predicate: hasDirectiveNamed("httpResponse"),
 *     render: (values) => values.map((v) => `- ${v.code}`).join("\n"),
 *   },
 * }
 * ```
 */
export const hasDirectiveNamed = (name: string): DecoratorPredicate => {
  return (type: unknown): boolean => {
    const node = getDirectivesHolder(type);
    if (!Array.isArray(node?.directives)) {
      return false;
    }
    return node.directives.some((directiveNode): boolean => {
      return directiveNode.name.value === name;
    });
  };
};

/**
 * Builds a predicate matching a node carrying any directive at all.
 *
 * @returns a {@link DecoratorPredicate} true when the node carries at least one directive.
 *
 */
export const hasAnyDirective = (): DecoratorPredicate => {
  return (type: unknown): boolean => {
    const node = getDirectivesHolder(type);
    return Array.isArray(node?.directives) && node.directives.length > 0;
  };
};

/**
 * Builds a predicate matching one of the given schema entity kinds.
 *
 * @param kinds - the schema entity kinds to match.
 *
 * @returns a {@link DecoratorPredicate} true when the node's resolved entity kind is one of `kinds`.
 *
 */
export const isEntity = (...kinds: SchemaEntity[]): DecoratorPredicate => {
  return (type: unknown, options: PrintTypeOptions): boolean => {
    const entity = getSchemaEntity(type, options);
    return !!entity && kinds.includes(entity);
  };
};

/**
 * Combines predicates with logical AND. An empty list is vacuously `true`.
 *
 * @param predicates - the predicates to combine.
 *
 * @returns a {@link DecoratorPredicate} true when every one of `predicates` is true.
 *
 */
export const and = (
  ...predicates: DecoratorPredicate[]
): DecoratorPredicate => {
  return (type: unknown, options: PrintTypeOptions): boolean => {
    return predicates.every((predicate): boolean => {
      return predicate(type, options);
    });
  };
};

/**
 * Combines predicates with logical OR. An empty list is vacuously `false`.
 *
 * @param predicates - the predicates to combine.
 *
 * @returns a {@link DecoratorPredicate} true when at least one of `predicates` is true.
 *
 */
export const or = (...predicates: DecoratorPredicate[]): DecoratorPredicate => {
  return (type: unknown, options: PrintTypeOptions): boolean => {
    return predicates.some((predicate): boolean => {
      return predicate(type, options);
    });
  };
};

/**
 * Negates a predicate.
 *
 * @param predicate - the predicate to negate.
 *
 * @returns a {@link DecoratorPredicate} true when `predicate` is false.
 *
 */
export const not = (predicate: DecoratorPredicate): DecoratorPredicate => {
  return (type: unknown, options: PrintTypeOptions): boolean => {
    return !predicate(type, options);
  };
};

/**
 * A predicate that always matches, regardless of the node being printed.
 *
 * @returns a {@link DecoratorPredicate} that is always `true`.
 *
 */
export const always = (): DecoratorPredicate => {
  return (): boolean => {
    return true;
  };
};

/**
 * Resolves a schema directive definition by name.
 *
 * Shared by {@link directiveOccurrences} (which reads a directive's argument
 * values off a node) and `@graphql-markdown/printer-legacy`'s decorator
 * resolution (which also needs the directive definition itself, for a
 * decorator's render context) — both need "look up this named directive on
 * `options.schema`, safely", so it lives here once rather than being
 * reimplemented at each call site.
 *
 * @param name - the schema directive name to resolve.
 * @param options - the print options in effect; `options.schema` is read.
 *
 * @returns the directive definition, or `undefined` when `options.schema` is
 * absent, not a `GraphQLSchema`, or does not declare a directive named `name`.
 *
 */
export const getDirectiveFromSchema = (
  name: string,
  options: PrintTypeOptions,
): Maybe<GraphQLDirective> => {
  const schema = options.schema;
  return schema && instanceOf(schema, GraphQLSchema as never)
    ? (schema.getDirective(name) ?? undefined)
    : undefined;
};

/**
 * Builds a resolver reading every occurrence of a directive off the node being
 * printed, as one record of arguments per occurrence (see
 * {@link getTypeDirectiveValuesList}, which this delegates to and which also
 * covers repeatable directives).
 *
 * @param name - the schema directive name to read.
 *
 * @returns a {@link DecoratorResolver} resolving that directive's occurrences,
 * or an empty array when the schema or the directive is absent.
 *
 */
export const directiveOccurrences = (name: string): DecoratorResolver => {
  return (
    type: unknown,
    options: PrintTypeOptions,
  ): Record<string, unknown>[] => {
    const directive = getDirectiveFromSchema(name, options);

    if (!directive) {
      return [];
    }

    return getTypeDirectiveValuesList(directive, type);
  };
};
