# schema

## Variables

### ALLOWLIST

```ts
const ALLOWLIST: object;
```

Defined in: [schema.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L104)

#### Type Declaration

##### ciProviders

```ts
readonly ciProviders: typeof CI_PROVIDERS;
```

##### deprecatedOptions

```ts
readonly deprecatedOptions: typeof DEPRECATED_OPTIONS;
```

##### diffMethods

```ts
readonly diffMethods: typeof DIFF_METHODS;
```

##### events

```ts
readonly events: typeof EVENTS;
```

##### formatterPackagePattern

```ts
readonly formatterPackagePattern: "^@graphql-markdown/[a-z0-9-]+(/[a-z0-9-]+)*$";
```

##### formatterPresets

```ts
readonly formatterPresets: typeof FORMATTER_PRESETS;
```

##### graphqlMajorUnknown

```ts
readonly graphqlMajorUnknown: "unknown";
```

##### hierarchies

```ts
readonly hierarchies: typeof HIERARCHIES;
```

##### keyTokenPattern

```ts
readonly keyTokenPattern: typeof KEY_TOKEN_PATTERN;
```

##### knownLoaders

```ts
readonly knownLoaders: typeof KNOWN_LOADERS;
```

##### loaderKinds

```ts
readonly loaderKinds: typeof LOADER_KINDS;
```

##### maskTokens

```ts
readonly maskTokens: typeof MASK_TOKENS;
```

##### modes

```ts
readonly modes: typeof MODES;
```

##### packageManagers

```ts
readonly packageManagers: typeof PACKAGE_MANAGERS;
```

##### triggers

```ts
readonly triggers: typeof TRIGGERS;
```

---

### CI\_PROVIDERS

```ts
const CI_PROVIDERS: readonly [
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
];
```

Defined in: [schema.ts:13](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L13)

---

### DEPRECATED\_OPTIONS

```ts
const DEPRECATED_OPTIONS: readonly ["default", "group", "skip"];
```

Defined in: [schema.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L52)

---

### DIFF\_METHODS

```ts
const DIFF_METHODS: readonly ["FORCE", "NONE"];
```

Defined in: [schema.ts:51](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L51)

---

### EVENTS

```ts
const EVENTS: readonly ["config", "create_scaffold", "create_wire"];
```

Defined in: [schema.ts:5](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L5)

Allowlist of every string a payload may carry, as plain data: enums plus
mask tokens. Shared with the Worker, which rejects anything else.

---

### FORMATTER\_PRESETS

```ts
const FORMATTER_PRESETS: readonly [
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
];
```

Defined in: [schema.ts:54](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L54)

---

### HIERARCHIES

```ts
const HIERARCHIES: readonly ["api", "entity", "flat"];
```

Defined in: [schema.ts:53](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L53)

---

### KEY\_TOKEN\_PATTERN

```ts
const KEY_TOKEN_PATTERN: string;
```

Defined in: [schema.ts:102](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L102)

Pattern of masked object keys, e.g. `<key:0>`.

---

### KNOWN\_LOADERS

```ts
const KNOWN_LOADERS: readonly [
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
];
```

Defined in: [schema.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L66)

---

### LOADER\_KINDS

```ts
const LOADER_KINDS: readonly [
  "url",
  "file-sdl",
  "file-json",
  "git",
  "github",
  "glob",
  "code-file",
  "inline-sdl",
  "unknown",
];
```

Defined in: [schema.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L39)

---

### MASK\_TOKENS

```ts
const MASK_TOKENS: readonly [
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
];
```

Defined in: [schema.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L84)

---

### MODES

```ts
const MODES: readonly ["scaffold", "wire"];
```

Defined in: [schema.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L50)

---

### PACKAGE\_MANAGERS

```ts
const PACKAGE_MANAGERS: readonly ["npm", "pnpm", "yarn", "bun", "unknown"];
```

Defined in: [schema.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L32)

---

### TRIGGERS

```ts
const TRIGGERS: readonly [
  "cli",
  "create",
  "docusaurus",
  "nuxt",
  "programmatic",
];
```

Defined in: [schema.ts:6](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/telemetry/src/schema.ts#L6)
