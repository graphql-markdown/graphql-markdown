# cli

## Functions

### default()

```ts
function default(options, loggerModule?): Command
```

Defined in: [packages/cli/src/cli.ts:27](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/cli.ts#L27)

#### Parameters

##### options

`GraphQLMarkdownCliOptions`

##### loggerModule?

`string`

#### Returns

`Command`

***

### runGraphQLMarkdown()

```ts
function runGraphQLMarkdown(
   options, 
   cliOptions, 
loggerModule?): Promise<void>
```

Defined in: [packages/cli/src/cli.ts:15](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/cli/src/cli.ts#L15)

#### Parameters

##### options

`GraphQLMarkdownCliOptions`

##### cliOptions

`CliOptions`

##### loggerModule?

`string`

#### Returns

`Promise`\<`void`\>
