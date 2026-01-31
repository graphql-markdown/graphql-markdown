# formatter

Internal library of helpers for formatting GraphQL values.

## Functions

### getFormattedDefaultValue()

```ts
function getFormattedDefaultValue<T>(entity): Maybe<string | T>;
```

Defined in: [packages/graphql/src/formatter.ts:130](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/formatter.ts#L130)

Returns a printable formatted value for a GraphQL type.
This is the generic function.

#### Type Parameters

##### T

`T`

#### Parameters

##### entity

`GraphQLSchemaEntity`&lt;`T`&gt;

the GraphQL schema entity processed.

#### Returns

`Maybe`&lt;`string` \| `T`&gt;

a printable formatted value.
