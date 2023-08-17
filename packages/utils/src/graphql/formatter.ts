import type { GraphQLType } from "graphql";
import {
  getNamedType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  isEnumType,
  isListType,
} from "graphql";

import type { Maybe } from "@graphql-markdown/types";

export function getFormattedListDefaultValues<T>(
  type: Maybe<GraphQLType>,
  value: T,
): string {
  if (typeof type === "undefined" || type === null) {
    return "";
  }

  const defaultValues: T[] = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getFormattedDefaultValue({ type, defaultValue }),
  );

  return `[${defaultValuesString.join(", ")}]`;
}

export function getFormattedDefaultValue<T>({
  type,
  defaultValue,
}: {
  type: Maybe<GraphQLType>;
  defaultValue: T;
}): Maybe<T | string> {
  if (
    typeof type === "undefined" ||
    type === null ||
    typeof defaultValue === "undefined" ||
    defaultValue === null
  ) {
    return undefined;
  }

  if (isListType(type)) {
    return getFormattedListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(type, defaultValue);
}
function formatDefaultValue<T>(
  type: Maybe<GraphQLType>,
  defaultValue: T,
): T | string {
  if (isEnumType(type)) {
    return defaultValue;
  }

  switch (type) {
    case GraphQLInt:
    case GraphQLFloat:
    case GraphQLBoolean:
      return defaultValue;
    case GraphQLID:
    case GraphQLString:
      return `"${defaultValue}"`;
    default:
      return defaultValue;
  }
}
