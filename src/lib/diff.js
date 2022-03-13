const path = require("path");
const crypto = require("crypto");

const { fileExists, readFile, saveFile } = require("../utils/helpers/fs");

const { loadSchema, getDocumentLoaders, printSchema } = require("./graphql");
const { diff } = require("@graphql-inspector/core");

const SCHEMA_HASH_FILE = ".schema";
const SCHEMA_REF = "schema.graphql";
const COMPARE_METHOD = {
  DIFF: "SCHEMA-DIFF",
  HASH: "SCHEMA-HASH",
  FORCE: "FORCE",
};

const defaultLoaders = {
  GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
};

function getSchemaHash(schema) {
  let printedSchema = printSchema(schema, { commentDescriptions: true });
  let sum = crypto.createHash("sha256").update(printedSchema);
  return sum.digest("hex");
}

async function getDiff(schemaNew, schemaOld) {
  return Promise.resolve(
    loadSchema(schemaOld, {
      loaders: getDocumentLoaders(defaultLoaders).loaders,
    }),
  ).then((schemaRef) => diff(schemaRef, schemaNew));
}

async function checkSchemaChanges(
  schema,
  outputDir,
  method = COMPARE_METHOD.DIFF,
) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  let hasDiff = true;
  const schemaRef = path.join(outputDir, SCHEMA_REF);

  if (method === COMPARE_METHOD.DIFF) {
    if (await fileExists(schemaRef)) {
      const schemaDiff = await getDiff(schema, schemaRef);
      hasDiff = schemaDiff.length > 0;
    }
  }

  if (method === COMPARE_METHOD.HASH) {
    if (await fileExists(hashFile)) {
      const hash = await readFile(hashFile);
      hasDiff = hashSchema != hash;
    }
  }
  return hasDiff;
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
  saveSchemaHash,
  saveSchemaFile,
  COMPARE_METHOD,
};
