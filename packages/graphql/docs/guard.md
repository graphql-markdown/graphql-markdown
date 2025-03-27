# guard

Custom GraphQL type guards and property guards.

## Functions

### executableDirectiveLocation()

```ts
function executableDirectiveLocation(directive): boolean
```

Defined in: [packages/graphql/src/guard.ts:104](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L104)

Checks if a directive is executable (related to operations).

#### Parameters

##### directive

`GraphQLDirective`

#### Returns

`boolean`

***

### instanceOf()

```ts
function instanceOf<T>(obj, type): obj is () => T
```

Defined in: [packages/graphql/src/guard.ts:58](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L58)

Checks if a GraphQL named type is of generic type `T`.

#### Type Parameters

##### T

`T`

a GraphQL type to check against, eg `GraphQLObjectType`.

#### Parameters

##### obj

`unknown`

a GraphQL named type from the GraphQL schema.

##### type

() => `T`

the GraphQL type `T`.

#### Returns

`obj is () => T`

***

### isApiType()

```ts
function isApiType(type): boolean
```

Defined in: [packages/graphql/src/guard.ts:140](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L140)

Checks if a type belongs to API (operation related).

#### Parameters

##### type

`unknown`

a GraphQL type.

#### Returns

`boolean`

***

### isDeprecated()

```ts
function isDeprecated<T>(obj): obj is DeprecatedType<T>
```

Defined in: [packages/graphql/src/guard.ts:79](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L79)

Checks if a GraphQL named type is deprecated.

#### Type Parameters

##### T

`T`

a GraphQL type to check against, eg `GraphQLObjectType`.

#### Parameters

##### obj

`T`

an instance of `T`.

#### Returns

`obj is DeprecatedType<T>`

***

### isGraphQLFieldType()

```ts
function isGraphQLFieldType(type): type is GraphQLField<unknown, unknown, unknown>
```

Defined in: [packages/graphql/src/guard.ts:39](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L39)

Checks if a GraphQL named type is of type `GraphQLField`.

#### Parameters

##### type

`unknown`

a GraphQL type.

#### Returns

`type is GraphQLField<unknown, unknown, unknown>`

***

### isOperation()

```ts
function isOperation(type): type is GraphQLOperationType
```

Defined in: [packages/graphql/src/guard.ts:94](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L94)

Checks if a GraphQL type a GraphQL operation (query, mutation, subscription).

#### Parameters

##### type

`unknown`

a GraphQL type.

#### Returns

`type is GraphQLOperationType`

***

### isSystemType()

```ts
function isSystemType(type): boolean
```

Defined in: [packages/graphql/src/guard.ts:153](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L153)

Checks if a type belongs to schema (schema type definition excluding operations related types).

#### Parameters

##### type

`unknown`

a GraphQL type.

#### Returns

`boolean`

***

### typeSystemDirectiveLocation()

```ts
function typeSystemDirectiveLocation(directive): boolean
```

Defined in: [packages/graphql/src/guard.ts:127](https://github.com/graphql-markdown/graphql-markdown/blob/main/packages/graphql/src/guard.ts#L127)

Checks if a directive is system (related to schema definition).

#### Parameters

##### directive

`GraphQLDirective`

#### Returns

`boolean`
