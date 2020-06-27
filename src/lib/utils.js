const slugify = require('slugify');
const { kebabCase, startCase, round } = require('lodash');
const crypto = require('crypto');
const { printSchema } = require('graphql')
const fs = require('fs-extra')
const path = require('path')

const SCHEMA_HASH_FILE ='.schema';

function toSlug(str) {
    return slugify(kebabCase(str));
}

function toArray(param) {
    if (param) return Object.keys(param).map((key) => param[key]);
    return undefined;
}

function getSchemaHash(schema) {
  let printedSchema = printSchema(schema, { commentDescriptions: true })
  let sum = crypto.createHash('sha256');
  sum.update(printedSchema);
  return sum.digest('hex');
}

function checkSchemaChanges(schema, outputDir) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  let hasDiff = true;
  if (fs.existsSync(hashFile)) {
    const hash = fs.readFileSync(hashFile);
    hasDiff = hashSchema != hash;
  }
  return hasDiff;
}

function saveSchemaHash(schema, outputDir) {
  const hashFile = path.join(outputDir, SCHEMA_HASH_FILE);
  const hashSchema = getSchemaHash(schema);
  fs.outputFileSync(hashFile, hashSchema);
}

module.exports = { round, startCase, toSlug, toArray, getSchemaHash, checkSchemaChanges, saveSchemaHash };
