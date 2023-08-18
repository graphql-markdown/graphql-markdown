# Module: graphql/formatter

Internal library of helpers for formatting GraphQL values.

## Functions

### getFormattedDefaultValue()

```ts
getFormattedDefaultValue<T>(__namedParameters): Maybe< T | string >
```

Returns a printable formatted value for a GraphQL type.
This is the generic function.

#### Type parameters

| Parameter |
| :-------- |
| `T`       |

#### Parameters

| Parameter                        | Type                       |
| :------------------------------- | :------------------------- |
| `__namedParameters`              | `object`                   |
| `__namedParameters.defaultValue` | `T`                        |
| `__namedParameters.type`         | `Maybe`\< `GraphQLType` \> |

#### Returns

`Maybe`\< `T` \| `string` \>

a printable formatted value.

#### Source

[packages/utils/src/graphql/formatter.ts:31](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/graphql/formatter.ts#L31)
