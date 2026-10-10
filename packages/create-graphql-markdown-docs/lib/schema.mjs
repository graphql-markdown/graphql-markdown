import fs from "node:fs";

import { buildSchema } from "graphql";

export const EXAMPLE_SCHEMA_REF = "./schema/example.graphql";
export const defaultSchemaLine = `schema: '${EXAMPLE_SCHEMA_REF}'`;

/**
 * The official graphql-tools loaders (github.com/ardatan/graphql-tools/tree/
 * master/packages/loaders) that make sense as a schema *source* for
 * graphql-markdown — excludes loaders for things that aren't ever a whole
 * schema's source (e.g. `@graphql-tools/apollo-engine-loader` targets a
 * managed-federation registry, out of scope here).
 *
 * `version: 'latest'` deliberately, not a pinned range: a scaffolded project
 * runs `npm install` (or equivalent) immediately, once, right after this
 * file is written — there's no ongoing lockfile for this CLI to keep in sync
 * with graphql-tools' own release cadence, so pinning a version here would
 * just silently go stale the day graphql-tools cuts a release. Same
 * rationale most `create-*` scaffolding CLIs use for freshly-installed deps.
 *
 * `match` runs against the raw schema source string the user provided (a
 * path or a URL) to pick the loader graphql-markdown needs to actually read
 * it; order matters, first match wins.
 */
const LOADERS = [
  {
    id: "url",
    match: (source) => /^https?:\/\//i.test(source),
    className: "UrlLoader",
    package: "@graphql-tools/url-loader",
    version: "latest",
    // URL sources are introspected with POST.
    options: { method: "POST" },
  },
  {
    id: "github",
    match: (source) => /^github:/i.test(source),
    className: "GithubLoader",
    package: "@graphql-tools/github-loader",
    version: "latest",
    // GithubLoader needs an API token, read from this env var.
    tokenEnvVar: "GITHUB_TOKEN",
  },
  {
    id: "git",
    match: (source) => /^git:/i.test(source),
    className: "GitLoader",
    package: "@graphql-tools/git-loader",
    version: "latest",
  },
  {
    id: "json",
    match: (source) => /\.json$/i.test(source),
    className: "JsonFileLoader",
    package: "@graphql-tools/json-file-loader",
    version: "latest",
  },
  {
    id: "code",
    match: (source) => /\.(js|mjs|cjs|ts|mts|cts)$/i.test(source),
    className: "CodeFileLoader",
    package: "@graphql-tools/code-file-loader",
    version: "latest",
  },
  {
    // Default: a local .graphql/.gql SDL file. This is the loader
    // `createGenerateDocs` already defaults to internally, so scaffolds that
    // land here emit no explicit `loaders` option at all — one less thing
    // for the common case to carry, and no version to track either.
    id: "file",
    match: (source) => /\.(graphql|gql)$/i.test(source),
    className: "GraphQLFileLoader",
    package: "@graphql-tools/graphql-file-loader",
    isDefault: true,
  },
];

export const DEFAULT_LOADER = LOADERS.find((loader) => loader.isDefault);

/** Picks the loader for a schema source string, falling back to the local-file loader. */
export function detectLoader(schemaSource) {
  return LOADERS.find((loader) => loader.match(schemaSource)) ?? DEFAULT_LOADER;
}

/** A schema "path" that's actually a remote/VCS reference, not a local file to copy. */
export function isRemoteSchemaSource(source) {
  return /^(https?|git|github):/i.test(source);
}

/**
 * Validate a GraphQL schema file by attempting to parse it with buildSchema.
 */
export async function validateGraphQLSchema(schemaPath) {
  try {
    const schemaText = await fs.promises.readFile(schemaPath, "utf-8");
    buildSchema(schemaText);
    return true;
  } catch {
    return false;
  }
}
