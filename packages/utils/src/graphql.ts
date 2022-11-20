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
  GraphQLFieldMap,
  GraphQLList,
  GraphQLEnumValue,
  GraphQLArgument,
} from "graphql";
import {
  loadSchema as asyncLoadSchema,
  LoadSchemaOptions,
} from "@graphql-tools/load";
import { Loader } from "@graphql-tools/utils";

import { Maybe } from "graphql/jsutils/Maybe";
import { keyValMap } from "graphql/jsutils/keyValMap";
import { ObjMap } from "graphql/jsutils/ObjMap";

export { printSchema, GraphQLSchema } from "graphql";

export const OperationTypeNodes: readonly OperationTypeNode[] = [
  OperationTypeNode.QUERY,
  OperationTypeNode.MUTATION,
  OperationTypeNode.SUBSCRIPTION,
];

type Scalar = string | boolean | number;

export type ClassName = string & { _opaque: ClassName };

export type ModuleName = string & { _opaque: ModuleName };

export type RootTypes = {
  query?: string;
  mutation?: string;
  subscription?: string;
};
export type ModuleOptions = LoadSchemaOptions & { rootTypes?: RootTypes };

export type ModuleType = {
  module: ModuleName;
  options: ModuleOptions | undefined;
};

export type LoadersType = {
  [className: ClassName]: ModuleName | ModuleType;
};

export type DocumentLoaders = {
  loaders: Loader[];
  loaderOptions: ModuleOptions;
};

export type RelationType =
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

export type RelationTypeList = readonly Maybe<GraphQLNamedType>[];

export type RelationOf = {
  [relationType in RelationType]: RelationTypeList;
};

export type SchemaMap = {
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

export const getDocumentLoaders = async (
  loadersList: LoadersType
): Promise<DocumentLoaders> => {
  const loaders: Loader[] = [];
  const loaderOptions: ModuleOptions = {} as ModuleOptions;

  await Promise.all(
    Object.keys(loadersList).map(async (className) => {
      const { loader, options } = await getLoader(
        className as ClassName,
        loadersList[className as ClassName] as ModuleName | ModuleType
      );
      loaders.push(loader);
      Object.assign(loaderOptions, options);
    })
  );

  if (loaders.length === 0) {
    throw new Error("No GraphQL document loaders available.");
  }

  return { loaders, loaderOptions };
};

export const getLoader = async (
  className: ClassName,
  graphqlDocumentLoader: ModuleName | ModuleType
): Promise<{
  loader: Loader;
  options: Maybe<ModuleOptions>;
}> => {
  const loaderPackage =
    typeof graphqlDocumentLoader === "string"
      ? graphqlDocumentLoader
      : graphqlDocumentLoader?.module;
  const { [className]: Loader } = await import(loaderPackage as string);
  return {
    loader: new Loader(),
    options:
      typeof graphqlDocumentLoader !== "string" &&
      "options" in graphqlDocumentLoader
        ? graphqlDocumentLoader.options
        : undefined,
  };
};

export const getListDefaultValues = (
  type: GraphQLInputType,
  value?: unknown
): Maybe<string> => {
  const defaultValues = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getDefaultValue({ type, defaultValue } as GraphQLInputField)
  );

  return `[${defaultValuesString.join(", ")}]`;
};

export const getDefaultValue = (field: GraphQLInputField): Maybe<Scalar> => {
  const { type, defaultValue } = field;

  if (typeof defaultValue === "undefined" || defaultValue === null) {
    return undefined;
  }

  if (isListType(type)) {
    return getListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(field);
};

export const formatDefaultValue = ({
  type,
  defaultValue,
}: GraphQLInputField): Maybe<Scalar> => {
  const value = defaultValue as Maybe<Scalar>;

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
      return `"${value}"`;
    default:
      return value;
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
    .filter((key) => typeMap[key] instanceof (type as any) ?? false);

  return keyValMap(
    filteredType,
    (key) => key,
    (key) => typeMap[key] as T
  );
};

export const hasDirective = (
  type: GraphQLNamedType | GraphQLEnumValue | GraphQLArgument,
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
): Maybe<ObjMap<GraphQLField<unknown, unknown>>> => {
  if (typeof queryType === "undefined" || queryType == null) {
    return undefined;
  }

  const typeMap: GraphQLFieldMap<any, any> = queryType.getFields();

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

export const getTypeName = (
  type:
    | GraphQLType
    | GraphQLField<unknown, unknown, unknown>
    | GraphQLList<GraphQLType>
    | GraphQLDirective
    | GraphQLInputField
    | GraphQLEnumValue,
  defaultName?: string
): string => {
  if (isListType(type)) {
    return defaultName ?? "";
  }
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
  const res = Object.assign(relations);

  for (const relation of Object.keys(relations) as RelationType[]) {
    if (typeof schemaMap[relation] === "undefined") {
      continue;
    }

    const entity = schemaMap[relation] as ObjMap<unknown>;
    let results = [] as any; // as ReturnType<typeof callback>;
    for (const [relationName, relationType] of Object.entries(entity)) {
      results = callback(relationName, relationType, results);
    }
    res[relation] = results;
  }
  return res;
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
    ): GraphQLField<unknown, unknown, unknown>[] => {
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
): Partial<RelationOf> => {
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
        "args" in relationType && relationType.args ? relationType.args : {},
        "getFields" in relationType && relationType.getFields()
          ? relationType.getFields()
          : {}
      );
      for (const fieldDef of Object.values(fields)) {
        if (
          typeof fieldDef !== "undefined" &&
          getNamedType(fieldDef.type as GraphQLType).name === type.name
        ) {
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
    ): GraphQLNamedType[] => {
      const interfaces = relationType.getInterfaces();
      if (
        typeof interfaces.find(
          (subType: GraphQLInterfaceType) => subType.name === type.name
        ) !== "undefined"
      ) {
        if (
          typeof results.find((r) => r.name === relationName) === "undefined"
        ) {
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
  if (typeof type !== "object" || !("args" in (type as any))) {
    return false;
  }

  return (type as any).args.length > 0;
};

export const isOperation = (
  type: unknown
): type is GraphQLObjectType<unknown, unknown> => {
  return typeof type === "object" && "type" in (type as any);
};
