/**
 * Schema comparison module for GraphQL Markdown.
 * Provides utilities to compare GraphQL schemas and detect changes.
 * @module
 */

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

/** File name for storing schema hash */
export const SCHEMA_HASH_FILE = ".schema" as const;
/** File name for storing schema reference */
export const SCHEMA_REF = "schema.graphql" as const;

/**
 * Schema comparison methods
 */
export enum CompareMethod {
  /** Compare schemas using GraphQL Inspector diff */
  DIFF = "SCHEMA-DIFF",
  /** Compare schemas using hash comparison */
  HASH = "SCHEMA-HASH",
  /** Force update without comparison */
  FORCE = "FORCE",
  /** Skip comparison */
  NONE = "NONE",
}

/**
 * Generates a SHA-256 hash of the schema
 * @param schema - The GraphQL schema to hash
 * @returns The hex encoded hash of the schema
 */
export const getSchemaHash = (schema: GraphQLSchema): string => {
  const printedSchema = printSchema(schema);
  return createHash("sha256").update(printedSchema).digest("hex");
};

/**
 * Compares a new schema with an existing schema file
 * @param schemaNew - The new schema to compare
 * @param schemaOldLocation - File path to the old schema
 * @returns Array of detected changes between schemas
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
 * Checks for changes between schemas using specified comparison method
 * @param schema - The schema to check
 * @param outputDir - Output directory path
 * @param method - Comparison method to use
 * @returns True if changes detected or first run
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
