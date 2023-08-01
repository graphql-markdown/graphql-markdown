import {
  ASTNode,
  DirectiveDefinitionNode,
  DirectiveNode,
  getDirectiveValues,
  getNamedType,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLString,
  GraphQLType,
  GraphQLUnionType,
  isDirective as isDirectiveType,
  isEnumType,
  isListType,
  isNamedType,
  ObjectTypeDefinitionNode,
  OperationTypeNode,
} from "graphql";
import {
  loadSchema as asyncLoadSchema,
  LoadSchemaOptions,
} from "@graphql-tools/load";

import type { BaseLoaderOptions } from "@graphql-tools/utils";

import { convertArrayToObject } from "./array";
import { hasMethod, isEmpty } from "./object";
import { Loader } from "graphql-config";

enum OperationTypeNodeName {
  query = OperationTypeNode.QUERY,
  mutation = OperationTypeNode.MUTATION,
  subscription = OperationTypeNode.SUBSCRIPTION,
}

export type LoaderOption = {
  [name: ClassName]: PackageName | PackageConfig;
};

export type PackageOptionsConfig = BaseLoaderOptions & RootTypes;

export type PackageConfig = {
  module: PackageName;
  options?: PackageOptionsConfig;
};

export type RootTypes = {
  query?: string;
  mutation?: string;
  subscription?: string;
};

export type PackageName = string & { _opaque: typeof PackageName };
declare const PackageName: unique symbol;

export type ClassName = string & { _opaque: typeof ClassName };
declare const ClassName: unique symbol;

export async function loadSchema(
  schemaLocation: string,
  options: LoadSchemaOptions & {
    rootTypes?: Partial<Record<OperationTypeNodeName, string>>;
  },
) {
  let rootTypes = undefined;

  if (typeof options !== "undefined" && "rootTypes" in options) {
    rootTypes = options.rootTypes;
    delete options["rootTypes"];
  }

  const schema = await asyncLoadSchema(schemaLocation, options);

  if (typeof rootTypes === "undefined") {
    return schema;
  }

  const config: Readonly<GraphQLSchemaConfig> = {
    ...schema.toConfig(),
    query: schema.getType(
      rootTypes?.query ?? OperationTypeNode.QUERY,
    ) as GraphQLObjectType<any, any>,
    mutation: schema.getType(
      rootTypes?.mutation ?? OperationTypeNode.MUTATION,
    ) as GraphQLObjectType<any, any>,
    subscription: schema.getType(
      rootTypes?.subscription ?? OperationTypeNode.SUBSCRIPTION,
    ) as GraphQLObjectType<any, any>,
  };

  return new GraphQLSchema(config);
}

export async function getDocumentLoaders(
  loadersList: LoaderOption,
): Promise<LoadSchemaOptions> {
  const loaders: Loader[] = [];
  const loaderOptions: PackageOptionsConfig = {};

  for (const [className, graphqlDocumentLoader] of Object.entries(
    loadersList,
  )) {
    if (typeof graphqlDocumentLoader === "string") {
      const { [className]: Loader } = await import(graphqlDocumentLoader);
      loaders.push(new Loader());
    } else {
      if (
        typeof graphqlDocumentLoader.module === "undefined" ||
        graphqlDocumentLoader.module == null
      ) {
        throw new Error(
          `Wrong format for plugin loader "${className}", it should be {module: String, options?: Object}`,
        );
      }
      const { [className]: Loader } = await import(
        graphqlDocumentLoader.module
      );
      loaders.push(new Loader());
      Object.assign(loaderOptions, graphqlDocumentLoader.options);
    }
  }

  if (loaders.length < 1) {
    throw new Error("No GraphQL document loaders available.");
  }
  return { ...loaderOptions, loaders };
}

export function getListDefaultValues(
  type: GraphQLType,
  value: unknown | unknown[],
): string {
  const defaultValues: unknown[] = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getDefaultValue({ type, defaultValue }),
  );

  return `[${defaultValuesString.join(", ")}]`;
}

