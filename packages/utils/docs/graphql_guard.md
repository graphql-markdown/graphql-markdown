# Module: graphql/guard

Custom GraphQL type guards and property guards.

## Functions

### instanceOf()

```ts
instanceOf<T>(obj, type): obj is T
```

Checks if a GraphQL named type is of generic type `T`.

#### Type parameters

| Parameter | Description                                              |
| :-------- | :------------------------------------------------------- |
| `T`       | a GraphQL type to check against, eg `GraphQLObjectType`. |

#### Parameters

| Parameter | Type      | Description                                   |
| :-------- | :-------- | :-------------------------------------------- |
| `obj`     | `unknown` | a GraphQL named type from the GraphQL schema. |
| `type`    | () => `T` | the GraphQL type `T`.                         |

#### Returns

`obj is T`

#### Source

[packages/utils/src/graphql/guard.ts:49](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/graphql/guard.ts#L49)

---

### isDeprecated()

```ts
isDeprecated<T>(obj): obj is Partial<Object> & T
```

Checks if a GraphQL named type is deprecated.

#### Type parameters

| Parameter | Description                                              |
| :-------- | :------------------------------------------------------- |
| `T`       | a GraphQL type to check against, eg `GraphQLObjectType`. |

#### Parameters

| Parameter | Type | Description         |
| :-------- | :--- | :------------------ |
| `obj`     | `T`  | an instance of `T`. |

#### Returns

`obj is Partial<Object> & T`

#### Source

[packages/utils/src/graphql/guard.ts:67](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/graphql/guard.ts#L67)

---

### isGraphQLFieldType()

```ts
isGraphQLFieldType(type): type is GraphQLField<unknown, unknown, unknown>
```

Checks if a GraphQL named type is of type `GraphQLField`.

#### Parameters

| Parameter | Type      | Description     |
| :-------- | :-------- | :-------------- |
| `type`    | `unknown` | a GraphQL type. |

#### Returns

`type is GraphQLField<unknown, unknown, unknown>`

#### Source

[packages/utils/src/graphql/guard.ts:30](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/graphql/guard.ts#L30)

---

### isOperation()

```ts
isOperation(type): type is GraphQLOperationType
```

Checks if a GraphQL type a GraphQL operation (query, mutation, subscription).

#### Parameters

| Parameter | Type      | Description     |
| :-------- | :-------- | :-------------- |
| `type`    | `unknown` | a GraphQL type. |

#### Returns

`type is GraphQLOperationType`

#### Source

[packages/utils/src/graphql/guard.ts:84](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/utils/src/graphql/guard.ts#L84)
