import fs from "node:fs";
import path from "node:path";

import {
  DEFAULT_LOADER,
  EXAMPLE_SCHEMA_REF,
  defaultSchemaLine,
} from "../schema.mjs";
import { INDENT_STEP, findIndentedLine } from "./lines.mjs";

/**
 * Rewrite a graphql-config template's .graphqlrc `schema` line and loader entry.
 * The template must contain a `schema: './schema/example.graphql'` line and the
 * default loader entry under `extensions.graphql-markdown.loaders`; the new
 * entry reuses that line's indentation.
 */
export function writeGraphqlrc(tempDir, schemaRef, loader) {
  const graphqlrcPath = path.join(tempDir, ".graphqlrc");
  const originalContent = fs.readFileSync(graphqlrcPath, "utf-8");

  const defaultLoaderEntry = `${DEFAULT_LOADER.className}: '${DEFAULT_LOADER.package}'`;

  let updated = originalContent.replace(
    defaultSchemaLine,
    () => `schema: '${schemaRef.replaceAll("'", "''")}'`,
  );

  if (schemaRef !== EXAMPLE_SCHEMA_REF && updated === originalContent) {
    throw new Error(
      `Expected to find and replace "${defaultSchemaLine}" in ${graphqlrcPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
    );
  }

  if (!loader.isDefault) {
    // Loader options are rendered as-is; a token env var becomes a `${VAR}`
    // reference (graphql-config interpolates `${VAR}` in .graphqlrc).
    const options = {
      ...loader.options,
      ...(loader.tokenEnvVar && { token: `\${${loader.tokenEnvVar}}` }),
    };
    const found = findIndentedLine(updated, defaultLoaderEntry);
    if (!found) {
      throw new Error(
        `Expected to find and replace "${defaultLoaderEntry}" in ${graphqlrcPath}, but nothing matched — the template may have changed. Update the CLI's rewrite logic.`,
      );
    }

    const { line, indent } = found;
    const child = indent + INDENT_STEP;
    const optionLines = Object.entries(options).map(
      ([key, value]) => `\n${child}${INDENT_STEP}${key}: '${value}'`,
    );
    const loaderEntry =
      optionLines.length === 0
        ? `${indent}${loader.className}: '${loader.package}'`
        : `${indent}${loader.className}:\n${child}module: '${loader.package}'\n${child}options:${optionLines.join("")}`;
    updated = updated.replace(line, () => loaderEntry);
  }

  fs.writeFileSync(graphqlrcPath, updated);
}
