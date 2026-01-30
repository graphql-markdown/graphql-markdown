# loader

Library for GraphQL schema loading and `loaders` config processing.

## Functions

### getDocumentLoaders()

```ts
function getDocumentLoaders(loadersList): Promise<Maybe<LoadSchemaOptions>>;
```

Defined in: [packages/graphql/src/loader.ts:113](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/loader.ts#L113)

#### Parameters

##### loadersList

`Maybe`&lt;`LoaderOption`&gt;

#### Returns

`Promise`&lt;`Maybe`&lt;`LoadSchemaOptions`&gt;&gt;

---

### loadSchema()

```ts
function loadSchema(schemaLocation, options): Promise<GraphQLSchema>;
```

Defined in: [packages/graphql/src/loader.ts:50](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/loader.ts#L50)

#### Parameters

##### schemaLocation

`string`

##### options

`LoadSchemaConfig`

#### Returns

`Promise`&lt;`GraphQLSchema`&gt;
