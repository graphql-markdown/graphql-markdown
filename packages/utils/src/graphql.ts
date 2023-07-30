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
  OperationTypeNode
} from "graphql";
import { loadSchema as asyncLoadSchema, LoadSchemaOptions } from "@graphql-tools/load";

import { convertArrayToObject } from "./array";
import { hasMethod, hasProperty, isEmpty } from "./object";

enum OperationTypeNodeName {
  query = OperationTypeNode.QUERY,
  mutation = OperationTypeNode.MUTATION,
  subscription = OperationTypeNode.SUBSCRIPTION,
};

export async function loadSchema(schemaLocation: string, options: LoadSchemaOptions & { rootTypes?: Partial<Record<OperationTypeNodeName, string>> }) {
  let rootTypes = undefined;

  if (hasProperty(options, "rootTypes")) {
    rootTypes = options.rootTypes;
    delete options["rootTypes"];
  }

  const schema = await asyncLoadSchema(schemaLocation, options);

  if (typeof rootTypes === "undefined") {
    return schema;
  }

  const config: Readonly<GraphQLSchemaConfig> = {
    ...schema.toConfig(),
    query: schema.getType(rootTypes?.query ?? OperationTypeNode.QUERY) as GraphQLObjectType<any, any>,
    mutation: schema.getType(rootTypes?.mutation ?? OperationTypeNode.MUTATION) as GraphQLObjectType<any, any>,
    subscription: schema.getType(rootTypes?.subscription ?? OperationTypeNode.SUBSCRIPTION) as GraphQLObjectType<any, any>,
  };

  return new GraphQLSchema(config);
}

export function getDocumentLoaders(loadersList: Record<string, any>): Record<string, any> {
  const loaders: unknown[] = [];
  const loaderOptions: Record<string, any> = {};

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
          `Wrong format for plugin loader "${className}", it should be {module: String, options?: Object}`,
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
  return { ...loaderOptions, loaders };
}

export function getListDefaultValues(type: GraphQLType, value: unknown | unknown[]): string {
  const defaultValues: unknown[] = Array.isArray(value) ? value : [value];

  const defaultValuesString = defaultValues.map((defaultValue) =>
    getDefaultValue({ type, defaultValue }),
  );

  return `[${defaultValuesString.join(", ")}]`;
}

export function getDefaultValue({ type, defaultValue }: {type: GraphQLType, defaultValue: unknown}): unknown | string | undefined {
  if (typeof defaultValue === "undefined" || defaultValue === null) {
    return undefined;
  }

  if (isListType(type)) {
    return getListDefaultValues(getNamedType(type), defaultValue);
  }

  return formatDefaultValue(type, defaultValue);
}

