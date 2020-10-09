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
  isDirective,
  getNamedType,
  isScalarType,
  isEnumType,
  isUnionType,
  isInterfaceType,
  isObjectType,
  isInputObjectType,
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

function getFilteredTypeMap(typemap) {
  if (!typemap) return undefined;
  const excludeList = SCHEMA_EXCLUDE_LIST_PATTERN;
  return Object.keys(typemap)
    .filter((key) => excludeList.test(key))
    .reduce((res, key) => ((res[key] = typemap[key]), res), {});
}

function getIntrospectionFieldsList(querytype) {
  if (!querytype) return undefined;
  return querytype.getFields();
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

function getTypeFromTypeMap(typemap, type) {
  if (!typemap) return undefined;
  return Object.keys(typemap)
    .filter((key) => typemap[key] instanceof type)
    .reduce((res, key) => ((res[key] = typemap[key]), res), {});
}

function getSchemaMap(schema) {
  const typemap = getFilteredTypeMap(schema.getTypeMap());
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
    objects: getTypeFromTypeMap(typemap, GraphQLObjectType),
    unions: getTypeFromTypeMap(typemap, GraphQLUnionType),
    interfaces: getTypeFromTypeMap(typemap, GraphQLInterfaceType),
    enums: getTypeFromTypeMap(typemap, GraphQLEnumType),
    inputs: getTypeFromTypeMap(typemap, GraphQLInputObjectType),
    scalars: getTypeFromTypeMap(typemap, GraphQLScalarType),
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
  isDirective,
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
  isInputObjectType,
  isNullableType,
  isListType,
  printSchema,
};
