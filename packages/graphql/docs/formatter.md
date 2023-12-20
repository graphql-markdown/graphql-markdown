# formatter

Internal library of helpers for formatting GraphQL values.

## Functions

### getFormattedDefaultValue()

```ts
getFormattedDefaultValue<T>(entity): Maybe<string | T>
```

Returns a printable formatted value for a GraphQL type.
This is the generic function.

#### Type parameters

• **T**

#### Parameters

• **entity**: `Object`

the GraphQL schema entity processed.

• **entity\.defaultValue**: `T`

the GraphQL schema type's value to be formatted.

• **entity\.type**: `Maybe`\<`GraphQLType`\>

the GraphQL schema type.

#### Returns

`Maybe`\<`string` \| `T`\>

a printable formatted value.

#### Source

[packages/graphql/src/formatter.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/4217d2c0/packages/graphql/src/formatter.ts#L94)
