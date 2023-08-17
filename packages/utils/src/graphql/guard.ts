import type { GraphQLField } from "graphql";

export {
  isDirective as isDirectiveType,
  isEnumType,
  isInputObjectType as isInputType,
  isInterfaceType,
  isLeafType,
  isListType,
  isNamedType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";

export function isParametrizedField(
  type: unknown,
): type is GraphQLField<unknown, unknown, unknown> {
  return (
    typeof type === "object" &&
    type !== null &&
    "args" in type &&
    (type as GraphQLField<unknown, unknown, unknown>).args.length > 0
  );
}

export function isOperation(type: unknown): boolean {
  return typeof type === "object" && type !== null && "type" in type;
}

export function isDeprecated<T>(
  type: T,
): type is Partial<{ deprecationReason: string; isDeprecated: boolean }> & T {
  return (
    typeof type === "object" &&
    type !== null &&
    (("isDeprecated" in type && type.isDeprecated === true) ||
      ("deprecationReason" in type &&
        typeof type.deprecationReason === "string"))
  );
}

/**
 * Type guard for checking if a GraphQL named type is of type.
 *
 * @internal
 *
 * @param obj - a GraphQL named type from the GraphQL schema.
 * @param type - a GraphQL type, eg `GraphQLObjectType`.
 *
 * @returns `true` if types matches, else `false`.
 *
 */
export function instanceOf<T>(obj: unknown, type: new () => T): obj is T {
  try {
    const expect = type.name;
    return typeof obj !== "object" || obj === null
      ? false
      : obj.constructor.name == expect;
  } catch (_) {
    return false;
  }
}
