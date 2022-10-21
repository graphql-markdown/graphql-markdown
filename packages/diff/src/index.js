const path = require("path");
const crypto = require("crypto");

const { printSchema } = require("graphql");
const { loadSchema } = require("@graphql-tools/load");
const { diff } = require("@graphql-inspector/core");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

const {
  fs: { fileExists, readFile, saveFile },
} = require("@graphql-markdown/utils").helpers;

const SCHEMA_HASH_FILE = ".schema";
const SCHEMA_REF = "schema.graphql";
const COMPARE_METHOD = {
  DIFF: "SCHEMA-DIFF",
  HASH: "SCHEMA-HASH",
  FORCE: "FORCE",
};

function getSchemaHash(schema) {
  const printedSchema = printSchema(schema, { commentDescriptions: true });
  return crypto.createHash("sha256").update(printedSchema).digest("hex");
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
  if (method === COMPARE_METHOD.DIFF) {
    const schemaRef = path.join(outputDir, SCHEMA_REF);
    if (await fileExists(schemaRef)) {
      const schemaDiff = await getDiff(schema, schemaRef);
      return schemaDiff.length > 0;
    }
    const schemaPrint = printSchema(schema);
    await saveFile(schemaRef, schemaPrint);
  }

  if (method === COMPARE_METHOD.HASH) {
    const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
    const hashSchema = getSchemaHash(schema);
    if (await fileExists(hashFile)) {
      const hash = await readFile(hashFile, { encoding: "utf8", flag: "r" });
      return !(hashSchema === hash);
    }
    await saveFile(hashFile, hashSchema);
  }

  return true;
}

module.exports = {
  checkSchemaChanges,
  COMPARE_METHOD,
  SCHEMA_HASH_FILE,
  SCHEMA_REF,
};
