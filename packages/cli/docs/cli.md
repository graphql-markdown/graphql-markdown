# cli

This module provides the CLI functionality for generating documentation from GraphQL schemas.
It exports utilities to run the documentation generator both programmatically and via CLI.

## See

[GraphQL Markdown Documentation](https://graphql-markdown.dev)

## Interfaces

### RunContext

Defined in: [index.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L38)

Internal context set by GraphQL-Markdown entry points.

#### Properties

##### trigger?

```ts
trigger?: TelemetryTrigger;
```

Defined in: [index.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L40)

Entry point reported by anonymous telemetry.

## Type Aliases

### GraphQLMarkdownCliType

```ts
type GraphQLMarkdownCliType = Command;
```

Defined in: [index.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L33)

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
  context?,
): Command;
```

Defined in: [index.ts:101](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L101)

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
`--formatter` flag with this value as the default.

##### context?

[`RunContext`](#runcontext)

Optional internal context (telemetry trigger).

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
function runGraphQLMarkdown(
  options,
  cliOptions?,
  loggerModule?,
  context?,
): Promise<void>;
```

Defined in: [index.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L60)

Runs the GraphQL Markdown CLI to generate documentation from a GraphQL schema.

#### Parameters

##### options

`ConfigOptions`

Options for configuring the GraphQL Markdown CLI.

##### cliOptions?

`CliOptions`

Optional command-line options passed to the CLI.

##### loggerModule?

`string`

Optional logger module to use.

##### context?

[`RunContext`](#runcontext)

Optional internal context (telemetry trigger).

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
