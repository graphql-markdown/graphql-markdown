import { codegen } from "@graphql-codegen/core";
import type { Types } from "@graphql-codegen/plugin-helpers";
import { loadSchema, loadDocuments } from "@graphql-tools/load";
import * as fs from "fs/promises";
import { printSchema, parse } from "graphql";

/**
 * Generate code using GraphQL Code Generator programmatically.
 * @param config - Codegen configuration object
 */
export const generateCode = async (
  config: Types.GenerateOptions,
): Promise<string> => {
  // Instantiate the file loader
  const { GraphQLFileLoader } = await import(
    "@graphql-tools/graphql-file-loader"
  );
  const loaders = [new GraphQLFileLoader()];

  // Load schema
  const schema = await loadSchema(config.schema, { loaders });

  // Load documents
  const documents = await loadDocuments(config.documents, { loaders });

  const output = await codegen({
    ...config,
    schema: parse(printSchema(schema)),
    documents,
  });

  // Write output to file
  if (config.filename) {
    await fs.writeFile(config.filename, output);
  }
  return output;
};
