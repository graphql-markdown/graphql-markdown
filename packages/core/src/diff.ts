/**
 * Diff utilities for detecting schema changes between builds.
 *
 * @packageDocumentation
 */
import type {
  DiffMethodName,
  FunctionCheckSchemaChanges,
  GraphQLSchema,
  Maybe,
} from "@graphql-markdown/types";

import { log, LogLevel } from "@graphql-markdown/logger";
import { runtimeModuleSpecifier } from "@graphql-markdown/utils";

import { OPTIONAL_DEPENDENCY_RANGES } from "./optional-dependencies.ts";

/**
 * Module for detecting changes in GraphQL schemas.
 * This module provides functionality to compare GraphQL schemas and detect changes.
 *
 * @module diff
 * @category Core
 * @since 1.0.0
 */

/**
 * Determines if there are changes in the GraphQL schema by using a specified diff method and module.
 *
 * @param schema - The GraphQL schema to check for changes.
 * @param tmpDir - The temporary directory to store intermediate files during the diff process.
 * @param diffMethod - The name of the diff method to use. Must be a string or `null`.
 * @param diffModule - The module to import for performing the diff. Defaults to `@graphql-markdown/diff`.
 * @returns A promise that resolves to `true` if changes are detected or if the diff method/module is invalid, otherwise `false`.
 *
 * @example
 * ```typescript
 * import { hasChanges } from "./diff.ts";
 * import { buildSchema } from "graphql";
 *
 * const schema = buildSchema(`
 *   type Query {
 *     hello: String
 *   }
 * `);
 *
 * const changesDetected = await hasChanges(schema, "/tmp", "methodName");
 * console.log(changesDetected); // true or false
 * ```
 *
 * @example Using with a custom diff module
 * ```typescript
 * import { hasChanges } from "./diff.ts";
 *
 * const schema = getMySchema();
 * const result = await hasChanges(
 *   schema,
 *   "/tmp/schema-diff",
 *   "breaking",
 *   "./my-custom-diff-module"
 * );
 * ```
 *
 * @throws Will log a warning if the specified diff module cannot be found.
 * @see {@link DiffMethodName} for available diff methods
 * @see {@link FunctionCheckSchemaChanges} for the signature of the function imported from the diff module
 * @category Schema
 * @since 1.0.0
 */
export const hasChanges = async (
  schema: GraphQLSchema,
  tmpDir: string,
  diffMethod: Maybe<DiffMethodName>,
  diffModule: Maybe<string> = "@graphql-markdown/diff",
): Promise<boolean> => {
  if (typeof diffMethod !== "string" || typeof diffModule !== "string") {
    return true;
  }

  try {
    // Specifier is only known at runtime (optional, user-configurable diff module).
    // Resolved into a variable first: tsgo's CJS emit of `import(fn(x))` with
    // rewriteRelativeImportExtensions leaves `fn` unqualified (ReferenceError).
    const specifier = runtimeModuleSpecifier(
      diffModule,
      diffModule === "@graphql-markdown/diff"
        ? OPTIONAL_DEPENDENCY_RANGES[diffModule]
        : undefined,
    );
    const {
      checkSchemaChanges,
    }: { checkSchemaChanges: FunctionCheckSchemaChanges } = await import(
      specifier
    );
    return await checkSchemaChanges(schema, tmpDir, diffMethod);
  } catch {
    log(
      `Cannot find module '${diffModule}' from @graphql-markdown/core!`,
      LogLevel.warn,
    );
    return true;
  }
};
