# loader

Library for GraphQL schema loading and `loaders` config processing.

## Functions

### getDocumentLoaders()

```ts
function getDocumentLoaders(loadersList): Promise<Maybe<LoadSchemaOptions>>;
```

Defined in: [packages/graphql/src/loader.ts:111](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/loader.ts#L111)

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

Defined in: [packages/graphql/src/loader.ts:48](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/loader.ts#L48)

#### Parameters

##### schemaLocation

`string`

##### options

`LoadSchemaConfig`

#### Returns

`Promise`&lt;`GraphQLSchema`&gt;
