# Module: formatter

Internal library of helpers for formatting GraphQL values.

## Functions

### getFormattedDefaultValue

```ts
getFormattedDefaultValue<T>(entity): Maybe< T | string >
```

Returns a printable formatted value for a GraphQL type.
This is the generic function.

#### Type parameters

| Parameter |
| :------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `entity` | `object` | the GraphQL schema entity processed. |
| `entity.defaultValue` | `T` | the GraphQL schema type's value to be formatted. |
| `entity.type` | `Maybe`\< `GraphQLType` \> | the GraphQL schema type. |

#### Returns

`Maybe`\< `T` \| `string` \>

a printable formatted value.

#### Defined In

[packages/graphql/src/formatter.ts:32](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/formatter.ts#L32)
