# guard

Custom GraphQL type guards and property guards.

## Functions

### instanceOf()

```ts
function instanceOf<T>(obj, type): obj is T
```

Checks if a GraphQL named type is of generic type `T`.

#### Type Parameters

• **T**

a GraphQL type to check against, eg `GraphQLObjectType`.

#### Parameters

• **obj**: `unknown`

a GraphQL named type from the GraphQL schema.

• **type**

the GraphQL type `T`.

#### Returns

`obj is T`

#### Defined in

[packages/graphql/src/guard.ts:57](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L57)

***

### isApiType()

```ts
function isApiType(type): boolean
```

Checks if a type belongs to API (operation related).

#### Parameters

• **type**: `unknown`

a GraphQL type.

#### Returns

`boolean`

#### Defined in

[packages/graphql/src/guard.ts:100](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L100)

***

### isDeprecated()

```ts
function isDeprecated<T>(obj): obj is DeprecatedType<T>
```

Checks if a GraphQL named type is deprecated.

#### Type Parameters

• **T**

a GraphQL type to check against, eg `GraphQLObjectType`.

#### Parameters

• **obj**: `T`

an instance of `T`.

#### Returns

`obj is DeprecatedType<T>`

#### Defined in

[packages/graphql/src/guard.ts:75](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L75)

***

### isGraphQLFieldType()

```ts
function isGraphQLFieldType(type): type is GraphQLField<unknown, unknown, unknown>
```

Checks if a GraphQL named type is of type `GraphQLField`.

#### Parameters

• **type**: `unknown`

a GraphQL type.

#### Returns

`type is GraphQLField<unknown, unknown, unknown>`

#### Defined in

[packages/graphql/src/guard.ts:38](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L38)

***

### isOperation()

```ts
function isOperation(type): type is GraphQLOperationType
```

Checks if a GraphQL type a GraphQL operation (query, mutation, subscription).

#### Parameters

• **type**: `unknown`

a GraphQL type.

#### Returns

`type is GraphQLOperationType`

#### Defined in

[packages/graphql/src/guard.ts:90](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L90)

***

### isSystemType()

```ts
function isSystemType(type): boolean
```

Checks if a type belongs to schema (schema type definition excluding operations related types).

#### Parameters

• **type**: `unknown`

a GraphQL type.

#### Returns

`boolean`

#### Defined in

[packages/graphql/src/guard.ts:113](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L113)
