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
  isNonNullType,
  isLeafType,
  printSchema,
  GraphQLSchema,
  OperationTypeNode,
} = require("graphql");
const { loadSchema: asyncLoadSchema } = require("@graphql-tools/load");

const { hasMethod, hasProperty } = require("../utils/scalars/object");

const OperationTypeNodes = [
  OperationTypeNode.QUERY,
  OperationTypeNode.MUTATION,
  OperationTypeNode.SUBSCRIPTION,
];

const DefaultLoaders = {
  GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
};

async function loadSchema(schemaLocation, options) {
  const rootTypes = hasProperty(options, "rootTypes")
    ? options.rootTypes
    : undefined;

  if (hasProperty(options, "rootTypes")) {
    delete options["rootTypes"];
  }

  const schema = await asyncLoadSchema(schemaLocation, options);

  if (typeof rootTypes === "undefined") {
    return schema;
  }

  const config = {
    ...schema.toConfig(),
    query: schema.getType(rootTypes.query ?? "Query"),
    mutation: schema.getType(rootTypes.mutation ?? "Mutation"),
    subscription: schema.getType(rootTypes.subscription ?? "Subscription"),
  };

  return new GraphQLSchema(config);
}

function getDocumentLoaders(extraLoaders = {}) {
  const loadersList = { ...DefaultLoaders, ...extraLoaders };

  const loaders = [];
  const loaderOptions = {};

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

function getListDefaultValues(type, value) {
  const defaultValues = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getDefaultValue({ type, defaultValue }),
  );

  return `[${defaultValuesString.join(", ")}]`;
}

function getDefaultValue({ type, defaultValue }) {
  if (defaultValue === null || typeof defaultValue === "undefined") {
    return undefined;
  }

  if (isListType(type)) {
    return getListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(type, defaultValue);
}

function formatDefaultValue(type, defaultValue) {
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

function getFilteredTypeMap(schema) {
  if (typeof schema == "undefined" || schema == null) {
    return undefined;
  }

  const operationKinds = [];
  OperationTypeNodes.forEach((operationTypeNode) => {
    const operationType = schema.getRootType(operationTypeNode);
    if (typeof operationType !== "undefined") {
      operationKinds.push(operationType.name);
    }
  });

  const filterOperationFragmentRegExp =
    operationKinds.length > 0 ? [...operationKinds, ""].join("$|") : "";
  const excludeListRegExp = new RegExp(
    `^(?!${filterOperationFragmentRegExp}__.+$).*$`,
  );

  const typeMap = schema.getTypeMap();

  return Object.keys(typeMap)
    .filter((key) => excludeListRegExp.test(key))
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
}

function getIntrospectionFieldsList(queryType) {
  if (
    typeof queryType == "undefined" ||
    queryType == null ||
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
  switch (true) {
    case hasProperty(type, "name"):
      return type.name;
    case hasMethod(type, "toString"):
      return type.toString();
    case typeof type === "undefined":
    case type == null:
    default:
      return defaultName;
  }
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
  const typeMap = getFilteredTypeMap(schema);

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

function mapRelationOf(relations, schema, callback) {
  const schemaMap = getSchemaMap(schema);

  for (const relation of Object.keys(relations)) {
    const entity = schemaMap[relation];
    if (typeof entity === "undefined") {
      continue;
    }

    let results = [];
    for (const [relationName, relationType] of Object.entries(entity)) {
      results = callback(relationName, relationType, results);
    }
    relations[relation] = results;
  }

  return relations;
}

function getRelationOfReturn(type, schema) {
  const relations = { queries: [], mutations: [], subscriptions: [] };

  return mapRelationOf(
    relations,
    schema,
    (relationName, relationType, results) => {
      if (getNamedType(relationType.type).name === type.name) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

function getRelationOfField(type, schema) {
  const relations = {
    queries: [],
    mutations: [],
    subscriptions: [],
    objects: [],
    interfaces: [],
    inputs: [],
    directives: [],
  };

  return mapRelationOf(
    relations,
    schema,
    (relationName, relationType, results) => {
      // directives are handled as flat array instead of map
      const key = isDirectiveType(relationType)
        ? relationType.name
        : relationName;

      const fields = Object.assign(
        {},
        relationType.args ?? {},
        relationType._fields ?? {},
      );
      for (const fieldDef of Object.values(fields)) {
        if (getNamedType(fieldDef.type).name === type.name) {
          if (!results.find((r) => r === key || r.name === key)) {
            results.push(relationType);
          }
        }
      }
      return results;
    },
  );
}

function getRelationOfUnion(type, schema) {
  const relations = { unions: [] };

  return mapRelationOf(
    relations,
    schema,
    (relationName, relationType, results) => {
      if (relationType._types.find((subType) => subType.name === type.name)) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

function getRelationOfInterface(type, schema) {
  const relations = { objects: [], interfaces: [] };

  return mapRelationOf(
    relations,
    schema,
    (relationName, relationType, results) => {
      if (
        relationType._interfaces.find((subType) => subType.name === type.name)
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

function getRelationOfImplementation(type, schema) {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
}

function isParametrizedField(type) {
  return hasProperty(type, "args") && type.args.length > 0;
}

function isOperation(type) {
  return hasProperty(type, "type");
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
  isNonNullType,
  isLeafType,
  isListType,
  printSchema,
  getFilteredTypeMap,
  getIntrospectionFieldsList,
  getTypeFromTypeMap,
  getRelationOfReturn,
  getRelationOfField,
  getRelationOfUnion,
  getRelationOfInterface,
  getRelationOfImplementation,
};
