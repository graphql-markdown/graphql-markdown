// generate.ts
import { rename } from "node:fs/promises";
import { basename, join } from "node:path";

import { useLogger } from "@nuxt/kit";

import { runGraphQLMarkdown } from "@graphql-markdown/cli";
import { DEFAULT_BASE_URL, LANDING_DOC_NAME } from "./constants";

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
 * @param userOptions - Configuration options for the generator:
 *   - schema: Path to the GraphQL schema file (required)
 *   - rootPath: Root directory for generated content (default: "./content")
 *   - baseURL: Base URL for the API reference (default: "api-reference")
 *   - printTypeOptions: Formatting options merged with defaults
 *   - decorators: Custom decorators for the schema output
 *   - formatter: Path/URL to custom formatter module (default: this package's formatter.mjs)
 *   - loaders: Custom schema loaders (default: GraphQLFileLoader)
 *   - homepage: Path to a markdown template rendered as the intro of the API
 *     reference, or `false` to disable it (default: GraphQL-Markdown's built-in
 *     homepage). Whatever its file name, it is stored as `generated.md`.
 * @returns A function that generates the documentation when called
 */
export const createGenerateDocs = (userOptions: {
  schema: string;
  rootPath?: string;
  baseURL?: string;
  printTypeOptions?: Partial<GraphQLMarkdownOptions["printTypeOptions"]>;
  decorators?: NonNullable<GraphQLMarkdownOptions["decorators"]>;
  formatter?: string;
  loaders?: NonNullable<GraphQLMarkdownOptions["loaders"]>;
  homepage?: string | false;
}): (() => Promise<void>) => {
  const {
    schema,
    rootPath = "./content",
    baseURL = DEFAULT_BASE_URL,
    printTypeOptions,
    decorators,
    formatter = new URL("./formatter.mjs", import.meta.url).href,
    loaders = DEFAULT_LOADERS,
    homepage,
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

    // Homepage template (or `false` to disable), only when set
    ...(homepage !== undefined && { homepage }),
  };

  return async () => {
    try {
      await runGraphQLMarkdown(options, {}, import.meta.resolve("consola"));

      // The theme finds the landing doc by name, so a custom template keeps
      // working whatever it's called: GraphQL-Markdown copies it under its own
      // file name, which is renamed (overwriting) to the expected one.
      if (
        typeof homepage === "string" &&
        basename(homepage) !== `${LANDING_DOC_NAME}.md`
      ) {
        try {
          await rename(
            join(rootPath, baseURL, basename(homepage)),
            join(rootPath, baseURL, `${LANDING_DOC_NAME}.md`),
          );
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
          logger.warn(`Homepage ${homepage} was not rendered; skipping rename`);
        }
      }

      logger.info(`GraphQL Markdown generated in ${rootPath}/${baseURL}/`);
    } catch (error) {
      logger.error("Generation failed");
      throw new Error("GraphQL Markdown generation failed", { cause: error });
    }
  };
};
