import {
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLScalarType,
  isListType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLInputObjectType,
  GraphQLFieldMap,
  GraphQLField,
  GraphQLSchema,
  GraphQLNamedType,
  GraphQLType,
  GraphQLEnumValue,
  GraphQLArgument,
} from "graphql";

import { Maybe } from "graphql/jsutils/Maybe";
import { TypeMap } from "graphql/type/schema";

import { hasOwnMethod, hasOwnProperty } from ".";

export {
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLScalarType,
  isListType,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLInputObjectType,
  isDirective as isDirectiveType,
  getNamedType,
  isScalarType,
  isEnumType,
  isUnionType,
  isInterfaceType,
  isObjectType,
  isInputObjectType as isInputType,
  isNullableType,
  printSchema,
} from "graphql";
export { loadSchema } from "@graphql-tools/load";
export { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
export { UrlLoader } from "@graphql-tools/url-loader";
export { JsonFileLoader } from "@graphql-tools/json-file-loader";

export const SCHEMA_EXCLUDE_LIST_PATTERN =
  /^(?!Query$|Mutation$|Subscription$|__.+$).*$/;

export function getDefaultValue(argument: GraphQLArgument): Maybe<string> {
  if (isListType(argument.type)) {
    return `[${argument.defaultValue || ""}]`;
  }

  switch (argument.type) {
    case GraphQLID:
    case GraphQLInt:
      return `${argument.defaultValue || "0"}`;
    case GraphQLFloat:
      return `${argument.defaultValue || "0.0"}`;
    case GraphQLString:
    default:
      return argument.defaultValue ? `"${argument.defaultValue}"` : undefined;
  }
}

export function getFilteredTypeMap(
  typeMap: Record<string, GraphQLNamedType>,
  excludeList = SCHEMA_EXCLUDE_LIST_PATTERN,
): Maybe<TypeMap> {
  if (!typeMap) return;
  return Object.keys(typeMap)
    .filter((key) => excludeList.test(key))
    .reduce((res: TypeMap, key) => ((res[key] = typeMap[key]), res), {});
}

export function getIntrospectionFieldsList(queryType: Maybe<GraphQLObjectType<unknown, unknown>>): Maybe<GraphQLFieldMap<unknown, unknown>> {
  if (!queryType){
    return;
  }

  if (!hasOwnMethod(queryType, "getFields")) {
    return;
  }
  return queryType.getFields();
}

export function getFields(type: GraphQLType): Maybe<unknown[]> {
  if (!hasOwnMethod(type, "getFields")) {
    return;
  }
  const fieldMap = type.getFields();
  return Object.keys(fieldMap).map((name) => fieldMap[name]);
}

export function getTypeName(
  type: GraphQLType | GraphQLEnumValue | GraphQLArgument,
  defaultName = "",
): string {
  if (!type) {
    return defaultName;
  }
  return (
    (hasOwnProperty(type, "name") && type.name) ||
    (hasOwnMethod(type, "toString") && type.toString()) ||
    defaultName
  );
}

export function getTypeFromTypeMap(typeMap: TypeMap, type: any): Maybe<Record<string, unknown>> {
  if (!typeMap) return;
  return Object.keys(typeMap)
    .filter((key) => typeMap[key] instanceof type)
    .reduce((res: Record<string, unknown>, key) => ((res[key] = typeMap[key]), res), {});
}

export function getSchemaMap(schema: GraphQLSchema): unknown {
  const typeMap = getFilteredTypeMap(schema.getTypeMap());
  if (!typeMap) return;
  return {
    queries: getIntrospectionFieldsList(
      schema.getQueryType && schema.getQueryType(),
    ),
    mutations: getIntrospectionFieldsList(
      schema.getMutationType && schema.getMutationType(),
    ),
    subscriptions: getIntrospectionFieldsList(
      schema.getSubscriptionType && schema.getSubscriptionType(),
    ),
    directives: schema.getDirectives(),
    objects: getTypeFromTypeMap(typeMap, GraphQLObjectType),
    unions: getTypeFromTypeMap(typeMap, GraphQLUnionType),
    interfaces: getTypeFromTypeMap(typeMap, GraphQLInterfaceType),
    enums: getTypeFromTypeMap(typeMap, GraphQLEnumType),
    inputs: getTypeFromTypeMap(typeMap, GraphQLInputObjectType),
    scalars: getTypeFromTypeMap(typeMap, GraphQLScalarType),
  };
}

export function isParametrized<X extends unknown>(obj: X): obj is X & Record<"args", GraphQLArgument[]> {
  return hasOwnProperty(obj, "args") && hasOwnProperty(obj.args, "length") && <number>(obj.args.length) > 0;
}

export function isOperation<X extends unknown>(obj: X): obj is X & Record<"type", GraphQLType> & Record<"args", GraphQLArgument[]>  {
  return isParametrized(obj) && hasOwnProperty(obj, "type");
}
