# formatter

Internal library of helpers for formatting GraphQL values.

## Functions

### getFormattedDefaultValue()

```ts
function getFormattedDefaultValue<T>(entity): Maybe<string | T>
```

Defined in: [packages/graphql/src/formatter.ts:96](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/formatter.ts#L96)

Returns a printable formatted value for a GraphQL type.
This is the generic function.

#### Type Parameters

##### T

`T`

#### Parameters

##### entity

`GraphQLSchemaEntity`\<`T`\>

the GraphQL schema entity processed.

#### Returns

`Maybe`\<`string` \| `T`\>

a printable formatted value.
