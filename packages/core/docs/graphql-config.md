# graphql-config

## Variables

### EXTENSION\_NAME

```ts
const EXTENSION_NAME: "graphql-markdown";
```

#### Source

[graphql-config.ts:13](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L13)

***

### graphQLConfigExtension

```ts
const graphQLConfigExtension: GraphQLExtensionDeclaration;
```

#### Source

[graphql-config.ts:14](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L14)

## Functions

### loadConfiguration()

```ts
function loadConfiguration(
   id, 
   options?, 
__namedParameters?): Promise<Maybe<Readonly<ExtensionProjectConfig>>>
```

#### Parameters

• **id**: `Maybe`\<`string`\>

• **options?**: `Maybe`\<`PackageOptionsConfig`\>

• **\_\_namedParameters?**: `ThrowOptions`= `undefined`

#### Returns

`Promise`\<`Maybe`\<`Readonly`\<`ExtensionProjectConfig`\>\>\>

#### Source

[graphql-config.ts:43](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L43)

***

### setLoaderOptions()

```ts
function setLoaderOptions(loaders, options): LoaderOption
```

#### Parameters

• **loaders**: `LoaderOption`

• **options**: `PackageOptionsConfig`

#### Returns

`LoaderOption`

#### Source

[graphql-config.ts:23](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/core/src/graphql-config.ts#L23)
