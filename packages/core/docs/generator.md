# generator

## Functions

### generateDocFromSchema()

```ts
function generateDocFromSchema(options): Promise<void>
```

Defined in: [generator.ts:66](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L66)

Generates Markdown documentation from a GraphQL schema.

This function is the main entry point for the documentation generation process.
It loads the schema, analyzes it, and generates Markdown files according to the provided options.

#### Parameters

##### options

`GeneratorOptions`

Configuration options for the documentation generator

#### Returns

`Promise`\<`void`\>

Promise that resolves when documentation generation is complete

#### Example

```typescript
await generateDocFromSchema({
  baseURL: '/docs',
  outputDir: './docs',
  schemaLocation: './schema.graphql'
});
```
