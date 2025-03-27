# index

## Type Aliases

### GraphQLMarkdownCliType

```ts
type GraphQLMarkdownCliType = CommanderStatic;
```

Defined in: [index.ts:21](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L21)

Type representing the GraphQL Markdown CLI.

#### See

[GraphQL Markdown Documentation](https://graphql-markdown.dev)

## Functions

### getGraphQLMarkdownCli()

```ts
function getGraphQLMarkdownCli(
   options, 
   loggerModule?, 
   customMdxParser?): CommanderStatic
```

Defined in: [index.ts:76](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L76)

Configures and returns the GraphQL Markdown CLI.

#### Parameters

##### options

`GraphQLMarkdownCliOptions`

Options for configuring the GraphQL Markdown CLI.

##### loggerModule?

`string`

Optional logger module to use.

##### customMdxParser?

Optional MDX parser configuration.

`string` | `boolean`

#### Returns

`CommanderStatic`

The configured CLI instance.

#### Example

```typescript
const cli = getGraphQLMarkdownCli(
  { id: "custom" },
  "custom-logger",
  true
);
await cli.parseAsync(process.argv);
```

***

### runGraphQLMarkdown()

```ts
function runGraphQLMarkdown(
   options, 
   cliOptions, 
loggerModule?): Promise<void>
```

Defined in: [index.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/index.ts#L39)

Runs the GraphQL Markdown CLI to generate documentation from a GraphQL schema.

#### Parameters

##### options

`GraphQLMarkdownCliOptions`

Options for configuring the GraphQL Markdown CLI.

##### cliOptions

`CliOptions`

Command-line options passed to the CLI.

##### loggerModule?

`string`

Optional logger module to use.

#### Returns

`Promise`\<`void`\>

#### Example

```typescript
await runGraphQLMarkdown(
  { id: "custom" },
  { schema: "./schema.graphql", root: "./docs" },
  "custom-logger"
);
```
