/**
 * Library for GraphQL schema loading and `loaders` config processing.
 *
 * @packageDocumentation
 */

import type { GraphQLObjectType } from "graphql";
import { GraphQLSchema, OperationTypeNode } from "graphql";
import { loadSchema as asyncLoadSchema } from "@graphql-tools/load";
import type { Loader } from "graphql-config";

import type {
  GraphQLSchemaConfig,
  LoaderOption,
  LoadSchemaOptions,
  Maybe,
  PackageOptionsConfig,
} from "@graphql-markdown/types";

export { GraphQLSchema } from "graphql";

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

/**
 *
 */
export const loadSchema = async (
  schemaLocation: string,
  options: LoadSchemaOptions & {
    /**
     * @param rootTypes - optional `rootTypes` schema override
     * @see [Custom root types](https://graphql-markdown.dev/docs/advanced/custom-root-types)
     */
    rootTypes?: Partial<Record<OperationTypeNode, string>>;
  },
): Promise<GraphQLSchema> => {
  let rootTypes = undefined;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (options !== null && "rootTypes" in options) {
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
};
/**
 * Asynchronously returns a valid loaders list for {@link loadSchema} based on the plugin config.
 * Import each loader package, and instantiate a loader object.
 *
 * @param loadersList - the list of loaders defined in the plugin config.
 *
 * @returns a list of loader objects.
 *
 * @throws an `Error` if no loader has been loaded, or if an error occurred while importing loaders.
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

/**
 *
 */
export const getDocumentLoaders = async (
  loadersList: Maybe<LoaderOption>,
): Promise<Maybe<LoadSchemaOptions>> => {
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
      if (
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        graphqlDocumentLoader.module === undefined ||
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        graphqlDocumentLoader.module === null
      ) {
        throw new TypeError(
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
};
