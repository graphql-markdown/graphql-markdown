// generate.ts
import { rename } from "node:fs/promises";
import { basename, join } from "node:path";

import { useLogger } from "@nuxt/kit";

import { runGraphQLMarkdown } from "@graphql-markdown/cli";
import type { RunContext } from "@graphql-markdown/cli";
import {
  DEFAULT_BASE_URL,
  DEFAULT_ROOT_PATH,
  LANDING_DOC_NAME,
} from "./constants.ts";

/**
 * `@graphql-markdown/types` is a transitive dependency, so the option shape is
 * taken from the CLI's own signature rather than imported by package name.
 */
type GraphQLMarkdownOptions = Parameters<typeof runGraphQLMarkdown>[0];

/** Options the theme sets itself; users cannot override them via `createGenerateDocs`. */
type ThemeControlledKeys = "linkRoot";

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
 *   - rootPath: Root directory for generated content (default: "./content"; GraphQL Config overrides the default)
 *   - baseURL: Base URL for the API reference (default: "api-reference")
 *   - printTypeOptions: Formatting options merged with defaults
 *   - decorators: Custom decorators for the schema output
 *   - formatter: Path/URL to custom formatter module (default: this package's formatter.mjs)
 *   - loaders: Custom schema loaders (default: GraphQLFileLoader)
 *   - homepage: Path to a markdown template rendered as the intro of the API
 *     reference, or `false` to disable it (default: GraphQL-Markdown's built-in
 *     homepage). Whatever its file name, it is stored as `generated.md`.
 *   - any other GraphQL-Markdown option (for example `telemetry`, `pretty`, `force`) is forwarded as-is; `linkRoot` is set by the theme
 * Theme defaults only apply when neither these options nor GraphQL Config set them.
 *
 * @returns A function that generates the documentation when called
 */
export const createGenerateDocs = (
  userOptions: Omit<
    Partial<GraphQLMarkdownOptions>,
    | ThemeControlledKeys
    | "baseURL"
    | "decorators"
    | "formatter"
    | "homepage"
    | "loaders"
    | "printTypeOptions"
    | "rootPath"
    | "schema"
  > & {
    schema: string;
    rootPath?: string;
    baseURL?: string;
    printTypeOptions?: Partial<GraphQLMarkdownOptions["printTypeOptions"]>;
    decorators?: NonNullable<GraphQLMarkdownOptions["decorators"]>;
    formatter?: string;
    loaders?: NonNullable<GraphQLMarkdownOptions["loaders"]>;
    homepage?: string | false;
  },
): (() => Promise<void>) => {
  const logger = useLogger("gqlmd-generate");

  // The theme's own defaults: applied by GraphQL-Markdown below GraphQL Config
  // and the options passed here, so neither of them is overridden.
  const defaults: NonNullable<RunContext["defaults"]> = {
    rootPath: DEFAULT_ROOT_PATH,
    baseURL: DEFAULT_BASE_URL,
    formatter: new URL("./formatter.mjs", import.meta.url).href,
    loaders: DEFAULT_LOADERS,
    printTypeOptions: { parentTypePrefix: false, typeBadges: true },
  };

  // Undefined values are skipped by GraphQL-Markdown's config merge, so user
  // options are forwarded as-is; only the theme-controlled `linkRoot` wins.
  const options: GraphQLMarkdownOptions = { ...userOptions, linkRoot: "/" };

  return async () => {
    try {
      // The resolved config, so a rootPath/baseURL set in GraphQL Config is used
      const { outputDir } = await runGraphQLMarkdown(
        options,
        {},
        import.meta.resolve("consola"),
        { trigger: "nuxt", defaults },
      );

      // The theme finds the landing doc by name, so a custom template keeps
      // working whatever it's called: GraphQL-Markdown copies it under its own
      // file name, which is renamed (overwriting) to the expected one.
      if (
        typeof userOptions.homepage === "string" &&
        basename(userOptions.homepage) !== `${LANDING_DOC_NAME}.md`
      ) {
        try {
          await rename(
            join(outputDir, basename(userOptions.homepage)),
            join(outputDir, `${LANDING_DOC_NAME}.md`),
          );
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
          logger.warn(
            `Homepage ${userOptions.homepage} was not rendered; skipping rename`,
          );
        }
      }

      logger.info(`GraphQL Markdown generated in ${outputDir}`);
    } catch (error) {
      logger.error("Generation failed");
      throw new Error("GraphQL Markdown generation failed", { cause: error });
    }
  };
};
