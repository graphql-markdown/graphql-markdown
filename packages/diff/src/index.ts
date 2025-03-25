import { join } from "node:path";
import { createHash } from "node:crypto";

import { loadSchema } from "@graphql-tools/load";
import { diff, type Change } from "@graphql-inspector/core";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";

import type {
  DiffMethodName,
  FunctionCheckSchemaChanges,
  GraphQLSchema,
} from "@graphql-markdown/types";

import { printSchema } from "@graphql-markdown/graphql";

import { fileExists, readFile, saveFile } from "@graphql-markdown/utils";

export const SCHEMA_HASH_FILE = ".schema" as const;
export const SCHEMA_REF = "schema.graphql" as const;
/**
 * Comparison methods used to determine if a schema has changed.
 */
export enum CompareMethod {
  /** Compare schemas by diffing the content */
  DIFF = "SCHEMA-DIFF",
  /** Compare schemas by comparing hash values */
  HASH = "SCHEMA-HASH",
  /** Force regeneration regardless of changes */
  FORCE = "FORCE",
  /** Skip comparison and assume no changes */
  NONE = "NONE",
}

/**
 * Generates a SHA-256 hash for a GraphQL schema.
 *
 * @param schema - The GraphQL schema to generate a hash for
 * @returns A SHA-256 hash string representing the schema
 */
export const getSchemaHash = (schema: GraphQLSchema): string => {
  const printedSchema = printSchema(schema);
  return createHash("sha256").update(printedSchema).digest("hex");
};

/**
 * Compares a new schema against an existing schema file and returns the differences.
 *
 * @param schemaNew - The new GraphQL schema to compare
 * @param schemaOldLocation - File path to the old schema
 * @returns A promise resolving to an array of schema changes
 */
export const getDiff = async (
  schemaNew: GraphQLSchema,
  schemaOldLocation: string,
): Promise<Change[]> => {
  const schemaOld = await loadSchema(schemaOldLocation, {
    loaders: [new GraphQLFileLoader()],
  });
  return diff(schemaOld, schemaNew);
};

/**
 * Checks if a schema has changed compared to a previous version.
 * Uses either diff or hash-based comparison methods based on the method parameter.
 *
 * @param schema - The current GraphQL schema
 * @param outputDir - Directory where schema or hash files will be saved
 * @param method - Comparison method to use (defaults to DIFF)
 * @returns A promise resolving to a boolean indicating whether the schema has changed
 */
export const checkSchemaChanges: FunctionCheckSchemaChanges = async (
  schema: GraphQLSchema,
  outputDir: string,
  method: DiffMethodName = CompareMethod.DIFF as DiffMethodName,
): Promise<boolean> => {
  if (method.valueOf() === CompareMethod.DIFF.valueOf()) {
    const schemaRef = join(outputDir, SCHEMA_REF);
    if (await fileExists(schemaRef)) {
      const schemaDiff = await getDiff(schema, schemaRef);
      return schemaDiff.length > 0;
    }
    const schemaPrint = printSchema(schema);
    await saveFile(schemaRef, schemaPrint);
  }

  if (method.valueOf() === CompareMethod.HASH.valueOf()) {
    const hashFile = join(outputDir, SCHEMA_HASH_FILE);
    const hashSchema = getSchemaHash(schema);
    if (await fileExists(hashFile)) {
      const hash = await readFile(hashFile, { encoding: "utf8", flag: "r" });
      return hashSchema !== hash;
    }
    await saveFile(hashFile, hashSchema);
  }

  return true;
};
