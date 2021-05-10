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
} from "graphql";

import { Maybe } from "graphql/jsutils/Maybe";

import { toArray, hasOwnMethod, hasOwnProperty } from ".";

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

export function getDefaultValue(argument: { type: any; defaultValue: any }) {
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
  typeMap: { [x: string]: any },
  excludeList = SCHEMA_EXCLUDE_LIST_PATTERN,
) {
  if (!typeMap) return undefined;
  return Object.keys(typeMap)
    .filter((key) => excludeList.test(key))
    .reduce((res: any, key) => ((res[key] = typeMap[key]), res), {});
}

export function getIntrospectionFieldsList(queryType: Maybe<GraphQLObjectType<any, any>>) {
  if (!queryType){
    return;
  }

  if (!hasOwnMethod(queryType, "getFields")) {
    return;
  }
  return queryType.getFields();
}

export function getFields(type: { getFields: () => any }) {
  if (!hasOwnMethod(type, "getFields")) {
    return [];
  }
  const fieldMap = type.getFields();
  return Object.keys(fieldMap).map((name) => fieldMap[name]);
}

export function getTypeName(
  type: { name: any; toString: () => any },
  defaultName = "",
) {
  if (!type) {
    return undefined;
  }
  return (
    (hasOwnProperty(type, "name") && type.name) ||
    (hasOwnMethod(type, "toString") && type.toString()) ||
    defaultName
  );
}

export function getTypeFromTypeMap(typeMap: any, type: any) {
  if (!typeMap) return undefined;
  return Object.keys(typeMap)
    .filter((key) => typeMap[key] instanceof type)
    .reduce((res: any, key) => ((res[key] = typeMap[key]), res), {});
}

export function getSchemaMap(schema: {
  getTypeMap: () => any;
  getQueryType: () => any;
  getMutationType: () => any;
  getSubscriptionType: () => any;
  getDirectives: () => any;
}) {
  const typeMap = getFilteredTypeMap(schema.getTypeMap());
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
    directives: toArray(schema.getDirectives && schema.getDirectives()),
    objects: getTypeFromTypeMap(typeMap, GraphQLObjectType),
    unions: getTypeFromTypeMap(typeMap, GraphQLUnionType),
    interfaces: getTypeFromTypeMap(typeMap, GraphQLInterfaceType),
    enums: getTypeFromTypeMap(typeMap, GraphQLEnumType),
    inputs: getTypeFromTypeMap(typeMap, GraphQLInputObjectType),
    scalars: getTypeFromTypeMap(typeMap, GraphQLScalarType),
  };
}

export function isParametrizedField(field: GraphQLFieldMap<any, any> | GraphQLField<any, any, { [key: string]: any; }>) {
  return hasOwnProperty(field, "args") && field.args.length > 0;
}

export function isOperation(query: GraphQLFieldMap<any, any> | GraphQLField<any, any, { [key: string]: any; }>) {
  return hasOwnProperty(query, "type");
}
