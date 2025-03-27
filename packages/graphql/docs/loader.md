# loader

Library for GraphQL schema loading and `loaders` config processing.

## Functions

### getDocumentLoaders()

```ts
function getDocumentLoaders(loadersList): Promise<Maybe<LoadSchemaOptions>>
```

Defined in: [packages/graphql/src/loader.ts:114](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/loader.ts#L114)

#### Parameters

##### loadersList

`Maybe`\<`LoaderOption`\>

#### Returns

`Promise`\<`Maybe`\<`LoadSchemaOptions`\>\>

***

### loadSchema()

```ts
function loadSchema(schemaLocation, options): Promise<GraphQLSchema>
```

Defined in: [packages/graphql/src/loader.ts:46](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/loader.ts#L46)

#### Parameters

##### schemaLocation

`string`

##### options

`BuildSchemaOptions` & `GraphQLParseOptions` & `object` & `object` & `object` & `Partial`\<`IExecutableSchemaDefinition`\<`any`\>\> & `object` & `object`

#### Returns

`Promise`\<`GraphQLSchema`\>
