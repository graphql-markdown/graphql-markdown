# Module: graphql/loader

Library for GraphQL schema loading and `loaders` config processing.

## Functions

### getDocumentLoaders

```ts
getDocumentLoaders(loadersList): Promise< Maybe< LoadSchemaOptions > >
```

Asynchronously returns a valid loaders list for [loadSchema](graphql_loader.md#loadschema) based on the plugin config.
Import each loader package, and instantiate a loader object.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `loadersList` | `Maybe`\< `LoaderOption` \> | the list of loaders defined in the plugin config. |

#### Returns

`Promise`\< `Maybe`\< `LoadSchemaOptions` \> \>

a list of loader objects.

#### Throws

an `Error` if no loader has been loaded, or if an error occurred while importing loaders.

#### Example

```js
import { getDocumentLoaders, loadSchema } from "@graphql-markdown/utils/graphql"

const loaderList = {
  GraphQLFileLoader: "@graphql-tools/graphql-file-loader",
};

const loaders = await getDocumentLoaders(loaderList);

const schema = await loadSchema("schema.graphql", {
  loaders,
  rootTypes: { query: "Root", subscription: "" },
});
```

#### Defined In

[packages/utils/src/graphql/loader.ts:106](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/loader.ts#L106)

***

### loadSchema

```ts
loadSchema(schemaLocation, options): Promise< GraphQLSchema >
```

Wrapper method for `@graphql-tools/load.loadSchema` to load asynchronously a GraphQL Schema from a source.
The wrapper will load the schema using the loader declared in `options`.
If `rootTypes` is set in the options, then the schema root types will be overridden to generate custom GraphQL schema.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `schemaLocation` | `string` | the schema location pointer matching the loader. |
| `options` | `BuildSchemaOptions` & `GraphQLParseOptions` & \{} & \{} & \{} & `Partial`\< `IExecutableSchemaDefinition`\< `any` \> \> & \{} & \{`rootTypes`: `Partial`\< `Record`\< `OperationTypeNode`, `string` \> \>;} | the schema `loaders`, and optional `rootTypes` override. |

#### Returns

`Promise`\< `GraphQLSchema` \>

a GraphQL schema.

#### Example

```js
import { loadSchema } from "@graphql-markdown/utils/graphql"

const schema = await loadSchema("schema.graphql", {
  loaders: [new GraphQLFileLoader()],
  rootTypes: { query: "Root", subscription: "" },
});
```

#### Defined In

[packages/utils/src/graphql/loader.ts:41](https://github.com/graphql-markdown/graphql-markdown/blob/466abea6/packages/utils/src/graphql/loader.ts#L41)
