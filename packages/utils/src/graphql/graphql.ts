import {
  getDirectiveValues,
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLUnionType,
  isNamedType,
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
  LoaderOption,
  LoadSchemaOptions,
  Maybe,
  ObjectTypeDefinitionNode,
  PackageOptionsConfig,
  PrintTypeOptions,
  SchemaEntity,
  SchemaMap,
} from "@graphql-markdown/types";

import { convertArrayToMapObject } from "../array";
import { isEmpty } from "../object";

/**
 * Wrapper method for `@graphql-tools/load.loadSchema` to load asynchronously a GraphQL Schema from a source.
 * The wrapper will load the schema using the loader declared in `options`.
 * If `rootTypes` is set in the options, then the schema root types will be overridden to generate custom GraphQL schema.
 *
 * @param schemaLocation - the schema location pointer matching the loader.
 * @param options - the schema `loaders`, and optional `rootTypes` override.
 *
 * @returns a GraphQL schema.
 *
 * @example
 * ```js
 * import { loadSchema } from "@graphql-markdown/utils/graphql"
 *
 * const schema = await loadSchema("schema.graphql", {
 *   loaders: [new GraphQLFileLoader()],
 *   rootTypes: { query: "Root", subscription: "" },
 * });
 * ```
 */
export async function loadSchema(
  schemaLocation: string,
  options: LoadSchemaOptions & {
    rootTypes?: Partial<Record<OperationTypeNode, string>>;
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

/**
 * Asynchronously returns a valid loaders list for {@link loadSchema} based on the plugin config.
 * Import each loader package, and instantiate a loader object.
 *
 * @param loadersList - the list of loaders defined in the plugin config.
 *
 * @returns a list of loader objects.
 *
 * @throws {@link Error} if no loader loader, or an error occurred when importing a loader package.
 *
 * @example
 * ```js
 * import { getDocumentLoaders, loadSchema } from "@graphql-markdown/utils/graphql"
 *
 * const loaderList = {
 *   GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
 * };
 *
 * const loaders = await getDocumentLoaders(loaderList);
 *
 * const schema = await loadSchema("schema.graphql", {
 *   loaders,
 *   rootTypes: { query: "Root", subscription: "" },
 * });
 * ```
 */
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

/**
 * Returns a map of GraphQL named types from a schema for a defined GraphQL type.
 * When parsing the entities, internal GraphQL entities (starting with `__`) are excluded.
 *
 * @see {@link getSchemaMap}
 *
 * @internal
 *
 * @param schema - a GraphQL schema.
 * @param type - a GraphQL type, eg `GraphQLObjectType`.
 *
 * @returns a map of GraphQL named types for the matching GraphQL type, or undefined if no match.
 *
 */
export function getTypeFromSchema<T>(
  schema: Maybe<GraphQLSchema>,
  type: unknown,
): Maybe<Record<string, T>> {
  if (!schema) {
    return undefined;
  }

  const operationKinds: string[] = [];
  Object.values(OperationTypeNode).forEach((operationTypeNode) => {
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

/**
 * Type guard for checking if a GraphQL named type is of type.
 *
 * @internal
 *
 * @param obj - a GraphQL named type from the GraphQL schema.
 * @param type - a GraphQL type, eg `GraphQLObjectType`.
 *
 * @returns `true` if types matches, else `false`.
 *
 */
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

/**
 * Checks if a schema entity as a directive belonging to a defined set.
 *
 * @param entity - a GraphQL schema entity.
 * @param directives - a directive name or a list of directive names.
 *
 * @returns `true` if the entity has at least one directive matching, else `false`.
 *
 */
export function hasDirective(
  entity: unknown,
  directives: Maybe<string[] | string>,
): boolean {
  if (
    !hasAstNode(entity) ||
    !directives ||
    !Array.isArray(entity.astNode.directives)
  ) {
    return false;
  }

  const directiveList = Array.isArray(directives) ? directives : [directives]; // backward_compatibility

  return (
    entity.astNode.directives.findIndex((directiveNode: DirectiveNode) =>
      directiveList.includes(directiveNode.name.value),
    ) > -1
  );
}

/**
 * Returns a schema entity's list of directives matching a defined set.
 *
 * @param entity - a GraphQL schema entity.
 * @param directives - a directive name or a list of directive names.
 *
 * @returns a list of GraphQL directives matching the set, else `false`.
 *
 */
export function getDirective(
  entity: unknown,
  directives: Maybe<string[] | string>,
): GraphQLDirective[] {
  if (
    !hasAstNode(entity) ||
    !directives ||
    !Array.isArray(entity.astNode.directives)
  ) {
    return [];
  }

  const directiveList = Array.isArray(directives) ? directives : [directives]; // backward_compatibility

  return entity.astNode.directives
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

/**
 *
 */
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

/**
 *
 * @param directive
 * @param type
 * @returns
 */
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

/**
 *
 * @internal
 *
 * @param type
 * @param processor
 * @param fallback
 *
 * @returns
 */
export function __getFields<T, V>(
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
