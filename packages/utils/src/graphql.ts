import {
  getDirectiveValues,
  getNamedType,
  GraphQLBoolean,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLString,
  GraphQLUnionType,
  isDirective as isDirectiveType,
  isEnumType,
  isInterfaceType,
  isListType,
  isNamedType,
  isObjectType,
  isUnionType,
  OperationTypeNode,
} from "graphql";
import { loadSchema as asyncLoadSchema } from "@graphql-tools/load";
import type { Loader } from "graphql-config";

import type {
  ASTNode,
  CustomDirectiveMap,
  DirectiveDefinitionNode,
  DirectiveName,
  DirectiveNode,
  GraphQLField,
  GraphQLFieldMap,
  GraphQLInputFieldMap,
  GraphQLNamedType,
  GraphQLSchemaConfig,
  GraphQLType,
  IGetRelation,
  LoaderOption,
  LoadSchemaOptions,
  Maybe,
  ObjectTypeDefinitionNode,
  PackageOptionsConfig,
  PrintTypeOptions,
  SchemaEntity,
  SchemaMap,
} from "@graphql-markdown/types";

import { convertArrayToMapObject } from "./array";
import { isEmpty } from "./object";

export enum OperationTypeNodeName {
  query = OperationTypeNode.QUERY,
  mutation = OperationTypeNode.MUTATION,
  subscription = OperationTypeNode.SUBSCRIPTION,
}

export async function loadSchema(
  schemaLocation: string,
  options: LoadSchemaOptions & {
    rootTypes?: Partial<Record<OperationTypeNodeName, string>>;
  },
): Promise<GraphQLSchema> {
  let rootTypes = undefined;

  if (typeof options !== "undefined" && "rootTypes" in options) {
    rootTypes = options.rootTypes;
    delete options.rootTypes;
  }

  const schema = await asyncLoadSchema(schemaLocation, options);

  if (!rootTypes) {
    return schema;
  }

  const config: Readonly<GraphQLSchemaConfig> = {
    ...schema.toConfig(),
    query: schema.getType(
      rootTypes.query ?? OperationTypeNode.QUERY,
    ) as GraphQLObjectType<unknown, unknown>,
    mutation: schema.getType(
      rootTypes.mutation ?? OperationTypeNode.MUTATION,
    ) as GraphQLObjectType<unknown, unknown>,
    subscription: schema.getType(
      rootTypes.subscription ?? OperationTypeNode.SUBSCRIPTION,
    ) as GraphQLObjectType<unknown, unknown>,
  };

  return new GraphQLSchema(config);
}

