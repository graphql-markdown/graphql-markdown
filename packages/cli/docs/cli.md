# cli

This module provides the CLI functionality for generating documentation from GraphQL schemas.
It exports utilities to run the documentation generator both programmatically and via CLI.

## See

[GraphQL Markdown Documentation](https://graphql-markdown.dev)

## Type Aliases

### GraphQLMarkdownCliType

```ts
type GraphQLMarkdownCliType = Command;
```

Defined in: [index.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L32)

Type representing the GraphQL Markdown CLI.

#### See

[GraphQL Markdown Documentation](https://graphql-markdown.dev)

## Functions

### getGraphQLMarkdownCli()

```ts
function getGraphQLMarkdownCli(
  options,
  loggerModule?,
  customFormatter?,
): Command;
```

Defined in: [index.ts:89](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L89)

Configures and returns the GraphQL Markdown CLI.

#### Parameters

##### options

`ConfigOptions`

Options for configuring the GraphQL Markdown CLI.

##### loggerModule?

`string`

Optional logger module to use.

##### customFormatter?

`string`

Optional default formatter package name. When provided, registers
`--formatter` and `--mdxParser` (deprecated) flags with this value as the default.

#### Returns

`Command`

The configured CLI instance.

#### Example

```typescript
const cli = getGraphQLMarkdownCli(
  { id: "custom" },
  "custom-logger",
  "@graphql-markdown/formatters/docusaurus",
);
await cli.parseAsync(process.argv);
```

---

### runGraphQLMarkdown()

```ts
function runGraphQLMarkdown(options, cliOptions, loggerModule?): Promise<void>;
```

Defined in: [index.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L50)

Runs the GraphQL Markdown CLI to generate documentation from a GraphQL schema.

#### Parameters

##### options

`ConfigOptions`

Options for configuring the GraphQL Markdown CLI.

##### cliOptions

`CliOptions`

Command-line options passed to the CLI.

##### loggerModule?

`string`

Optional logger module to use.

#### Returns

`Promise`&lt;`void`&gt;

#### Example

```typescript
await runGraphQLMarkdown(
  { id: "custom" },
  { schema: "./schema.graphql", root: "./docs" },
  "custom-logger",
);
```
