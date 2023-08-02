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
  GraphQLFieldMap,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputFieldMap,
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
  isInterfaceType,
  isListType,
  isNamedType,
  isObjectType,
  isUnionType,
  ObjectTypeDefinitionNode,
  OperationTypeNode,
} from "graphql";
import {
  loadSchema as asyncLoadSchema,
  LoadSchemaOptions,
} from "@graphql-tools/load";

import type { BaseLoaderOptions } from "@graphql-tools/utils";

import { convertArrayToObject } from "./array";
import { isEmpty } from "./object";
import { Loader } from "graphql-config";
import {
  CustomDirective,
  CustomDirectiveMap,
  CustomDirectiveMapItem,
  DirectiveName,
} from "./directive";

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
    ) as GraphQLObjectType<unknown, unknown>,
    mutation: schema.getType(
      rootTypes?.mutation ?? OperationTypeNode.MUTATION,
    ) as GraphQLObjectType<unknown, unknown>,
    subscription: schema.getType(
      rootTypes?.subscription ?? OperationTypeNode.SUBSCRIPTION,
    ) as GraphQLObjectType<unknown, unknown>,
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
    .filter((key) => instanceOf(typeMap[key], type as never))
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
}

export function hasAstNode<T>(
  node: T,
): node is T & Required<{ astNode: ObjectTypeDefinitionNode }> {
  return typeof (node as Record<string, unknown>)["astNode"] === "object";
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
  options?: Record<string, unknown> & { customDirectives?: CustomDirective },
): CustomDirectiveMap | undefined {
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

  return constDirectives.reduce((directiveMap, constDirective) => {
    const name = constDirective.name as DirectiveName;
    directiveMap[name] = options.customDirectives![
      name
    ] as CustomDirectiveMapItem;
    return directiveMap;
  }, {} as CustomDirectiveMap);
}

export function getTypeDirectiveArgValue(
  directiveType: GraphQLDirective,
  node: unknown,
  argName: string,
): unknown {
  const args = getTypeDirectiveValues(directiveType, node);

  if (typeof args === "undefined" || typeof args[argName] === "undefined") {
    throw new Error(`Directive argument '${argName}' not found!`);
  }

  return args[argName];
}

