# generator

Core generator functionality for GraphQL Markdown documentation.

This module contains the main functionality for generating markdown documentation
from GraphQL schemas. It handles schema loading, processing, and markdown generation
through appropriate printers and renderers.

## Functions

### generateDocFromSchema()

```ts
function generateDocFromSchema(options): Promise<void>;
```

Defined in: [generator.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L64)

Main entry point for generating Markdown documentation from a GraphQL schema.

This function coordinates the entire documentation generation process:
- Loads and validates the schema
- Checks for schema changes if diffing is enabled
- Processes directives and groups
- Initializes printers and renderers
- Generates markdown files

#### Parameters

##### options

`GeneratorOptions`

Complete configuration for the documentation generation

#### Returns

`Promise`\<`void`\>

Promise that resolves when documentation is fully generated
