const {
  GraphQLEnumType,
  GraphQLUnionType,
  GraphQLScalarType,
  isListType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLID,
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

const { hasMethod, hasProperty } = require("../utils/scalars/object");

const SCHEMA_EXCLUDE_LIST_PATTERN =
  /^(?!Query$|Mutation$|Subscription$|__.+$).*$/;

const DefaultLoaders = {
  GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
};

function getDocumentLoaders(extraLoaders = {}) {
  const loadersList = { ...DefaultLoaders, ...extraLoaders };

  var loaders = [];
  var loaderOptions = {};

  Object.entries(loadersList).forEach(([className, graphqlDocumentLoader]) => {
    try {
      if (typeof graphqlDocumentLoader === "string") {
        const { [className]: Loader } = require(graphqlDocumentLoader);
        loaders.push(new Loader());
      } else {
        if (!graphqlDocumentLoader.module) {
          throw new Error(
            `Wrong format for plugin loader "${className}", it should be {module: String, options?: Object}`,
          );
        }
        const { [className]: Loader } = require(graphqlDocumentLoader.module);
        loaders.push(new Loader());
        Object.assign(loaderOptions, graphqlDocumentLoader.options);
      }
    } catch (error) {
      console.warn(graphqlDocumentLoader, error.message);
    }
  });

  if (loaders.length < 1) {
    throw new Error("No GraphQL document loaders available.");
  }

  return { loaders, loaderOptions };
}

function getDefaultValue(argument) {
  if (
    argument.defaultValue === null ||
    typeof argument.defaultValue === "undefined"
  ) {
    return undefined;
  }

  if (isListType(argument.type)) {
    const defaultValues = Array.isArray(argument.defaultValue)
      ? argument.defaultValue
      : [argument.defaultValue];

    const defaultValuesString = defaultValues
      .map((defaultValue) => {
        return printDefaultValue(argument.type.ofType, defaultValue);
      })
      .join(", ");

    return `[${defaultValuesString}]`;
  }

  return printDefaultValue(argument.type, argument.defaultValue);
}

function printDefaultValue(type, value) {
  if (isEnumType(type)) {
    return value;
  }

  switch (type) {
    case GraphQLInt:
    case GraphQLFloat:
    case GraphQLBoolean:
      return value;
    case GraphQLID:
    case GraphQLString:
    default:
      return `"${value}"`;
  }
}

function getFilteredTypeMap(
  typeMap,
  excludeList = SCHEMA_EXCLUDE_LIST_PATTERN,
) {
  if (typeof typeMap == "undefined" || typeMap == null) {
    return undefined;
  }
  return Object.keys(typeMap)
    .filter((key) => excludeList.test(key))
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
}

function getIntrospectionFieldsList(queryType) {
  if (
    (typeof queryType == "undefined" || queryType == null) &&
    !hasMethod(queryType, "getFields")
  ) {
    return undefined;
  }
  return queryType.getFields();
}

function getFields(type) {
  if (!hasMethod(type, "getFields")) {
    return [];
  }
  const fieldMap = type.getFields();
  return Object.keys(fieldMap).map((name) => fieldMap[name]);
}

function getTypeName(type, defaultName = "") {
  if (typeof type === "undefined" || type == null) {
    return defaultName;
  }
  return (
    (hasProperty(type, "name") && type.name) ||
    (hasMethod(type, "toString") && type.toString()) ||
    defaultName
  );
}

function getTypeFromTypeMap(typeMap, type) {
  if (typeof typeMap == "undefined" || typeMap == null) {
    return undefined;
  }
  return Object.keys(typeMap)
    .filter((key) => typeMap[key] instanceof type)
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
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
    directives: schema.getDirectives(),
    objects: getTypeFromTypeMap(typeMap, GraphQLObjectType),
    unions: getTypeFromTypeMap(typeMap, GraphQLUnionType),
    interfaces: getTypeFromTypeMap(typeMap, GraphQLInterfaceType),
    enums: getTypeFromTypeMap(typeMap, GraphQLEnumType),
    inputs: getTypeFromTypeMap(typeMap, GraphQLInputObjectType),
    scalars: getTypeFromTypeMap(typeMap, GraphQLScalarType),
  };
}

function isParametrizedField(field) {
  return hasProperty(field, "args") && field.args.length > 0;
}

function isOperation(query) {
  return hasProperty(query, "type");
}

module.exports = {
  loadSchema,
  getDocumentLoaders,
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
  isOperation,
  isInterfaceType,
  isInputType,
  isNullableType,
  isListType,
  printSchema,
  getFilteredTypeMap,
  getIntrospectionFieldsList,
  getTypeFromTypeMap,
  SCHEMA_EXCLUDE_LIST_PATTERN,
};
