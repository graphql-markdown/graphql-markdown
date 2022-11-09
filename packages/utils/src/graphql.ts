import {
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
  getNamedType,
  isEnumType,
  GraphQLSchema,
  OperationTypeNode,
  GraphQLSchemaConfig,
  GraphQLType,
  isType,
  GraphQLDirective,
  GraphQLField,
  GraphQLInputField,
  isIntrospectionType,
  GraphQLNamedType,
  GraphQLInputType,
} from "graphql";
import {
  loadSchema as asyncLoadSchema,
  LoadSchemaOptions,
} from "@graphql-tools/load";
import { Loader } from "@graphql-tools/utils";

import { Maybe } from "graphql/jsutils/Maybe";
import { keyValMap } from "graphql/jsutils/keyValMap";
import { ObjMap } from "graphql/jsutils/ObjMap";

export {
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
  getNamedType,
  isEnumType,
  GraphQLSchema,
  OperationTypeNode,
  GraphQLSchemaConfig,
  GraphQLType,
  isType,
  GraphQLDirective,
  GraphQLField,
  GraphQLInputField,
  isIntrospectionType,
  GraphQLNamedType,
  isDirective as isDirectiveType,
  isScalarType,
  isUnionType,
  isInterfaceType,
  isObjectType,
  isInputObjectType as isInputType,
  isNonNullType,
  isLeafType,
  printSchema,
} from "graphql";

const OperationTypeNodes = [
  OperationTypeNode.QUERY,
  OperationTypeNode.MUTATION,
  OperationTypeNode.SUBSCRIPTION,
];

type ClassName = string & { _opaque: ClassName };

type ModuleName = string & { _opaque: ModuleName };
type RootTypes = { query?: string; mutation?: string; subscription?: string };
type ModuleOptions = LoadSchemaOptions & { rootTypes?: RootTypes };

type ModuleType = {
  module: ModuleName;
  options: ModuleOptions | undefined;
};

type LoadersType = {
  [className: ClassName]: ModuleName | ModuleType;
};

type DocumentLoaders = {
  loaders: readonly Loader[];
  loaderOptions: ModuleOptions;
};

type RelationType =
  | "objects"
  | "interfaces"
  | "unions"
  | "queries"
  | "mutations"
  | "subscriptions"
  | "inputs"
  | "directives"
  | "enums"
  | "scalars";

type RelationOf = {
  [relationType in RelationType]: readonly Maybe<GraphQLType>[];
};

type SchemaMap = {
  [relationType in RelationType]: Maybe<ObjMap<unknown>>;
};

export const loadSchema = async (
  schemaLocation: string,
  options: ModuleOptions
): Promise<GraphQLSchema> => {
  let rootTypes = undefined;

  if ("rootTypes" in options) {
    rootTypes = options.rootTypes;
    delete options["rootTypes"];
  }

  const schema = await asyncLoadSchema(
    schemaLocation,
    options as LoadSchemaOptions
  );

  if (typeof rootTypes === "undefined") {
    return schema;
  }

  const config: Readonly<GraphQLSchemaConfig> = {
    ...schema.toConfig(),
    query: schema.getType(rootTypes.query ?? "Query") as Maybe<
      GraphQLObjectType<any, any>
    >,
    mutation: schema.getType(rootTypes.mutation ?? "Mutation") as Maybe<
      GraphQLObjectType<any, any>
    >,
    subscription: schema.getType(
      rootTypes.subscription ?? "Subscription"
    ) as Maybe<GraphQLObjectType<any, any>>,
  };

  return new GraphQLSchema(config);
};

export const getDocumentLoaders = (
  loadersList: LoadersType
): DocumentLoaders => {
  const loaders: Loader[] = [];
  const loaderOptions: ModuleOptions = {} as ModuleOptions;

  Object.entries(loadersList).forEach(([className, graphqlDocumentLoader]) => {
    if (typeof graphqlDocumentLoader === "string") {
      const { [className]: Loader } = require(graphqlDocumentLoader);
      loaders.push(new Loader());
    } else {
      if (
        typeof graphqlDocumentLoader.module !== "string" ||
        graphqlDocumentLoader.module == null
      ) {
        throw new Error(
          `Wrong format for plugin loader "${className}", expected {module: String, options?: Object}`
        );
      }
      const { [className]: Loader } = require(graphqlDocumentLoader.module);
      loaders.push(new Loader());
      Object.assign(loaderOptions, graphqlDocumentLoader.options);
    }
  });

  if (loaders.length < 1) {
    throw new Error("No GraphQL document loaders available.");
  }
  return { loaders, loaderOptions };
};

