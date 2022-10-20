const path = require("path");
const crypto = require("crypto");

const { printSchema } = require("graphql");
const { loadSchema } = require("@graphql-tools/load");
const { diff } = require("@graphql-inspector/core");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

const { fileExists, readFile, saveFile } = require("./utils/helpers/fs");

const SCHEMA_HASH_FILE = ".schema";
const SCHEMA_REF = "schema.graphql";
const COMPARE_METHOD = {
  DIFF: "SCHEMA-DIFF",
  HASH: "SCHEMA-HASH",
  FORCE: "FORCE",
};

function getSchemaHash(schema) {
  let printedSchema = printSchema(schema, { commentDescriptions: true });
  let sum = crypto.createHash("sha256").update(printedSchema);
  return sum.digest("hex");
}

async function getDiff(schemaNew, schemaOldLocation) {
  const schemaOld = await loadSchema(schemaOldLocation, {
    loaders: [new GraphQLFileLoader()],
  });
  return diff(schemaOld, schemaNew);
}

async function checkSchemaChanges(
  schema,
  outputDir,
  method = COMPARE_METHOD.DIFF,
) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  const schemaRef = path.join(outputDir, SCHEMA_REF);

  if (method === COMPARE_METHOD.DIFF) {
    if (await fileExists(schemaRef)) {
      const schemaDiff = await getDiff(schema, schemaRef);
      return schemaDiff.length > 0;
    }
    await saveSchemaFile(schema, outputDir);
  }

  if (method === COMPARE_METHOD.HASH) {
    if (await fileExists(hashFile)) {
      const hash = await readFile(hashFile, { encoding: "utf8", flag: "r" });
      return hashSchema != hash;
    }
    await saveSchemaHash(schema, outputDir);
  }

  return true;
}

async function saveSchemaFile(schema, outputDir) {
  const schemaFile = path.join(outputDir, SCHEMA_REF);
  const schemaPrint = printSchema(schema);
  await saveFile(schemaFile, schemaPrint);
}

async function saveSchemaHash(schema, outputDir) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  await saveFile(hashFile, hashSchema);
}

module.exports = {
  checkSchemaChanges,
  COMPARE_METHOD,
  SCHEMA_HASH_FILE,
  SCHEMA_REF,
};
