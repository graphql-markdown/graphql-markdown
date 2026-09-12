# graphql-config

GraphQL Markdown configuration utilities

This module provides utilities for loading and processing GraphQL configuration
using the graphql-config package.

## Interfaces

### ThrowOptions

Defined in: [packages/core/src/graphql-config.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L58)

Options for controlling throw behavior when loading configuration.

ThrowOptions

#### Properties

##### throwOnEmpty?

```ts
optional throwOnEmpty?: boolean;
```

Defined in: [packages/core/src/graphql-config.ts:60](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L60)

Whether to throw when the config is empty.

##### throwOnMissing?

```ts
optional throwOnMissing?: boolean;
```

Defined in: [packages/core/src/graphql-config.ts:59](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L59)

Whether to throw when the config file is missing.

## Variables

### graphQLConfigExtension

```ts
const graphQLConfigExtension: GraphQLExtensionDeclaration;
```

Defined in: [packages/core/src/graphql-config.ts:47](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L47)

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
  throwOptions?,
): Promise<Maybe<Readonly<ExtensionProjectConfig>>>;
```

Defined in: [packages/core/src/graphql-config.ts:144](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L144)

Loads the GraphQL Markdown configuration from graphql-config.

This function attempts to load the GraphQL config and extract the
GraphQL Markdown extension configuration for the specified project ID.
It also normalizes schema configurations.

#### Parameters

##### id

`Maybe`&lt;`string`&gt;

The project ID to load configuration for.

##### options?

`Maybe`&lt;`PackageOptionsConfig`&gt;

Optional package options to apply.

##### throwOptions?

[`ThrowOptions`](#throwoptions) = `DEFAULT_THROW_OPTIONS`

Options for controlling throw behavior.

#### Returns

`Promise`&lt;`Maybe`&lt;`Readonly`&lt;`ExtensionProjectConfig`&gt;&gt;&gt;

The extension project configuration if found, otherwise `undefined`.

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
  { throwOnMissing: true, throwOnEmpty: false },
);
```

---

### setLoaderOptions()

```ts
function setLoaderOptions(loaders, options): LoaderOption;
```

Defined in: [packages/core/src/graphql-config.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L96)

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
    options: { baseDir: "./src" },
  },
};
const options = { outputDir: "./docs" };
const updatedLoaders = setLoaderOptions(loaders, options);
// Result: loaders with { baseDir: "./src", outputDir: "./docs" }
```
