const crypto = require('crypto');
const fs = require('fs-extra');
const path = require('path');
const { loadSchema, GraphQLFileLoader, printSchema } = require('./graphql');
const { diff } = require('@graphql-inspector/core');

const SCHEMA_HASH_FILE = '.schema';
const SCHEMA_REF = 'schema.graphql';
const COMPARE_METHODS = {
    COMPARE_WITH_SCHEMA_DIFF: 'SCHEMA-DIFF',
    COMPARE_WITH_SCHEMA_HASH: 'SCHEMA-HASH',
};

function getSchemaHash(schema) {
    let printedSchema = printSchema(schema, { commentDescriptions: true });
    let sum = crypto.createHash('sha256');
    sum.update(printedSchema);
    return sum.digest('hex');
}

async function getDiff(schemaNew, schemaOld) {
    return Promise.resolve(
        loadSchema(schemaOld, {
            loaders: [new GraphQLFileLoader()],
        }),
    ).then((schemaRef) => diff(schemaRef, schemaNew));
}

async function checkSchemaChanges(schema, outputDir, method = COMPARE_METHODS.COMPARE_WITH_SCHEMA_DIFF) {
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
            const hash = fs.readFileSync(hashFile);
            hasDiff = hashSchema != hash;
        }
    }
    return hasDiff;
}

async function saveSchemaFile(schema, outputDir) {
    const schemaFile = path.join(outputDir, SCHEMA_REF);
    const schemaPrint = printSchema(schema);
    await fs.outputFile(schemaFile, schemaPrint);
}

async function saveSchemaHash(schema, outputDir) {
    const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
    const hashSchema = getSchemaHash(schema);
    await fs.outputFile(hashFile, hashSchema);
}

module.exports = { checkSchemaChanges, saveSchemaHash, saveSchemaFile };