export async function getDocumentLoaders(
  loadersList: Maybe<LoaderOption>,
): Promise<Maybe<LoadSchemaOptions>> {
  const loaders: Loader[] = [];
  const loaderOptions: PackageOptionsConfig = {};

  if (typeof loadersList !== "object" || loadersList === null) {
    return undefined;
  }

  for (const [className, graphqlDocumentLoader] of Object.entries(
    loadersList,
  )) {
    if (typeof graphqlDocumentLoader === "string") {
      const { [className]: Loader } = await import(graphqlDocumentLoader);
      loaders.push(new Loader());
    } else {
      if (typeof graphqlDocumentLoader.module === "undefined") {
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

export function getListDefaultValues<T>(
  type: Maybe<GraphQLType>,
  value: T,
): string {
  if (typeof type === "undefined" || type === null) {
    return "";
  }

  const defaultValues: T[] = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getDefaultValue({ type, defaultValue }),
  );

  return `[${defaultValuesString.join(", ")}]`;
}

export function getDefaultValue<T>({
  type,
  defaultValue,
}: {
  type: Maybe<GraphQLType>;
  defaultValue: T;
}): Maybe<T | string> {
  if (
    typeof type === "undefined" ||
    type === null ||
    typeof defaultValue === "undefined" ||
    defaultValue === null
  ) {
    return undefined;
  }

  if (isListType(type)) {
    return getListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(type, defaultValue);
}

function formatDefaultValue<T>(
  type: Maybe<GraphQLType>,
  defaultValue: T,
): T | string {
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
  schema: Maybe<GraphQLSchema>,
  type: unknown,
): Maybe<Record<string, T>> {
  if (!schema) {
    return undefined;
  }

  const operationKinds: string[] = [];
  Object.keys(OperationTypeNodeName).forEach((operationTypeNode) => {
    const operationType = schema.getRootType(
      operationTypeNode as OperationTypeNode,
    );
    if (operationType) {
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
): node is Required<{ astNode: ObjectTypeDefinitionNode }> & T {
  return typeof (node as Record<string, unknown>)["astNode"] === "object";
}

function instanceOf<T>(obj: unknown, type: new () => T): obj is T {
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
  directives: Maybe<string[] | string>,
): boolean {
  if (
    !hasAstNode(node) ||
    !directives ||
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
  directives: Maybe<string[] | string>,
): GraphQLDirective[] {
  if (
    !hasAstNode(node) ||
    !directives ||
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
  options?: Partial<PrintTypeOptions>,
): Maybe<CustomDirectiveMap> {
  if (!options?.customDirectives || isEmpty(options.customDirectives)) {
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
    directiveMap[name] = options.customDirectives![name];
    return directiveMap;
  }, {} as CustomDirectiveMap);
}

export function getTypeDirectiveArgValue(
  directive: GraphQLDirective,
  node: unknown,
  argName: string,
): Maybe<Record<string, unknown>> {
  const args = getTypeDirectiveValues(directive, node);

  if (!args || !args[argName]) {
    throw new Error(`Directive argument '${argName}' not found!`);
  }

  return args[argName] as Maybe<Record<string, unknown>>;
}

export function getTypeDirectiveValues(
  directive: GraphQLDirective,
  type: unknown,
): Maybe<Record<string, unknown>> {
  if (hasAstNode(type)) {
    return getDirectiveValues(
      directive,
      (type as GraphQLNamedType).astNode as {
        readonly directives?: readonly DirectiveNode[];
      },
    );
  }
  return getDirectiveValues(
    directive,
    type as ASTNode as {
      readonly directives?: readonly DirectiveNode[];
    },
  );
}

function __getFields<T, V>(
  type: T,
  processor?: (fieldMap: Record<string, unknown>) => V,
  fallback?: V,
): GraphQLFieldMap<unknown, unknown> | GraphQLInputFieldMap | V {
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
    return processor(fieldMap);
  }

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
    return String(type.name);
  }

  if ("toString" in type && typeof type.toString === "function") {
    return String(type);
  }

  return defaultName;
}

export function getSchemaMap(schema: Maybe<GraphQLSchema>): SchemaMap {
  return {
    ["queries" as SchemaEntity]: getIntrospectionFieldsList(
      schema?.getQueryType() ?? undefined,
    ),
    ["mutations" as SchemaEntity]: getIntrospectionFieldsList(
      schema?.getMutationType() ?? undefined,
    ),
    ["subscriptions" as SchemaEntity]: getIntrospectionFieldsList(
      schema?.getSubscriptionType() ?? undefined,
    ),
    ["directives" as SchemaEntity]: convertArrayToMapObject<GraphQLDirective>(
      schema?.getDirectives() as GraphQLDirective[],
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
  type: unknown,
  relations: Record<string, T[]>,
  schema: Maybe<GraphQLSchema>,
  callback: (
    type: unknown,
    relationName: string,
    relationType: unknown,
    results: T[],
  ) => T[],
): Record<string, T[]> {
  const schemaMap: SchemaMap = getSchemaMap(schema);

  for (const relation of Object.keys(relations)) {
    const entity: Maybe<Record<string, T>> = schemaMap[
      relation as SchemaEntity
    ] as Maybe<Record<string, T>>;
    if (!entity) {
      continue;
    }

    let results: T[] = [];
    for (const [relationName, relationType] of Object.entries<T>(entity)) {
      results = callback(type, relationName, relationType, results);
    }
    relations[relation] = results;
  }

  return relations;
}

export const getRelationOfReturn: IGetRelation<Record<string, unknown[]>> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, unknown[]> => {
  const relations: Partial<Record<SchemaEntity, unknown[]>> = {
    queries: [],
    mutations: [],
    subscriptions: [],
  };

  return mapRelationOf(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
      if (
        typeof relationType === "object" &&
        relationType !== null &&
        isNamedType(type) &&
        "type" in relationType &&
        getNamedType(relationType.type as Maybe<GraphQLType>)?.name ===
          type.name
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
};

export const getRelationOfField: IGetRelation<
  Record<string, (GraphQLDirective | GraphQLNamedType)[]>
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, (GraphQLDirective | GraphQLNamedType)[]> => {
  const relations: Partial<
    Record<SchemaEntity, (GraphQLDirective | GraphQLNamedType)[]>
  > = {
    queries: [],
    mutations: [],
    subscriptions: [],
    objects: [],
    interfaces: [],
    inputs: [],
    directives: [],
  };

  return mapRelationOf<GraphQLDirective | GraphQLNamedType>(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
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
          getNamedType(fieldDef.type as Maybe<GraphQLType>)?.name === type.name
        ) {
          if (
            !results.find(
              (r) =>
                r.toString() === key ||
                (typeof r === "object" && "name" in r && r.name === key),
            )
          ) {
            results.push(relationType as GraphQLDirective | GraphQLNamedType);
          }
        }
      }
      return results;
    },
  );
};

export const getRelationOfUnion: IGetRelation<
  Record<string, GraphQLUnionType[]>
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, GraphQLUnionType[]> => {
  const relations: Partial<Record<SchemaEntity, GraphQLUnionType[]>> = {
    unions: [],
  };

  return mapRelationOf<GraphQLUnionType>(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
      if (
        isNamedType(type) &&
        isUnionType(relationType) &&
        relationType.getTypes().find((subType) => subType.name === type.name)
      ) {
        if (
          !results.find(
            (r) =>
              typeof r === "object" && "name" in r && r.name === relationName,
          )
        ) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
};

export const getRelationOfInterface: IGetRelation<
  Record<string, (GraphQLInterfaceType | GraphQLObjectType)[]>
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<string, (GraphQLInterfaceType | GraphQLObjectType)[]> => {
  const relations: Partial<
    Record<SchemaEntity, (GraphQLInterfaceType | GraphQLObjectType)[]>
  > = {
    objects: [],
    interfaces: [],
  };

  return mapRelationOf<GraphQLInterfaceType | GraphQLObjectType>(
    type,
    relations,
    schema,
    (type, relationName, relationType, results) => {
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
              typeof r === "object" && "name" in r && r.name === relationName,
          )
        ) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
};

export const getRelationOfImplementation: IGetRelation<
  Record<
    string,
    (GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType)[]
  >
> = (
  type: unknown,
  schema: Maybe<GraphQLSchema>,
): Record<
  string,
  (GraphQLInterfaceType | GraphQLObjectType | GraphQLUnionType)[]
> => {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
};

export function isParametrizedField(
  type: unknown,
): type is GraphQLField<unknown, unknown, unknown> {
  return (
    typeof type === "object" &&
    type !== null &&
    "args" in type &&
    (type as GraphQLField<unknown, unknown, unknown>).args.length > 0
  );
}

export function isOperation(type: unknown): boolean {
  return typeof type === "object" && type !== null && "type" in type;
}

export function isDeprecated<T>(
  type: T,
): type is Partial<{ deprecationReason: string; isDeprecated: boolean }> & T {
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
  isNamedType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
  printSchema,
} from "graphql";