export function getDefaultValue({
  type,
  defaultValue,
}: {
  type: GraphQLType;
  defaultValue: unknown;
}): unknown | string | undefined {
  if (typeof defaultValue === "undefined" || defaultValue === null) {
    return undefined;
  }

  if (isListType(type)) {
    return getListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(type, defaultValue);
}

function formatDefaultValue(
  type: GraphQLType,
  defaultValue: unknown,
): unknown | string | undefined {
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

export function getTypeFromSchema<T>(
  schema: GraphQLSchema | undefined | null,
  type: unknown,
): Record<string, T> | undefined {
  if (typeof schema === "undefined" || schema == null) {
    return undefined;
  }

  const operationKinds: string[] = [];
  Object.keys(OperationTypeNodeName).forEach((operationTypeNode) => {
    const operationType = schema.getRootType(
      operationTypeNode as OperationTypeNode,
    );
    if (typeof operationType !== "undefined" && operationType !== null) {
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
    .filter((key) => instanceOf(typeMap[key], type as any))
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
}

export function hasAstNode<T extends unknown>(
  node: T,
): node is T & Required<{ astNode: ObjectTypeDefinitionNode }> {
  return typeof (node as Record<string, any>)["astNode"] === "object";
}

function instanceOf<T>(obj: unknown, type: { new (): T }): obj is T {
  try {
    const expect = type.name;
    return typeof obj !== "object" || obj === null
      ? false
      : obj.constructor.name == expect;
  } catch (_) {
    return false;
  }
}

export function hasDirective(
  node: unknown,
  directives?: string[] | string,
): boolean {
  if (
    !hasAstNode(node) ||
    typeof directives === "undefined" ||
    !Array.isArray(node.astNode.directives)
  ) {
    return false;
  }

  const directiveList = Array.isArray(directives) ? directives : [directives]; // backward_compatibility

  return (
    node.astNode.directives.findIndex((directiveNode: DirectiveNode) =>
      directiveList.includes(directiveNode.name.value),
    ) > -1
  );
}

export function getDirective(
  node: unknown,
  directives?: string[] | string,
): GraphQLDirective[] {
  if (
    !hasAstNode(node) ||
    typeof directives === "undefined" ||
    !Array.isArray(node.astNode.directives)
  ) {
    return [];
  }

  const directiveList = Array.isArray(directives) ? directives : [directives]; // backward_compatibility

  return node.astNode.directives
    .filter((directiveNode: DirectiveDefinitionNode) =>
      directiveList.includes(directiveNode.name.value),
    )
    .map(
      (directiveNode: DirectiveDefinitionNode) =>
        new GraphQLDirective({
          name: directiveNode.name.value,
          description: directiveNode.description?.value,
          locations: [],
          extensions: undefined,
          astNode: directiveNode,
        }),
    );
}

export function getConstDirectiveMap(
  node: unknown,
  options?: Record<string, any> & { customDirectives?: Record<string, any> },
): Record<string, any> | undefined {
  if (
    typeof options === "undefined" ||
    typeof options.customDirectives === "undefined" ||
    isEmpty(options.customDirectives)
  ) {
    return undefined;
  }

  const constDirectives = getDirective(
    node,
    Object.keys(options.customDirectives),
  );
  if (constDirectives.length === 0) {
    return undefined;
  }

  return constDirectives.reduce(
    (directiveMap, constDirective) => {
      const name = constDirective.name;
      directiveMap[name] = options.customDirectives![name];
      return directiveMap;
    },
    {} as Record<string, any>,
  );
}

export function getTypeDirectiveArgValue(
  directiveType: GraphQLDirective,
  node: unknown,
  argName: string,
): any {
  const args = getTypeDirectiveValues(directiveType, node);

  if (typeof args === "undefined" || typeof args[argName] === "undefined") {
    throw new Error(`Directive argument '${argName}' not found!`);
  }

  return args[argName];
}

export function getTypeDirectiveValues(
  directiveType: GraphQLDirective,
  type: unknown,
): Record<string, any> | undefined {
  if (hasAstNode(type)) {
    return getDirectiveValues(
      directiveType,
      (<GraphQLNamedType>type).astNode as {
        readonly directives?: readonly DirectiveNode[] | undefined;
      },
    );
  }
  return getDirectiveValues(
    directiveType,
    (<ASTNode>type) as {
      readonly directives?: readonly DirectiveNode[] | undefined;
    },
  );
}

function __getFields(type: unknown, processor: Function, fallback: unknown) {
  if (!(typeof type !== "object" || type == null || "getFields" in type)) {
    return fallback;
  }

  const fieldMap = (<GraphQLObjectType>type).getFields();

  return processor(fieldMap);
}

export function getIntrospectionFieldsList(
  queryType?: unknown,
): Record<string, any> {
  return __getFields(
    queryType,
    (fieldMap: any) =>
      Object.keys(fieldMap).reduce(
        (res, key) => ({ ...res, [key]: fieldMap[key] }),
        {} as Record<string, any>,
      ),
    {},
  );
}

export function getFields(type: unknown) {
  return __getFields(
    type,
    (fieldMap: any) => Object.keys(fieldMap).map((name) => fieldMap[name]),
    [],
  );
}

export function getTypeName(type: unknown, defaultName: string = ""): string {
  if (typeof type !== "object" || type === null) {
    return defaultName;
  }

  switch (true) {
    case "name" in type:
      return (<any>type).name;
    case "toString" in type:
      return (<any>type).toString();
    default:
      return defaultName;
  }
}

export type SchemaEntities =
  | "queries"
  | "mutations"
  | "subscriptions"
  | "directives"
  | "objects"
  | "unions"
  | "interfaces"
  | "enums"
  | "inputs"
  | "scalars";

export type SchemaMap = Partial<{
  queries: Record<string, GraphQLField<any, any>>;
  mutations: Record<string, GraphQLField<any, any>>;
  subscriptions: Record<string, GraphQLField<any, any>>;
  directives: Record<string, GraphQLDirective>;
  objects: Record<string, GraphQLObjectType<any, any>> | undefined;
  unions: Record<string, GraphQLUnionType> | undefined;
  interfaces: Record<string, GraphQLInterfaceType> | undefined;
  enums: Record<string, GraphQLEnumType> | undefined;
  inputs: Record<string, GraphQLInputObjectType> | undefined;
  scalars: Record<string, GraphQLScalarType<unknown, unknown>> | undefined;
}>;

export function getSchemaMap(schema: GraphQLSchema): SchemaMap {
  return {
    queries: getIntrospectionFieldsList(schema.getQueryType() ?? undefined),
    mutations: getIntrospectionFieldsList(
      schema.getMutationType() ?? undefined,
    ),
    subscriptions: getIntrospectionFieldsList(
      schema.getSubscriptionType() ?? undefined,
    ),
    directives: convertArrayToObject<GraphQLDirective>(
      schema.getDirectives() as GraphQLDirective[],
    ),
    objects: getTypeFromSchema<GraphQLObjectType>(schema, GraphQLObjectType),
    unions: getTypeFromSchema<GraphQLUnionType>(schema, GraphQLUnionType),
    interfaces: getTypeFromSchema<GraphQLInterfaceType>(
      schema,
      GraphQLInterfaceType,
    ),
    enums: getTypeFromSchema<GraphQLEnumType>(schema, GraphQLEnumType),
    inputs: getTypeFromSchema<GraphQLInputObjectType>(
      schema,
      GraphQLInputObjectType,
    ),
    scalars: getTypeFromSchema<GraphQLScalarType>(schema, GraphQLScalarType),
  };
}

function mapRelationOf(
  relations: Record<string, any>,
  schema: GraphQLSchema,
  callback: Function,
): Record<string, any[]> {
  const schemaMap: Record<string, any> = getSchemaMap(schema);

  for (const relation of Object.keys(relations)) {
    const entity = schemaMap[relation];
    if (typeof entity === "undefined") {
      continue;
    }

    let results: any[] = [];
    for (const [relationName, relationType] of Object.entries(entity)) {
      results = callback(relationName, relationType, results);
    }
    relations[relation] = results;
  }

  return relations;
}

export function getRelationOfReturn(
  type: unknown,
  schema: GraphQLSchema,
): Record<string, any[]> {
  const relations: Record<string, any[]> = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  return mapRelationOf(
    relations,
    schema,
    (
      relationName: string,
      relationType: GraphQLField<any, any, any>,
      results: any[],
    ): any[] => {
      if (
        isNamedType(type) &&
        getNamedType(relationType.type as GraphQLType).name === type.name
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

export function getRelationOfField(
  type: unknown,
  schema: GraphQLSchema,
): Record<string, any[]> {
  const relations: Record<string, any[]> = {
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
      relationType:
        | GraphQLObjectType
        | GraphQLInterfaceType
        | GraphQLInputObjectType
        | GraphQLDirective,
      results: any[],
    ): any[] => {
      // directives are handled as flat array instead of map
      const key = isDirectiveType(relationType)
        ? relationType.name
        : relationName;

      const fields = Object.assign(
        {},
        (isParametrizedField(relationType) && relationType.args) ?? {},
        (!isDirectiveType(relationType) &&
          "getFields" in relationType &&
          relationType.getFields()) ??
          {},
      );
      for (const fieldDef of Object.values(fields) as any) {
        if (
          isNamedType(type) &&
          getNamedType(fieldDef.type as GraphQLType).name === type.name
        ) {
          if (!results.find((r) => r === key || r.name === key)) {
            results.push(relationType);
          }
        }
      }
      return results;
    },
  );
}

export function getRelationOfUnion(
  type: unknown,
  schema: GraphQLSchema,
): Record<string, any[]> {
  const relations = { unions: [] };

  return mapRelationOf(
    relations,
    schema,
    (
      relationName: string,
      relationType: GraphQLUnionType,
      results: any[],
    ): any[] => {
      if (
        isNamedType(type) &&
        relationType
          .getTypes()
          .find((subType: GraphQLNamedType) => subType.name === type.name)
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

export function getRelationOfInterface(
  type: unknown,
  schema: GraphQLSchema,
): Record<string, any[]> {
  const relations = { objects: [], interfaces: [] };

  return mapRelationOf(
    relations,
    schema,
    (
      relationName: string,
      relationType: GraphQLObjectType | GraphQLInterfaceType,
      results: any[],
    ): any[] => {
      if (
        isNamedType(type) &&
        relationType
          .getInterfaces()
          .find((subType: GraphQLNamedType) => subType.name === type.name)
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

export function getRelationOfImplementation(
  type: unknown,
  schema: GraphQLSchema,
): Record<string, any[]> {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
}

export function isParametrizedField(
  type: unknown,
): type is GraphQLField<any, any, any> {
  return (
    typeof type === "object" &&
    type !== null &&
    "args" in type &&
    (<GraphQLField<any, any, any>>type).args.length > 0
  );
}

export function isOperation(type: unknown): boolean {
  return typeof type === "object" && type !== null && "type" in type;
}

export function isDeprecated<T>(
  type: T,
): type is T & Partial<{ deprecationReason: string; isDeprecated: boolean }> {
  return (
    typeof type === "object" &&
    type !== null &&
    (("isDeprecated" in type && type.isDeprecated === true) ||
      ("deprecationReason" in type &&
        typeof type.deprecationReason === "string"))
  );
}

export {
  getDirectiveValues,
  getNamedType,
  isDirective as isDirectiveType,
  isEnumType,
  isInputObjectType as isInputType,
  isInterfaceType,
  isLeafType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
  printSchema,
  GraphQLNamedType,
  GraphQLSchema,
  isNamedType,
} from "graphql";

export type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";