export function getTypeDirectiveValues(
  directiveType: GraphQLDirective,
  type: unknown,
): Record<string, unknown> | undefined {
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

function __getFields<T, V>(
  type: T,
  processor?: (fieldMap: Record<string, unknown>) => V,
  fallback?: V,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): V | GraphQLInputFieldMap | GraphQLFieldMap<any, any> {
  if (
    !(
      typeof type === "object" &&
      type !== null &&
      "getFields" in type &&
      isNamedType(type)
    )
  ) {
    return fallback as V;
  }

  const fieldMap = type.getFields();

  if (typeof processor !== "undefined") {
    return processor(fieldMap) as V;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return fieldMap;
}

export function getIntrospectionFieldsList(
  queryType?: unknown,
): Record<string, unknown> {
  return __getFields(
    queryType,
    (fieldMap) =>
      Object.keys(fieldMap).reduce(
        (res, key) => ({ ...res, [key]: fieldMap[key] }),
        {},
      ),
    {},
  ) as Record<string, unknown>;
}

export function getFields(type: unknown): unknown[] {
  return __getFields(
    type,
    (fieldMap) => {
      const res: unknown[] = [];
      Object.keys(fieldMap).forEach((name: string) => res.push(fieldMap[name]));
      return res;
    },
    [],
  ) as unknown[];
}

export function getTypeName(type: unknown, defaultName: string = ""): string {
  if (!(typeof type === "object" && type !== null)) {
    return defaultName;
  }

  if ("name" in type) {
    return type.name as string;
  }

  if ("toString" in type) {
    return type.toString();
  }

  return defaultName;
}

export type SchemaEntity =
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
  queries: Record<string, GraphQLField<unknown, unknown>>;
  mutations: Record<string, GraphQLField<unknown, unknown>>;
  subscriptions: Record<string, GraphQLField<unknown, unknown>>;
  directives: Record<string, GraphQLDirective>;
  objects: Record<string, GraphQLObjectType<unknown, unknown>> | undefined;
  unions: Record<string, GraphQLUnionType> | undefined;
  interfaces: Record<string, GraphQLInterfaceType> | undefined;
  enums: Record<string, GraphQLEnumType> | undefined;
  inputs: Record<string, GraphQLInputObjectType> | undefined;
  scalars: Record<string, GraphQLScalarType<unknown, unknown>> | undefined;
}>;

export function getSchemaMap(schema: GraphQLSchema): SchemaMap {
  return {
    ["queries" as SchemaEntity]: getIntrospectionFieldsList(
      schema.getQueryType() ?? undefined,
    ),
    ["mutations" as SchemaEntity]: getIntrospectionFieldsList(
      schema.getMutationType() ?? undefined,
    ),
    ["subscriptions" as SchemaEntity]: getIntrospectionFieldsList(
      schema.getSubscriptionType() ?? undefined,
    ),
    ["directives" as SchemaEntity]: convertArrayToObject<GraphQLDirective>(
      schema.getDirectives() as GraphQLDirective[],
    ),
    ["objects" as SchemaEntity]: getTypeFromSchema<GraphQLObjectType>(
      schema,
      GraphQLObjectType,
    ),
    ["unions" as SchemaEntity]: getTypeFromSchema<GraphQLUnionType>(
      schema,
      GraphQLUnionType,
    ),
    ["interfaces" as SchemaEntity]: getTypeFromSchema<GraphQLInterfaceType>(
      schema,
      GraphQLInterfaceType,
    ),
    ["enums" as SchemaEntity]: getTypeFromSchema<GraphQLEnumType>(
      schema,
      GraphQLEnumType,
    ),
    ["inputs" as SchemaEntity]: getTypeFromSchema<GraphQLInputObjectType>(
      schema,
      GraphQLInputObjectType,
    ),
    ["scalars" as SchemaEntity]: getTypeFromSchema<GraphQLScalarType>(
      schema,
      GraphQLScalarType,
    ),
  };
}

function mapRelationOf<T>(
  relations: Record<string, T[]>,
  schema: GraphQLSchema,
  callback: (relationName: string, relationType: unknown, results: T[]) => T[],
): Record<string, T[]> {
  const schemaMap: SchemaMap = getSchemaMap(schema);

  for (const relation of Object.keys(relations)) {
    const entity = schemaMap[relation as SchemaEntity];
    if (typeof entity !== "string") {
      continue;
    }

    let results: T[] = [];
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
): Record<string, unknown[]> {
  const relations: Partial<Record<SchemaEntity, unknown[]>> = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  return mapRelationOf(
    relations,
    schema,
    (relationName, relationType, results) => {
      if (
        typeof relationType === "object" &&
        relationType !== null &&
        "type" in relationType &&
        isNamedType(type) &&
        getNamedType(relationType.type as GraphQLType).name === type.name
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" &&
              r !== null &&
              "name" in r &&
              r.name === relationName,
          )
        ) {
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
): Record<string, (GraphQLNamedType | GraphQLDirective)[]> {
  const relations: Partial<
    Record<SchemaEntity, (GraphQLNamedType | GraphQLDirective)[]>
  > = {
    queries: [],
    mutations: [],
    subscriptions: [],
    objects: [],
    interfaces: [],
    inputs: [],
    directives: [],
  };

  return mapRelationOf<GraphQLNamedType | GraphQLDirective>(
    relations,
    schema,
    (relationName, relationType, results) => {
      // directives are handled as flat array instead of map
      const key = isDirectiveType(relationType)
        ? relationType.name
        : relationName;

      const paramFieldArgs = isParametrizedField(relationType)
        ? relationType.args
        : {};
      const fieldMap = __getFields(relationType, undefined, {});

      const fields = Object.assign({}, paramFieldArgs, fieldMap);
      for (const fieldDef of Object.values(fields)) {
        if (
          isNamedType(type) &&
          getNamedType(fieldDef.type as GraphQLType).name === type.name
        ) {
          if (
            !results.find(
              (r) =>
                r.toString() === key ||
                (typeof r === "object" &&
                  r !== null &&
                  "name" in r &&
                  r.name === key),
            )
          ) {
            results.push(relationType as GraphQLNamedType | GraphQLDirective);
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
): Record<string, GraphQLUnionType[]> {
  const relations: Partial<Record<SchemaEntity, GraphQLUnionType[]>> = {
    unions: [],
  };

  return mapRelationOf<GraphQLUnionType>(
    relations,
    schema,
    (relationName, relationType, results) => {
      if (
        isNamedType(type) &&
        isUnionType(relationType) &&
        relationType.getTypes().find((subType) => subType.name === type.name)
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" &&
              r !== null &&
              "name" in r &&
              r.name === relationName,
          )
        ) {
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
): Record<string, (GraphQLObjectType | GraphQLInterfaceType)[]> {
  const relations: Partial<
    Record<SchemaEntity, (GraphQLObjectType | GraphQLInterfaceType)[]>
  > = {
    objects: [],
    interfaces: [],
  };

  return mapRelationOf<GraphQLObjectType | GraphQLInterfaceType>(
    relations,
    schema,
    (relationName, relationType, results) => {
      if (
        isNamedType(type) &&
        (isObjectType(relationType) || isInterfaceType(relationType)) &&
        relationType
          .getInterfaces()
          .find((subType) => subType.name === type.name)
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" &&
              r !== null &&
              "name" in r &&
              r.name === relationName,
          )
        ) {
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
): Record<
  string,
  (GraphQLObjectType | GraphQLInterfaceType | GraphQLUnionType)[]
> {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
}

export function isParametrizedField(
  type: unknown,
): type is GraphQLField<unknown, unknown, unknown> {
  return (
    typeof type === "object" &&
    type !== null &&
    "args" in type &&
    (<GraphQLField<unknown, unknown, unknown>>type).args.length > 0
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
  GraphQLArgument,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLType,
  GraphQLUnionType,
  isDirective as isDirectiveType,
  isEnumType,
  isInputObjectType as isInputType,
  isInterfaceType,
  isLeafType,
  isListType,
  isNamedType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
  printSchema,
} from "graphql";

export type { UnnormalizedTypeDefPointer } from "@graphql-tools/load";
