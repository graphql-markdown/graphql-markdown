import path from "node:path";
import crypto from "node:crypto";

import { Change, diff } from "@graphql-inspector/core";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { GraphQLSchema } from "graphql/type/schema";

import { printSchema, loadSchema } from "@graphql-markdown/utils/graphql";
import { fileExists, readFile, saveFile } from "@graphql-markdown/utils/fs";

export const SCHEMA_HASH_FILE: string = ".schema";
export const SCHEMA_REF: string = "schema.graphql";
export enum COMPARE_METHOD {
  DIFF = "SCHEMA-DIFF",
  HASH = "SCHEMA-HASH",
  FORCE = "FORCE",
  NONE = "NONE",
}

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

export const checkSchemaChanges = async (
  schema: GraphQLSchema,
  outputDir: string,
  method = COMPARE_METHOD.DIFF
): Promise<boolean> => {
  if (method === COMPARE_METHOD.DIFF) {
    const schemaRef: string = path.join(outputDir, SCHEMA_REF);
    const hasSchemaRefFile: boolean = await fileExists(schemaRef);
    if (hasSchemaRefFile) {
      const schemaDiff: Change[] = await getDiff(schema, schemaRef);
      return schemaDiff.length > 0;
    }
    const schemaPrint: string = printSchema(schema);
    await saveFile(schemaRef, schemaPrint);
  }

  if (method === COMPARE_METHOD.HASH) {
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
  }

  return true;
};
