const {
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
  isDirective: isDirectiveType,
  getNamedType,
  isScalarType,
  isEnumType,
  isUnionType,
  isInterfaceType,
  isObjectType,
  isInputObjectType: isInputType,
  isNullableType,
  printSchema,
} = require("graphql");
const { loadSchema } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");
const { UrlLoader } = require("@graphql-tools/url-loader");
const { JsonFileLoader } = require("@graphql-tools/json-file-loader");
const { toArray } = require("./utils");

const SCHEMA_EXCLUDE_LIST_PATTERN = /^(?!Query$|Mutation$|Subscription$|__).*$/;

function getDefaultValue(argument) {
  if (isListType(argument.type)) return `[${argument.defaultValue}]`;
  switch (argument.type) {
    case GraphQLID:
    case GraphQLInt:
      return `${argument.defaultValue || 0}`;
    case GraphQLFloat:
      return `${argument.defaultValue || 0.0}`;
    case GraphQLString:
    default:
      return argument.defaultValue ? `"${argument.defaultValue}"` : undefined;
  }
}

function getFilteredTypeMap(typeMap) {
  if (!typeMap) return undefined;
  const excludeList = SCHEMA_EXCLUDE_LIST_PATTERN;
  return Object.keys(typeMap)
    .filter((key) => excludeList.test(key))
    .reduce((res, key) => ((res[key] = typeMap[key]), res), {});
}

function getIntrospectionFieldsList(queryType) {
  if (!queryType) return undefined;
  return queryType.getFields();
}

function getFields(type) {
  if ("getFields" in type) {
    const fieldMap = type.getFields();
    return Object.keys(fieldMap).map((name) => fieldMap[name]);
  }
  return [];
}

function getTypeName(type, name = "") {
  if (type)
    return (
      ("name" in type && type.name) ||
      ("toString" in type && type.toString()) ||
      name
    );
  return undefined;
}

function getTypeFromTypeMap(typeMap, type) {
  if (!typeMap) return undefined;
  return Object.keys(typeMap)
    .filter((key) => typeMap[key] instanceof type)
    .reduce((res, key) => ((res[key] = typeMap[key]), res), {});
}

function getSchemaMap(schema) {
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

function isParametrizedField(field) {
  return "args" in field && field.args.length > 0;
}

function isQuery(query) {
  return "type" in query;
}

module.exports = {
  loadSchema,
  GraphQLFileLoader,
  UrlLoader,
  JsonFileLoader,
  isDirectiveType,
  isObjectType,
  getNamedType,
  isScalarType,
  isEnumType,
  isUnionType,
  getSchemaMap,
  getTypeName,
  isParametrizedField,
  getFields,
  getDefaultValue,
  isQuery,
  isInterfaceType,
  isInputType,
  isNullableType,
  isListType,
  printSchema,
};
