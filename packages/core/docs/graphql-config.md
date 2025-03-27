# graphql-config

GraphQL Markdown configuration utilities

This module provides utilities for loading and processing GraphQL configuration
using the graphql-config package.

## Variables

### EXTENSION\_NAME

```ts
const EXTENSION_NAME: "graphql-markdown";
```

Defined in: [graphql-config.ts:25](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L25)

The name of the GraphQL Markdown extension.
Used to identify the extension in graphql-config.

***

### graphQLConfigExtension

```ts
const graphQLConfigExtension: GraphQLExtensionDeclaration;
```

Defined in: [graphql-config.ts:40](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L40)

GraphQL extension declaration for graphql-config.

#### Returns

The extension configuration object with name property.

#### Example

```typescript
// In graphql-config setup
const config = await loadConfig({
  extensions: [graphQLConfigExtension],
});
```

## Functions

### loadConfiguration()

```ts
function loadConfiguration(
   id, 
   options?, 
throwOptions?): Promise<Maybe<Readonly<ExtensionProjectConfig>>>
```

Defined in: [graphql-config.ts:127](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L127)

Loads the GraphQL Markdown configuration from graphql-config.

This function attempts to load the GraphQL config and extract the
GraphQL Markdown extension configuration for the specified project ID.
It also normalizes schema configurations.

#### Parameters

##### id

`Maybe`\<`string`\>

The project ID to load configuration for.

##### options?

`Maybe`\<`PackageOptionsConfig`\>

Optional package options to apply.

##### throwOptions?

`ThrowOptions` = `...`

Options for controlling throw behavior.

#### Returns

`Promise`\<`Maybe`\<`Readonly`\<`ExtensionProjectConfig`\>\>\>

The extension project configuration if found, otherwise undefined.

#### Throws

Will throw an error if throwOnMissing or throwOnEmpty is true and
the corresponding condition is met.

#### Example

```typescript
// Basic usage
const config = await loadConfiguration("my-project");

// With options and throw behavior
const config = await loadConfiguration(
  "my-project",
  { baseDir: "./src" },
  { throwOnMissing: true, throwOnEmpty: false }
);
```

***

### setLoaderOptions()

```ts
function setLoaderOptions(loaders, options): LoaderOption
```

Defined in: [graphql-config.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L79)

Sets loader options for GraphQL Markdown loaders.

This function takes a LoaderOption object and merges the provided options
with any existing options for each loader.

#### Parameters

##### loaders

`LoaderOption`

The loader configuration object.

##### options

`PackageOptionsConfig`

The package options to apply to loaders.

#### Returns

`LoaderOption`

The updated loader configuration.

#### Example

```typescript
const loaders = {
  TypeScriptLoader: {
    module: "@graphql-markdown/typescript-loader",
    options: { baseDir: "./src" }
  }
};
const options = { outputDir: "./docs" };
const updatedLoaders = setLoaderOptions(loaders, options);
// Result: loaders with { baseDir: "./src", outputDir: "./docs" }
```
