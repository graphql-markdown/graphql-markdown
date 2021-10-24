const path = require("path");
const crypto = require("crypto");

const fsExtra = require("fs-extra");

const { loadSchema, getDocumentLoaders, printSchema } = require("./graphql");
const { diff } = require("@graphql-inspector/core");

const SCHEMA_HASH_FILE = ".schema";
const SCHEMA_REF = "schema.graphql";
const COMPARE_METHODS = {
  COMPARE_WITH_SCHEMA_DIFF: "SCHEMA-DIFF",
  COMPARE_WITH_SCHEMA_HASH: "SCHEMA-HASH",
};

const defaultLoaders = {
  GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
};

function getSchemaHash(schema) {
  let printedSchema = printSchema(schema, { commentDescriptions: true });
  let sum = crypto.createHash("sha256");
  sum.update(printedSchema);
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
  method = COMPARE_METHODS.COMPARE_WITH_SCHEMA_DIFF,
) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  let hasDiff = true;
  const schemaRef = path.join(outputDir, SCHEMA_REF);

  if (method === COMPARE_METHODS.COMPARE_WITH_SCHEMA_DIFF) {
    if (fsExtra.existsSync(schemaRef)) {
      const schemaDiff = await getDiff(schema, schemaRef);
      hasDiff = schemaDiff.length > 0;
    }
  }

  if (method === COMPARE_METHODS.COMPARE_WITH_SCHEMA_HASH) {
    if (fsExtra.existsSync(hashFile)) {
      const hash = await fsExtra.readFile(hashFile, "utf-8");
      hasDiff = hashSchema != hash;
    }
  }
  return hasDiff;
}

async function saveSchemaFile(schema, outputDir) {
  const schemaFile = path.join(outputDir, SCHEMA_REF);
  const schemaPrint = printSchema(schema);
  await fsExtra.outputFile(schemaFile, schemaPrint);
}

async function saveSchemaHash(schema, outputDir) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  await fsExtra.outputFile(hashFile, hashSchema);
}

module.exports = { checkSchemaChanges, saveSchemaHash, saveSchemaFile };
