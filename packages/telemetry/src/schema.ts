/**
 * Allowlist of every string a payload may carry, as plain data: enums plus
 * mask tokens. Shared with the Worker, which rejects anything else.
 */
export const EVENTS = ["config", "create_scaffold", "create_wire"] as const;
export const TRIGGERS = ["cli", "docusaurus", "nuxt", "programmatic"] as const;
export const CI_PROVIDERS = [
  "github-actions",
  "gitlab",
  "circleci",
  "azure-pipelines",
  "jenkins",
  "bitbucket",
  "buildkite",
  "travis",
  "vercel",
  "netlify",
  "cloudflare-pages",
  "aws-codebuild",
  "teamcity",
  "appveyor",
  "drone",
  "render",
  "other",
] as const;
export const PACKAGE_MANAGERS = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
  "unknown",
] as const;
export const LOADER_KINDS = [
  "url",
  "file-sdl",
  "file-json",
  "git",
  "github",
  "glob",
  "code-file",
  "inline-sdl",
  "unknown",
] as const;
export const MODES = ["scaffold", "wire"] as const;
export const DIFF_METHODS = ["FORCE", "NONE"] as const;
export const DEPRECATED_OPTIONS = ["default", "group", "skip"] as const;
export const HIERARCHIES = ["api", "entity", "flat"] as const;
export const FORMATTER_PRESETS = [
  "docfx",
  "docusaurus",
  "fumadocs",
  "honkit",
  "hugo",
  "mdbook",
  "mdx",
  "mkdocs",
  "starlight",
  "vocs",
] as const;
export const KNOWN_LOADERS = [
  "UrlLoader",
  "JsonFileLoader",
  "GraphQLFileLoader",
  "CodeFileLoader",
  "GitLoader",
  "GithubLoader",
  "ApolloEngineLoader",
  "PrismaLoader",
  "@graphql-tools/url-loader",
  "@graphql-tools/json-file-loader",
  "@graphql-tools/graphql-file-loader",
  "@graphql-tools/code-file-loader",
  "@graphql-tools/git-loader",
  "@graphql-tools/github-loader",
  "@graphql-tools/apollo-engine-loader",
  "@graphql-tools/prisma-loader",
] as const;
export const MASK_TOKENS = [
  "<url>",
  "<path>",
  "<string>",
  "<function>",
  "<object>",
  "<custom-loader>",
  "<custom-formatter>",
  "<git>",
  "<github>",
  "<file:sdl>",
  "<file:json>",
  "<file:code>",
  "<glob>",
  "<inline-sdl>",
  "<unknown>",
] as const;
/** Pattern of masked object keys, e.g. `<key:0>`. */
export const KEY_TOKEN_PATTERN = String.raw`^<key:\d+>$`;

export const ALLOWLIST = {
  events: EVENTS,
  triggers: TRIGGERS,
  ciProviders: CI_PROVIDERS,
  packageManagers: PACKAGE_MANAGERS,
  loaderKinds: LOADER_KINDS,
  modes: MODES,
  diffMethods: DIFF_METHODS,
  deprecatedOptions: DEPRECATED_OPTIONS,
  hierarchies: HIERARCHIES,
  formatterPresets: FORMATTER_PRESETS,
  formatterPackagePattern: "^@graphql-markdown/[a-z0-9-]+(/[a-z0-9-]+)*$",
  knownLoaders: KNOWN_LOADERS,
  maskTokens: MASK_TOKENS,
  keyTokenPattern: KEY_TOKEN_PATTERN,
  graphqlMajorUnknown: "unknown",
} as const;
