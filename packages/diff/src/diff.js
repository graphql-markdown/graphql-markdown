"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSchemaChanges = exports.COMPARE_METHOD = exports.SCHEMA_REF = exports.SCHEMA_HASH_FILE = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const core_1 = require("@graphql-inspector/core");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const graphql_1 = require("@graphql-markdown/utils/graphql");
const fs_1 = require("@graphql-markdown/utils/fs");
exports.SCHEMA_HASH_FILE = ".schema";
exports.SCHEMA_REF = "schema.graphql";
var COMPARE_METHOD;
(function (COMPARE_METHOD) {
    COMPARE_METHOD["DIFF"] = "SCHEMA-DIFF";
    COMPARE_METHOD["HASH"] = "SCHEMA-HASH";
    COMPARE_METHOD["FORCE"] = "FORCE";
    COMPARE_METHOD["NONE"] = "NONE";
})(COMPARE_METHOD = exports.COMPARE_METHOD || (exports.COMPARE_METHOD = {}));
;
const getSchemaHash = (schema) => {
    const printedSchema = (0, graphql_1.printSchema)(schema, { commentDescriptions: true });
    return node_crypto_1.default.createHash("sha256").update(printedSchema).digest("hex");
};
const getDiff = async (schemaNew, schemaOldLocation) => {
    const schemaOld = await (0, graphql_1.loadSchema)(schemaOldLocation, {
        loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
    });
    return (0, core_1.diff)(schemaOld, schemaNew);
};
const checkSchemaChanges = async (schema, outputDir, method = COMPARE_METHOD.DIFF) => {
    if (method === COMPARE_METHOD.DIFF) {
        const schemaRef = node_path_1.default.join(outputDir, exports.SCHEMA_REF);
        if (await (0, fs_1.fileExists)(schemaRef)) {
            const schemaDiff = await getDiff(schema, schemaRef);
            return schemaDiff.length > 0;
        }
        const schemaPrint = (0, graphql_1.printSchema)(schema);
        await (0, fs_1.saveFile)(schemaRef, schemaPrint);
    }
    if (method === COMPARE_METHOD.HASH) {
        const hashFile = node_path_1.default.join(outputDir, exports.SCHEMA_HASH_FILE);
        const hashSchema = getSchemaHash(schema);
        if (await (0, fs_1.fileExists)(hashFile)) {
            const hash = await (0, fs_1.readFile)(hashFile, { encoding: "utf8", flag: "r" });
            return hashSchema !== hash;
        }
        await (0, fs_1.saveFile)(hashFile, hashSchema);
    }
    return true;
};
exports.checkSchemaChanges = checkSchemaChanges;