function formatDefaultValue(type: GraphQLType, defaultValue: unknown): unknown | string | undefined {
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

export function getTypeFromSchema<T>(schema: GraphQLSchema | undefined | null, type: any): Record<string, T> | undefined {
  if (typeof schema === "undefined" || schema == null) {
    return undefined;
  }

  const operationKinds: string[] = [];
  Object.keys(OperationTypeNodeName).forEach((operationTypeNode) => {
    const operationType = schema.getRootType(operationTypeNode as OperationTypeNode);
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
    .filter((key) => instanceOf(typeMap[key], type))
    .reduce((res, key) => ({ ...res, [key]: typeMap[key] }), {});
}

export function hasAstNode<T extends Record<any, any>>(node: T): node is T & Required<{ astNode: ObjectTypeDefinitionNode }> {
  return typeof node["astNode"] === "object";
}

function instanceOf<T extends Object>(obj: unknown, type: { new(): T }): obj is T {
  try {
    const expect = type.name;
    return (obj as Object).constructor.name == expect 
  } catch (_) {
    return false;
  }
}

export function hasDirective(node: GraphQLType, directives?: string[] | string): boolean {
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

export function getDirective(node: GraphQLType, directives?: string[] | string): GraphQLDirective[] {
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
  .map((directiveNode: DirectiveDefinitionNode) => 
    new GraphQLDirective ({
      name: directiveNode.name.value,
      description: directiveNode.description?.value,
      locations: [],
      extensions: undefined,
      astNode: directiveNode
    })
  );
}

export function getConstDirectiveMap(
  node: GraphQLNamedType,
  options: Record<string, any> & { customDirectives: Record<string, any> | undefined },
): Record<string,any> | undefined {
  if (typeof options.customDirectives === "undefined" || isEmpty(options.customDirectives)) {
    return undefined;
  }

  const constDirectives = getDirective(node, Object.keys(options.customDirectives));
  if (constDirectives.length === 0) {
    return undefined;
  }

  return constDirectives.reduce((directiveMap, constDirective) => {
    const name = constDirective.name;
    directiveMap[name] = options.customDirectives![name];
    return directiveMap;
  }, {} as Record<string,any>);
}

export function getTypeDirectiveArgValue(directiveType: GraphQLDirective, astNode: ASTNode | GraphQLNamedType, argName: string): any {
  const args = getTypeDirectiveValues(directiveType, astNode);

  if (typeof args === "undefined" || typeof args[argName] === "undefined") {
    throw new Error(`Directive argument '${argName}' not found!`);
  }

  return args[argName];
}

export function getTypeDirectiveValues(directiveType: GraphQLDirective, type: ASTNode | GraphQLNamedType): Record<string,any> | undefined {
  if (hasAstNode(type)) {
    return getDirectiveValues(directiveType, (<GraphQLNamedType>type).astNode as {
      readonly directives?: readonly DirectiveNode[] | undefined;
  });
  }
  return getDirectiveValues(directiveType, <ASTNode>type as {
    readonly directives?: readonly DirectiveNode[] | undefined;
});
}

export function getIntrospectionFieldsList(queryType?: unknown): Record<string, any> {
  if (
    typeof queryType === "undefined" ||
    queryType == null ||
    hasMethod(queryType, "getFields") === false
  ) {
    return {};
  }

  const typeMap = (<GraphQLObjectType>queryType).getFields();

  return Object.keys(typeMap).reduce(
    (res, key) => ({ ...res, [key]: typeMap[key] }),
    {} as Record<string, any>,
  );
}

export function getFields(type: unknown) {
  if (!hasMethod(type, "getFields")) {
    return [];
  }
  const fieldMap = (<GraphQLObjectType>type).getFields();
  return Object.keys(fieldMap).map((name) => fieldMap[name]);
}

export function getTypeName(type: unknown, defaultName: string = ""): string {
  switch (true) {
    case hasProperty(type, "name"):
      return (<any>type).name;
    case hasMethod(type, "toString"):
      return  (<any>type).toString();
    case typeof type === "undefined":
    case type == null:
    default:
      return defaultName;
  }
}

export function getSchemaMap(schema: GraphQLSchema) {
  return {
    queries: getIntrospectionFieldsList(
      schema.getQueryType() ?? undefined
    ),
    mutations: getIntrospectionFieldsList(
      schema.getMutationType() ?? undefined
    ),
    subscriptions: getIntrospectionFieldsList(
      schema.getSubscriptionType() ?? undefined,
    ),
    directives: convertArrayToObject<GraphQLDirective>(schema.getDirectives() as GraphQLDirective[]),
    objects: getTypeFromSchema<GraphQLObjectType>(schema, GraphQLObjectType),
    unions: getTypeFromSchema<GraphQLUnionType>(schema, GraphQLUnionType),
    interfaces: getTypeFromSchema<GraphQLInterfaceType>(schema, GraphQLInterfaceType),
    enums: getTypeFromSchema<GraphQLEnumType>(schema, GraphQLEnumType),
    inputs: getTypeFromSchema<GraphQLInputObjectType>(schema, GraphQLInputObjectType),
    scalars: getTypeFromSchema<GraphQLScalarType>(schema, GraphQLScalarType),
  };
}

function mapRelationOf(relations: Record<string, any>, schema: GraphQLSchema, callback: Function): Record<string, any[]> {
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

export function getRelationOfReturn(type: unknown, schema: GraphQLSchema): Record<string, any[]> {
  const relations: Record<string, any[]> = { queries: [], mutations: [], subscriptions: [] };

  return mapRelationOf(
    relations,
    schema,
    (relationName: string, relationType: GraphQLField<any, any, any>, results: any[]): any[] => {
      if (isNamedType(type) && getNamedType(relationType.type as GraphQLType).name === type.name) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

export function getRelationOfField(type: unknown, schema: GraphQLSchema): Record<string, any[]> {
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
    (relationName: string, relationType: GraphQLObjectType | GraphQLInterfaceType | GraphQLInputObjectType | GraphQLDirective, results: any[]): any[] => {
      // directives are handled as flat array instead of map
      const key = isDirectiveType(relationType)
        ? relationType.name
        : relationName;

      const fields = Object.assign(
        {},
        (isParametrizedField(relationType) && relationType.args) ?? {},
        (!isDirectiveType(relationType) && 'getFields' in relationType && relationType.getFields() ) ?? {},
      );
      for (const fieldDef of Object.values(fields) as any) {
        if (isNamedType(type) && getNamedType(fieldDef.type as GraphQLType).name === type.name) {
          if (!results.find((r) => r === key || r.name === key)) {
            results.push(relationType);
          }
        }
      }
      return results;
    },
  );
}

export function getRelationOfUnion(type: unknown, schema: GraphQLSchema): Record<string, any[]> {
  const relations = { unions: [] };

  return mapRelationOf(
    relations,
    schema,
    (relationName: string, relationType: GraphQLUnionType, results: any[]): any[] => {
      if (isNamedType(type) && relationType.getTypes().find((subType: GraphQLNamedType) => subType.name === type.name)) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

export function getRelationOfInterface(type: unknown, schema: GraphQLSchema): Record<string, any[]> {
  const relations = { objects: [], interfaces: [] };

  return mapRelationOf(
    relations,
    schema,
    (relationName: string, relationType: GraphQLObjectType | GraphQLInterfaceType, results: any[]): any[] => {
      if (
        isNamedType(type) && relationType.getInterfaces().find((subType: GraphQLNamedType) => subType.name === type.name)
      ) {
        if (!results.find((r) => r.name === relationName)) {
          results.push(relationType);
        }
      }
      return results;
    },
  );
}

export function getRelationOfImplementation(type: unknown, schema: GraphQLSchema): Record<string, any[]> {
  return {
    ...getRelationOfInterface(type, schema),
    ...getRelationOfUnion(type, schema),
  };
}

export function isParametrizedField(type: unknown): type is GraphQLField<any, any, any> {
  return hasProperty(type, "args") && (<GraphQLField<any, any, any>>type).args.length > 0;
}

export function isOperation(type: unknown): boolean {
  return hasProperty(type, "type");
}

export function isDeprecated(type: unknown) {
  return (
    (hasProperty(type, "isDeprecated") && (<any>type).isDeprecated === true) ||
    (hasProperty(type, "deprecationReason") &&
      typeof (<any>type).deprecationReason === "string")
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
} from "graphql";