export const getListDefaultValues = (
  type: GraphQLInputType,
  value?: Maybe<string | boolean | number | null>
): Maybe<string> => {
  const defaultValues = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getDefaultValue(type, defaultValue)
  );

  return `[${defaultValuesString.join(", ")}]`;
};

export const getDefaultValue = (
  type: GraphQLInputType,
  defaultValue?: Maybe<string | boolean | number | null>
): Maybe<string | boolean | number | null> => {
  if (typeof defaultValue === "undefined" || defaultValue === null) {
    return undefined;
  }

  if (isListType(type)) {
    return getListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(type, defaultValue);
};

export const formatDefaultValue = (
  type: GraphQLInputType,
  defaultValue?: Maybe<string | boolean | number | null>
): Maybe<string | boolean | number | null> => {
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
};

export const getTypeFromSchema = <T extends unknown>(
  schema: GraphQLSchema,
  type: T
): ObjMap<T> => {
  const operationKinds: string[] = [];
  OperationTypeNodes.forEach((operationTypeNode) => {
    const operationType = schema.getRootType(operationTypeNode);
    if (isType(operationType)) {
      operationKinds.push(operationType.name);
    }
  });

  const filterOperationFragmentRegExp =
    operationKinds.length > 0 ? [...operationKinds, ""].join("$|") : "";
  const excludeListRegExp = new RegExp(
    `^(?!${filterOperationFragmentRegExp}$).*$`
  );

  const typeMap = schema.getTypeMap();

  const filteredType = Object.keys(typeMap)
    .filter((key) => excludeListRegExp.test(key))
    .filter((key) => !isIntrospectionType(typeMap[key] as GraphQLNamedType))
    .filter((key) => (typeMap[key] instanceof (type as any)) ?? false);

  return keyValMap(
    filteredType,
    (key) => key,
    (key) => typeMap[key] as T
  );
};

export const hasDirective = (
  type: GraphQLNamedType,
  directiveName: string
): boolean => {
  if (type.astNode == null || !Array.isArray(type.astNode.directives)) {
    return false;
  }

  return (
    type.astNode.directives.findIndex(
      (directive) => directive.name.value === directiveName
    ) > -1
  );
};

export const getIntrospectionFieldsList = (
  queryType: Maybe<GraphQLObjectType>
): Maybe<ObjMap<GraphQLField<unknown, unknown, unknown>>> => {
  if (typeof queryType === "undefined" || queryType == null) {
    return undefined;
  }

  const typeMap = queryType.getFields();

  // return Object.keys(typeMap).reduce(
  //   (res, key) => ({ ...res, [key]: typeMap[key] }),
  //   {},
  // );
  return keyValMap(
    Object.keys(typeMap),
    (key) => key,
    (key) => typeMap[key] as GraphQLField<unknown, unknown, unknown>
  );
};

export const getFields = (
  type: GraphQLType
): Maybe<GraphQLField<unknown, unknown, unknown> | GraphQLInputField>[] => {
  if (!("getFields" in type)) {
    return [];
  }
  const fieldMap = type.getFields();
  return Object.keys(fieldMap).map((name) => fieldMap[name]);
};

export const getTypeName = (type: GraphQLNamedType, defaultName?: string): string => {
  return type?.name ?? type?.toString() ?? defaultName ?? "";
};

export const getSchemaMap = (schema: GraphQLSchema): SchemaMap => {
  return {
    queries: getIntrospectionFieldsList(
      schema.getQueryType && schema.getQueryType()
    ),
    mutations: getIntrospectionFieldsList(
      schema.getMutationType && schema.getMutationType()
    ),
    subscriptions: getIntrospectionFieldsList(
      schema.getSubscriptionType && schema.getSubscriptionType()
    ),
    directives: keyValMap(
      schema.getDirectives(),
      (entry) => entry.name,
      (entry) => entry
    ),
    objects: getTypeFromSchema(schema, GraphQLObjectType),
    unions: getTypeFromSchema(schema, GraphQLUnionType),
    interfaces: getTypeFromSchema(schema, GraphQLInterfaceType),
    enums: getTypeFromSchema(schema, GraphQLEnumType),
    inputs: getTypeFromSchema(schema, GraphQLInputObjectType),
    scalars: getTypeFromSchema(schema, GraphQLScalarType),
  };
};

const mapRelationOf = (
  relations: Partial<RelationOf>,
  schema: GraphQLSchema,
  callback: Function
): Partial<RelationOf> => {
  const schemaMap = getSchemaMap(schema);

  for (const relation of Object.keys(relations) as RelationType[]) {
    const entity: ObjMap<GraphQLType> = schemaMap[
      relation
    ] as ObjMap<GraphQLType>;
    if (typeof entity === "undefined") {
      continue;
    }

    let results: GraphQLType[] = [];
    for (const [relationName, relationType] of Object.entries(entity)) {
      results = callback(relationName, relationType, results);
    }
    relations[relation] = results;
  }

  return relations;
};

export const getRelationOfReturn = (
  type: GraphQLNamedType,
  schema: GraphQLSchema
) => {
  const relations: Partial<RelationOf> = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  return mapRelationOf(
    relations,
    schema,
    (
      relationName: string,
      relationType: GraphQLField<unknown, unknown, unknown>,
      results: GraphQLField<unknown, unknown, unknown>[]
    ) => {
      const subType = relationType.type as GraphQLNamedType;
      if (getNamedType(subType).name === type.name) {
        if (!results.find((r) => "name" in r && r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    }
  );
};

export const getRelationOfField = (
  type: GraphQLNamedType,
  schema: GraphQLSchema
) => {
  const relations: Partial<RelationOf> = {
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
    (
      relationName: string,
      relationType: GraphQLNamedType | GraphQLDirective,
      results: (GraphQLDirective | GraphQLNamedType)[]
    ) => {
      const fields = Object.assign(
        {},
        ("args" in relationType && relationType.args) ?? {},
        ("getFields" in relationType && relationType.getFields()) ?? {}
      );
      for (const fieldDef of Object.values(fields) as Maybe<
        GraphQLField<unknown, unknown>
      >[]) {
        if (fieldDef && getNamedType(fieldDef.type).name === type.name) {
          if (
            !results.find(
              (r) => r.toString() === relationName || r.name === relationName
            )
          ) {
            results.push(relationType);
          }
        }
      }
      return results;
    }
  );
};

export const getRelationOfUnion = (
  type: GraphQLNamedType,
  schema: GraphQLSchema
): Partial<RelationOf> => {
  const relations: Partial<RelationOf> = { unions: [] };

  return mapRelationOf(
    relations,
    schema,
    (
      relationName: string,
      relationType: GraphQLUnionType,
      results: GraphQLNamedType[]
    ) => {
      if (
        relationType
          .getTypes()
          .find((subType: GraphQLNamedType) => subType.name === type.name)
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    }
  );
};

export const getRelationOfInterface = (
  type: GraphQLNamedType,
  schema: GraphQLSchema
): Partial<RelationOf> => {
  const relations: Partial<RelationOf> = { objects: [], interfaces: [] };

  return mapRelationOf(
    relations,
    schema,
    (
      relationName: string,
      relationType: GraphQLInterfaceType,
      results: GraphQLNamedType[]
    ) => {
      if (
        relationType
          .getInterfaces()
          .find((subType: GraphQLInterfaceType) => subType.name === type.name)
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    }
  );
};

export const getRelationOfImplementation = (
  type: GraphQLNamedType,
  schema: GraphQLSchema
): Partial<RelationOf> => {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
};

export const isParametrizedField = (
  type: unknown
): type is GraphQLDirective | GraphQLField<unknown, unknown, unknown> => {
  if (!("args" in (type as any))) {
    return false;
  }

  return (type as any).args.length > 0;
};

export const isOperation = (
  type: unknown
): type is GraphQLObjectType<unknown, unknown> => {
  return "type" in (type as any);
};
