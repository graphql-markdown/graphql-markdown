# guard

Custom GraphQL type guards and property guards.

## Functions

### instanceOf()

```ts
instanceOf<T>(obj, type): obj is T
```

Checks if a GraphQL named type is of generic type `T`.

#### Type parameters

• **T**

a GraphQL type to check against, eg `GraphQLObjectType`.

#### Parameters

• **obj**: `unknown`

a GraphQL named type from the GraphQL schema.

• **type**: () => `T`

the GraphQL type `T`.

#### Returns

`obj is T`

#### Source

[packages/graphql/src/guard.ts:52](https://github.com/graphql-markdown/graphql-markdown/blob/4217d2c0/packages/graphql/src/guard.ts#L52)

---

### isDeprecated()

```ts
isDeprecated<T>(obj): obj is DeprecatedType<T>
```

Checks if a GraphQL named type is deprecated.

#### Type parameters

• **T**

a GraphQL type to check against, eg `GraphQLObjectType`.

#### Parameters

• **obj**: `T`

an instance of `T`.

#### Returns

`obj is DeprecatedType<T>`

#### Source

[packages/graphql/src/guard.ts:70](https://github.com/graphql-markdown/graphql-markdown/blob/4217d2c0/packages/graphql/src/guard.ts#L70)

---

### isGraphQLFieldType()

```ts
isGraphQLFieldType(type): type is GraphQLField<unknown, unknown, unknown>
```

Checks if a GraphQL named type is of type `GraphQLField`.

#### Parameters

• **type**: `unknown`

a GraphQL type.

#### Returns

`type is GraphQLField<unknown, unknown, unknown>`

#### Source

[packages/graphql/src/guard.ts:33](https://github.com/graphql-markdown/graphql-markdown/blob/4217d2c0/packages/graphql/src/guard.ts#L33)

---

### isOperation()

```ts
isOperation(type): type is GraphQLOperationType
```

Checks if a GraphQL type a GraphQL operation (query, mutation, subscription).

#### Parameters

• **type**: `unknown`

a GraphQL type.

#### Returns

`type is GraphQLOperationType`

#### Source

[packages/graphql/src/guard.ts:85](https://github.com/graphql-markdown/graphql-markdown/blob/4217d2c0/packages/graphql/src/guard.ts#L85)
