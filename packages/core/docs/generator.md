# generator

Core generator functionality for GraphQL Markdown documentation.

This module contains the main functionality for generating markdown documentation
from GraphQL schemas. It handles schema loading, processing, and markdown generation
through appropriate printers and renderers.

## Variables

### FILE_EXTENSION

```ts
const readonly FILE_EXTENSION: object;
```

Defined in: [generator.ts:64](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L64)

Supported file extensions for generated documentation files.

#### Type Declaration

##### MD

```ts
readonly MD: ".md" = ".md";
```

##### MDX

```ts
readonly MDX: ".mdx" = ".mdx";
```

#### Constant

## Functions

### checkSchemaDifferences()

```ts
function checkSchemaDifferences(
  schema,
  schemaLocation,
  diffMethod,
  tmpDir,
): Promise<boolean>;
```

Defined in: [generator.ts:198](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L198)

Checks if there are differences in the GraphQL schema compared to a previous version.

#### Parameters

##### schema

`GraphQLSchema`

The GraphQL schema to check for differences.

##### schemaLocation

`string`

The location/path of the schema file for logging purposes.

##### diffMethod

`Maybe`&lt;`TypeDiffMethod`&gt;

The method to use for detecting differences. If set to `NONE`, changes detection is skipped.

##### tmpDir

`string`

The temporary directory path used for storing and comparing schema versions.

#### Returns

`Promise`&lt;`boolean`&gt;

A promise that resolves to `true` if changes are detected or if diff method is `NONE`,
or `false` if no changes are detected.

#### Remarks

When no changes are detected, a log message is generated indicating that the schema is unchanged.

---

### generateDocFromSchema()

```ts
function generateDocFromSchema(options): Promise<void>;
```

Defined in: [generator.ts:270](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L270)

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

`Promise`&lt;`void`&gt;

Promise that resolves when documentation is fully generated

---

### getFormatterFromMDXModule()

```ts
function getFormatterFromMDXModule(
  mdxModule,
  meta?,
): Partial<Formatter> | undefined;
```

Defined in: [generator.ts:119](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L119)

**`Internal`**

Extracts a formatter from an MDX module.

Checks if the MDX module exports a `createMDXFormatter` factory function and calls it
to create a Formatter. If no factory function is found, returns undefined.

#### Parameters

##### mdxModule

`unknown`

The loaded MDX module that may contain a createMDXFormatter export

##### meta?

`Maybe`&lt;\{
`generatorFrameworkName?`: `Maybe`&lt;`string`&gt;;
`generatorFrameworkVersion?`: `Maybe`&lt;`string`&gt;;
\}&gt;

Optional metadata to pass to the formatter factory

#### Returns

`Partial`&lt;`Formatter`&gt; \| `undefined`

A Formatter if the module has a factory function, undefined otherwise

---

### loadGraphqlSchema()

```ts
function loadGraphqlSchema(
  schemaLocation,
  loadersList,
): Promise<Maybe<GraphQLSchema>>;
```

Defined in: [generator.ts:167](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L167)

**`Internal`**

Loads a GraphQL schema from the specified location using configured document loaders.

#### Parameters

##### schemaLocation

`string`

The location/path of the GraphQL schema to load (e.g., file path, URL, or glob pattern).

##### loadersList

`Maybe`&lt;`LoaderOption`&gt;

Optional loader configuration for customizing how the schema is loaded.

#### Returns

`Promise`&lt;`Maybe`&lt;`GraphQLSchema`&gt;&gt;

A promise that resolves to the loaded GraphQL schema, or undefined if:

- The loaders cannot be initialized
- An error occurs during schema loading

---

### loadMDXModule()

```ts
function loadMDXModule(mdxParser): Promise<unknown>;
```

Defined in: [generator.ts:93](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L93)

**`Internal`**

Asynchronously loads an MDX module dynamically.

#### Parameters

##### mdxParser

`Maybe`&lt;`string` \| `PackageName`&gt;

The MDX parser package name or path to import. Can be null or undefined.

#### Returns

`Promise`&lt;`unknown`&gt;

A promise that resolves to the imported module, or undefined if:

- The mdxParser parameter is null or undefined
- An error occurs during import (logs a warning and returns undefined)

---

### resolveSkipAndOnlyDirectives()

```ts
function resolveSkipAndOnlyDirectives(
  onlyDocDirective,
  skipDocDirective,
  schema,
): GraphQLDirective[][];
```

Defined in: [generator.ts:229](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/generator.ts#L229)

Resolves and retrieves GraphQL directive objects from the schema based on their names.

Takes two lists of directive names (for "only" and "skip" documentation directives),
looks them up in the provided GraphQL schema, and returns the resolved directive objects.

#### Parameters

##### onlyDocDirective

`Maybe`&lt;`DirectiveName` \| `DirectiveName`[]&gt;

A directive name or array of directive names for "only" documentation filtering

##### skipDocDirective

`Maybe`&lt;`DirectiveName` \| `DirectiveName`[]&gt;

A directive name or array of directive names for "skip" documentation filtering

##### schema

`GraphQLSchema`

The GraphQL schema to resolve directives from

#### Returns

`GraphQLDirective`[][]

A tuple containing two arrays: the first with resolved "only" directives,
the second with resolved "skip" directives. Only defined directives are included.
