import * as crypto from "crypto";
import * as fs from "fs-extra";
import * as path from "path";

import { diff } from "@graphql-inspector/core";

import { loadSchema, GraphQLFileLoader, printSchema } from ".";

const SCHEMA_HASH_FILE = ".schema";
const SCHEMA_REF = "schema.graphql";
const COMPARE_METHODS = {
  COMPARE_WITH_SCHEMA_DIFF: "SCHEMA-DIFF",
  COMPARE_WITH_SCHEMA_HASH: "SCHEMA-HASH",
};

export function getSchemaHash(schema: any) {
  const printedSchema = printSchema(schema, { commentDescriptions: true });
  const sum = crypto.createHash("sha256");
  sum.update(printedSchema);
  return sum.digest("hex");
}

export async function getDiff(schemaNew: any, schemaOld: any) {
  const schemaRef = await loadSchema(schemaOld, {
    loaders: [new GraphQLFileLoader()],
  });
  return diff(schemaRef, schemaNew);
}

export async function checkSchemaChanges(
  schema: any,
  outputDir: string,
  method = COMPARE_METHODS.COMPARE_WITH_SCHEMA_DIFF,
) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  let hasDiff = true;
  const schemaRef = path.join(outputDir, SCHEMA_REF);

  if (method === COMPARE_METHODS.COMPARE_WITH_SCHEMA_DIFF) {
    if (fs.existsSync(schemaRef)) {
      const diff = await getDiff(schema, schemaRef);
      hasDiff = diff.length > 0;
    }
  }

  if (method === COMPARE_METHODS.COMPARE_WITH_SCHEMA_HASH) {
    if (fs.existsSync(hashFile)) {
      const hash = fs.readFileSync(hashFile, "utf-8");
      hasDiff = hashSchema != hash;
    }
  }
  return hasDiff;
}

export async function saveSchemaFile(schema: any, outputDir: string) {
  const schemaFile = path.join(outputDir, SCHEMA_REF);
  const schemaPrint = printSchema(schema);
  await fs.outputFile(schemaFile, schemaPrint);
}

export async function saveSchemaHash(schema: any, outputDir: string) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  await fs.outputFile(hashFile, hashSchema);
}
