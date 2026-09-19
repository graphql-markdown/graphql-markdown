// generate.ts
import { useLogger } from "@nuxt/kit";

import { runGraphQLMarkdown } from "@graphql-markdown/cli";
import { DEFAULT_BASE_URL } from "./constants";

/**
 * `@graphql-markdown/types` is a transitive dependency, so the option shape is
 * taken from the CLI's own signature rather than imported by package name.
 */
type GraphQLMarkdownOptions = Parameters<typeof runGraphQLMarkdown>[0];

/** Default loaders: GraphQL file loader. */
const DEFAULT_LOADERS = {
  GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
} as GraphQLMarkdownOptions["loaders"];

/**
 * Factory for generating GraphQL Markdown documentation.
 *
 * Returns a function that, when called, generates the API reference documentation
 * from a GraphQL schema. The returned function can be invoked during a Nuxt module's
 * setup or from the consumer's own entry point (e.g., generate-docs.ts).
 *
 * @param userOptions - Configuration options for the generator
 * @param userOptions.schema - Path to the GraphQL schema file (required)
 * @param userOptions.rootPath - Root directory for generated content (default: "./content")
 * @param userOptions.baseURL - Base URL for the API reference (default: "api-reference")
 * @param userOptions.printTypeOptions - Formatting options merged with defaults
 * @param userOptions.decorators - Custom decorators for the schema output
 * @param userOptions.formatter - Path/URL to custom formatter module (default: this package's formatter.ts)
 * @param userOptions.loaders - Custom schema loaders (default: GraphQLFileLoader)
 * @returns A function that generates the documentation when called
 */
export function createGenerateDocs(userOptions: {
  schema: string;
  rootPath?: string;
  baseURL?: string;
  printTypeOptions?: Partial<GraphQLMarkdownOptions["printTypeOptions"]>;
  decorators?: GraphQLMarkdownOptions["decorators"];
  formatter?: string;
  loaders?: GraphQLMarkdownOptions["loaders"];
}): () => Promise<void> {
  const {
    schema,
    rootPath = "./content",
    baseURL = DEFAULT_BASE_URL,
    printTypeOptions,
    decorators,
    formatter = new URL("./formatter.ts", import.meta.url).href,
    loaders = DEFAULT_LOADERS,
  } = userOptions;

  const logger = useLogger("gqlmd-generate");

  // Merge printTypeOptions with the layer's own defaults
  const mergedPrintTypeOptions: GraphQLMarkdownOptions["printTypeOptions"] = {
    parentTypePrefix: false,
    typeBadges: true,
    ...printTypeOptions,
  };

  const options: GraphQLMarkdownOptions = {
    // Core paths
    schema,
    rootPath,
    baseURL,
    linkRoot: "/",
    formatter,

    // Formatting fallback options to bypass the internal configuration setup
    loaders,

    // Layout extraction flags with defaults merged with user options
    printTypeOptions: mergedPrintTypeOptions,

    // Custom decorators, if provided
    ...(decorators && { decorators }),
  };

  return async () => {
    try {
      await runGraphQLMarkdown(options, {}, import.meta.resolve("consola"));

      logger.info(`GraphQL Markdown generated in ${rootPath}/${baseURL}/`);
    } catch (error) {
      logger.error("Generation failed");
      throw new Error("GraphQL Markdown generation failed", { cause: error });
    }
  };
}
