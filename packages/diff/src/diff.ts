import path from "node:path";
import crypto from "node:crypto";

import { Change, diff } from "@graphql-inspector/core";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { GraphQLSchema } from "graphql/type/schema";

import { printSchema, loadSchema } from "@graphql-markdown/utils/graphql";
import { fileExists, readFile, saveFile } from "@graphql-markdown/utils/fs";

export const SCHEMA_HASH_FILE: string = ".schema";
export const SCHEMA_REF: string = "schema.graphql";

export type DiffMethods = {
  [key: string]: DiffMethodType;
};

export type CheckSchemaChanges = (
  schema: GraphQLSchema,
  outputDir: string,
  method: string
) => Promise<boolean>;

export type DiffMethodType = {
  toString: () => string;
  diff: (...args: any) => Promise<boolean>;
};

export type GetDiffMethod = (
  method: string | undefined
) => DiffMethodType | undefined;

export const getDiffMethod: GetDiffMethod = (
  method: string | undefined
): DiffMethodType | undefined => {
  return Object.values(COMPARE_METHOD).find(
    (m) => m.toString() === (method as string)
  );
};

const getSchemaHash = (schema: GraphQLSchema): string => {
  const printedSchema: string = printSchema(schema);
  return crypto.createHash("sha256").update(printedSchema).digest("hex");
};

const getDiff = async (
  schemaNew: GraphQLSchema,
  schemaOldLocation: string
): Promise<Change[]> => {
  const schemaOld: GraphQLSchema = await loadSchema(schemaOldLocation, {
    loaders: [new GraphQLFileLoader()],
  });
  return diff(schemaOld, schemaNew);
};

const checkSchemaHash = async (
  schema: GraphQLSchema,
  outputDir: string
): Promise<boolean> => {
  const hashFile: string = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema: string = getSchemaHash(schema);
  const hasHashFile: boolean = await fileExists(hashFile);
  if (hasHashFile) {
    const hash: string = await readFile(hashFile, {
      encoding: "utf8",
      flag: "r",
    });
    return hashSchema.localeCompare(hash) === 0;
  }
  await saveFile(hashFile, hashSchema);
  return true;
};

const checkSchemaDiff = async (
  schema: GraphQLSchema,
  outputDir: string
): Promise<boolean> => {
  const schemaRef: string = path.join(outputDir, SCHEMA_REF);
  const hasSchemaRefFile: boolean = await fileExists(schemaRef);
  if (hasSchemaRefFile) {
    const schemaDiff: Change[] = await getDiff(schema, schemaRef);
    return schemaDiff.length > 0;
  }
  const schemaPrint: string = printSchema(schema);
  await saveFile(schemaRef, schemaPrint);
  return true;
};

export const checkSchemaChanges = async (
  method: string,
  schema: GraphQLSchema,
  outputDir: string
): Promise<boolean> => {
  const diffMethod = getDiffMethod(method);

  if (typeof diffMethod === "undefined") {
    return true;
  }

  return diffMethod.diff(schema, outputDir);
};

export const COMPARE_METHOD: DiffMethods = {
  DIFF: {
    toString: () => "SCHEMA-DIFF",
    diff: checkSchemaDiff,
  },
  HASH: {
    toString: () => "SCHEMA-HASH",
    diff: checkSchemaHash,
  },
};
